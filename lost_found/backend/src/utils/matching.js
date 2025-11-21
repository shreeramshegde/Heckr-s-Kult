const stringSimilarity = require('string-similarity');
const Post = require('../models/Post');
const Match = require('../models/Match');
const Notification = require('../models/Notification');

/**
 * Matching algorithm for found items against lost items
 * Combines multiple factors: category, color, date proximity, text similarity, location
 */
async function findMatches(foundPost) {
  try {
    // Get all active lost posts
    const lostPosts = await Post.find({
      type: 'lost',
      status: 'active'
    }).populate('owner', 'name email phone');

    const matches = [];

    for (const lostPost of lostPosts) {
      const score = calculateMatchScore(foundPost, lostPost);
      
      if (score.total >= 0.6) { // Threshold: 60%
        matches.push({
          lostPost,
          score: score.total,
          details: score
        });
      }
    }

    // Sort by score descending and get top 3
    matches.sort((a, b) => b.score - a.score);
    const topMatches = matches.slice(0, 3);

    // Save matches to database
    for (const match of topMatches) {
      const matchDoc = new Match({
        lostPost: match.lostPost._id,
        foundPost: foundPost._id,
        score: match.score,
        matchDetails: {
          categoryMatch: match.details.categoryMatch,
          colorMatch: match.details.colorMatch,
          dateProximity: match.details.dateProximity,
          textSimilarity: match.details.textSimilarity,
          locationMatch: match.details.locationMatch
        }
      });
      await matchDoc.save();

      // Create notification for lost post owner to answer found user's security question
      await Notification.create({
        user: match.lostPost.owner._id,
        type: 'match',
        title: 'Potential Match Found!',
        message: `A found item "${foundPost.title}" matches your lost item "${match.lostPost.title}". Answer the finder's security question to get their contact.`,
        relatedPost: foundPost._id
      });
    }

    return topMatches;
  } catch (error) {
    console.error('Error in findMatches:', error);
    throw error;
  }
}

/**
 * Calculate match score between found and lost items
 */
function calculateMatchScore(foundPost, lostPost) {
  let totalScore = 0;
  let weights = {
    category: 0.3,
    color: 0.2,
    date: 0.2,
    text: 0.2,
    location: 0.1
  };

  // Category match (exact)
  const categoryMatch = foundPost.category === lostPost.category;
  if (categoryMatch) {
    totalScore += weights.category;
  }

  // Color match (case-insensitive, partial)
  let colorMatch = false;
  if (foundPost.color && lostPost.color) {
    const foundColor = foundPost.color.toLowerCase();
    const lostColor = lostPost.color.toLowerCase();
    colorMatch = foundColor.includes(lostColor) || lostColor.includes(foundColor);
    if (colorMatch) {
      totalScore += weights.color;
    }
  }

  // Date proximity (within 7 days = full score, linear decay)
  const dateDiff = Math.abs(foundPost.dateTime - lostPost.dateTime);
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  const dateProximity = Math.max(0, 1 - (daysDiff / 7));
  totalScore += dateProximity * weights.date;

  // Text similarity (title + description)
  const foundText = (foundPost.title + ' ' + foundPost.description).toLowerCase();
  const lostText = (lostPost.title + ' ' + lostPost.description).toLowerCase();
  const textSimilarity = stringSimilarity.compareTwoStrings(foundText, lostText);
  totalScore += textSimilarity * weights.text;

  // Location match (case-insensitive, partial)
  let locationMatch = false;
  if (foundPost.location && lostPost.location) {
    const foundLoc = foundPost.location.toLowerCase();
    const lostLoc = lostPost.location.toLowerCase();
    locationMatch = foundLoc.includes(lostLoc) || lostLoc.includes(foundLoc);
    if (locationMatch) {
      totalScore += weights.location;
    }
  }

  return {
    total: totalScore,
    categoryMatch,
    colorMatch,
    dateProximity,
    textSimilarity,
    locationMatch
  };
}

/**
 * Matching algorithm for lost items against found items
 * When user posts a lost item, find matching found items
 */
async function findMatchesForLostPost(lostPost) {
  try {
    // Get all active found posts with security questions
    const foundPosts = await Post.find({
      type: 'found',
      status: 'active',
      securityQuestion: { $exists: true, $ne: null }
    }).populate('owner', 'name email phone').select('+securityQuestion');

    const matches = [];

    for (const foundPost of foundPosts) {
      const score = calculateMatchScoreReverse(lostPost, foundPost);
      
      if (score.total >= 0.6) { // Threshold: 60%
        matches.push({
          foundPost,
          score: score.total,
          details: score
        });
      }
    }

    // Sort by score descending and get top matches
    matches.sort((a, b) => b.score - a.score);

    console.log(`Found ${matches.length} matching found items for lost post`);

    return matches;
  } catch (error) {
    console.error('Error in findMatchesForLostPost:', error);
    throw error;
  }
}

/**
 * Calculate match score (reverse: lost vs found)
 */
function calculateMatchScoreReverse(lostPost, foundPost) {
  let totalScore = 0;
  let weights = {
    category: 0.3,
    color: 0.2,
    date: 0.2,
    text: 0.2,
    location: 0.1
  };

  // Category match (exact)
  const categoryMatch = lostPost.category === foundPost.category;
  if (categoryMatch) {
    totalScore += weights.category;
  }

  // Color match (case-insensitive, partial)
  let colorMatch = false;
  if (lostPost.color && foundPost.color) {
    const lostColor = lostPost.color.toLowerCase();
    const foundColor = foundPost.color.toLowerCase();
    colorMatch = lostColor.includes(foundColor) || foundColor.includes(lostColor);
    if (colorMatch) {
      totalScore += weights.color;
    }
  }

  // Date proximity (within 7 days = full score, linear decay)
  const dateDiff = Math.abs(lostPost.dateTime - foundPost.dateTime);
  const daysDiff = dateDiff / (1000 * 60 * 60 * 24);
  const dateProximity = Math.max(0, 1 - (daysDiff / 7));
  totalScore += dateProximity * weights.date;

  // Text similarity (title + description)
  const lostText = (lostPost.title + ' ' + lostPost.description).toLowerCase();
  const foundText = (foundPost.title + ' ' + foundPost.description).toLowerCase();
  const textSimilarity = stringSimilarity.compareTwoStrings(lostText, foundText);
  totalScore += textSimilarity * weights.text;

  // Location match (case-insensitive, partial)
  let locationMatch = false;
  if (lostPost.location && foundPost.location) {
    const lostLoc = lostPost.location.toLowerCase();
    const foundLoc = foundPost.location.toLowerCase();
    locationMatch = lostLoc.includes(foundLoc) || foundLoc.includes(lostLoc);
    if (locationMatch) {
      totalScore += weights.location;
    }
  }

  return {
    total: totalScore,
    categoryMatch,
    colorMatch,
    dateProximity,
    textSimilarity,
    locationMatch
  };
}

module.exports = { findMatches, findMatchesForLostPost, calculateMatchScore, calculateMatchScoreReverse };
