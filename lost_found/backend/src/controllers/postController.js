const Post = require('../models/Post');
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { createThumbnail, deleteFile } = require('../utils/imageProcessor');
const { findMatches, findMatchesForLostPost } = require('../utils/matching');
const path = require('path');

const createPostValidation = [
  body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Electronics', 'Books', 'Accessories', 'Clothing', 'ID Cards', 'Keys', 'Other'])
    .withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('dateTime').isISO8601().withMessage('Invalid date format')
];

const getPosts = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Hide owner contact for lost posts unless claimed
    if (post.type === 'lost' && post.status !== 'claimed') {
      if (req.userId.toString() !== post.owner._id.toString()) {
        post.owner.phone = undefined;
      }
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, title, description, category, color, location, dateTime, securityQuestion, securityAnswer } = req.body;

    // Validate security question for found posts (finder asks, lost user answers)
    if (type === 'found' && (!securityQuestion || !securityAnswer)) {
      return res.status(400).json({ error: 'Security question and answer required for found posts' });
    }

    const postData = {
      type,
      title,
      description,
      category,
      color,
      location,
      dateTime,
      owner: req.userId
    };

    // Handle image upload
    if (req.file) {
      postData.image = req.file.path;
      const thumbnail = await createThumbnail(req.file.path);
      if (thumbnail) {
        postData.thumbnail = thumbnail;
      }
    }

    // Hash security answer for found posts (finder's question)
    if (type === 'found') {
      postData.securityQuestion = securityQuestion;
      postData.securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);
    }

    const post = new Post(postData);
    await post.save();

    let matches = [];
    
    // Trigger matching based on post type
    if (type === 'found') {
      // Found post - find matching lost items and notify them
      try {
        matches = await findMatches(post);
        console.log(`Found ${matches.length} potential matches for found post ${post._id}`);
      } catch (matchError) {
        console.error('Matching error:', matchError);
      }
    } else if (type === 'lost') {
      // Lost post - find matching found items and return them to user
      try {
        matches = await findMatchesForLostPost(post);
        console.log(`Found ${matches.length} potential matches for lost post ${post._id}`);
      } catch (matchError) {
        console.error('Matching error:', matchError);
      }
    }

    await post.populate('owner', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post,
      matches: matches.map(m => ({
        post: m.foundPost || m.lostPost,
        score: m.score,
        details: m.details
      }))
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership
    if (post.owner.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { title, description, category, color, location, status } = req.body;

    if (title) post.title = title;
    if (description) post.description = description;
    if (category) post.category = category;
    if (color) post.color = color;
    if (location) post.location = location;
    if (status) post.status = status;

    await post.save();

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check ownership or admin
    if (post.owner.toString() !== req.userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete associated images
    if (post.image) {
      await deleteFile(post.image);
    }
    if (post.thumbnail) {
      await deleteFile(post.thumbnail);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const claimPost = async (req, res) => {
  try {
    const { foundId } = req.params;
    const { answer } = req.body;

    console.log('Claim attempt for post:', foundId);

    const foundPost = await Post.findById(foundId).populate('owner', 'name email phone');

    if (!foundPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    console.log('Found post:', foundPost.title, 'Owner:', foundPost.owner);

    if (foundPost.type !== 'found') {
      return res.status(400).json({ error: 'Can only claim found posts by answering finder\'s question' });
    }

    if (!answer) {
      return res.status(400).json({ error: 'Security answer is required' });
    }

    // Get claimer (lost user) details
    const User = require('../models/User');
    const lostUser = await User.findById(req.userId).select('name email phone');

    if (!lostUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Lost user:', lostUser.name);

    // Check how many attempts this user has made
    const userAttempts = foundPost.claimAttempts.filter(
      attempt => attempt.user.toString() === req.userId.toString()
    );

    console.log('User attempts:', userAttempts.length);

    // Limit to 3 attempts per user
    if (userAttempts.length >= 3) {
      return res.status(403).json({ 
        error: 'Maximum attempts reached',
        message: 'You have used all 3 attempts to answer the security question.',
        attemptsLeft: 0
      });
    }

    let isCorrect = false;

    // If post has security question, validate it
    if (foundPost.securityAnswerHash) {
      console.log('Validating security answer...');
      isCorrect = await bcrypt.compare(answer.toLowerCase().trim(), foundPost.securityAnswerHash);
      console.log('Answer correct:', isCorrect);
    } else {
      // No security question - auto-approve and exchange contact details
      console.log('No security question - auto-approving claim');
      isCorrect = true;
    }

    // Log claim attempt
    foundPost.claimAttempts.push({
      user: req.userId,
      success: isCorrect
    });
    await foundPost.save();

    const attemptsLeft = 3 - (userAttempts.length + 1);

    if (isCorrect) {
      // Send notification to FOUND ITEM OWNER with LOST USER credentials
      await Notification.create({
        user: foundPost.owner._id,
        type: 'claim',
        title: '✅ Item Owner Found!',
        message: `The owner of the lost item answered your security question correctly for "${foundPost.title}". Contact them: ${lostUser.name}, Email: ${lostUser.email}, Phone: ${lostUser.phone || 'Not provided'}`,
        relatedPost: foundPost._id
      });

      // Send notification to LOST USER with FOUND OWNER credentials
      await Notification.create({
        user: req.userId,
        type: 'claim',
        title: '✅ Correct Answer! Contact Finder',
        message: `You correctly answered the finder's security question for "${foundPost.title}". Finder details: ${foundPost.owner.name}, Email: ${foundPost.owner.email}, Phone: ${foundPost.owner.phone || 'Not provided'}`,
        relatedPost: foundPost._id
      });

      console.log('Sending success response with contact details');

      res.json({
        success: true,
        message: 'Correct answer! Contact details exchanged.',
        foundOwnerContact: {
          name: foundPost.owner.name,
          email: foundPost.owner.email,
          phone: foundPost.owner.phone || 'Not provided'
        },
        yourDetails: {
          name: lostUser.name,
          email: lostUser.email,
          phone: lostUser.phone || 'Not provided'
        },
        note: 'Both you and the finder have been notified with each other\'s contact details.'
      });
    } else {
      res.json({
        success: false,
        message: `Incorrect answer. You have ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
        attemptsLeft: attemptsLeft
      });
    }
  } catch (error) {
    console.error('Claim post error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.userId })
      .sort({ createdAt: -1 });

    res.json({ posts });
  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMatches = async (req, res) => {
  try {
    const { postId } = req.params;

    const matches = await Match.find({
      $or: [{ lostPost: postId }, { foundPost: postId }]
    })
      .populate('lostPost')
      .populate('foundPost')
      .sort({ score: -1 });

    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getClaimAttempts = async (req, res) => {
  try {
    const { id } = req.params;

    const foundPost = await Post.findById(id);

    if (!foundPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Count attempts by current user
    const userAttempts = foundPost.claimAttempts.filter(
      attempt => attempt.user.toString() === req.userId.toString()
    );

    const attemptsUsed = userAttempts.length;
    const attemptsLeft = Math.max(0, 3 - attemptsUsed);

    res.json({
      attemptsUsed,
      attemptsLeft,
      maxAttempts: 3,
      canAttempt: attemptsLeft > 0
    });
  } catch (error) {
    console.error('Get claim attempts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  claimPost,
  getMyPosts,
  getMatches,
  getClaimAttempts,
  createPostValidation
};
