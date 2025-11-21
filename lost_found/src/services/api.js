// Lightweight mock API backed by AsyncStorage so the Expo app can run without the backend.
// It implements the minimal endpoints used by the app and returns axios-like responses
// (i.e. promises resolving to an object with a `data` property).

import AsyncStorage from '@react-native-async-storage/async-storage';

const POSTS_KEY = '@lf_posts_v1';
const CLAIMS_KEY = '@lf_claims_v1';
const USER_KEY = '@lf_user_v1';

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

const nowId = () => Date.now().toString();

const defaultUser = {
  id: 'local-user-1',
  name: 'Local User',
  email: 'local@example.com',
  phone: null
};

const seedPosts = async () => {
  const existing = await AsyncStorage.getItem(POSTS_KEY);
  if (existing) return;

  const initial = [
    {
      _id: nowId(),
      type: 'found',
      title: 'Black Wallet',
      description: 'Black leather wallet near library',
      category: 'Accessories',
      color: 'Black',
      location: 'Library',
      dateTime: new Date().toISOString(),
      image: null,
      owner: { _id: 'finder-1', name: 'Asha', email: 'asha@example.com', phone: '1234567890' },
      securityQuestion: "What's the first four digits of the phone saved under 'ICE' ?",
      securityAnswer: '1234'
    },
    {
      _id: (Date.now() + 1).toString(),
      type: 'found',
      title: 'Blue Umbrella',
      description: 'Blue umbrella with wooden handle',
      category: 'Accessories',
      color: 'Blue',
      location: 'Cafeteria',
      dateTime: new Date().toISOString(),
      image: null,
      owner: { _id: 'finder-2', name: 'Rahul', email: 'rahul@example.com', phone: null },
      securityQuestion: 'What colour was the ribbon?',
      securityAnswer: 'red'
    }
  ];

  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(initial));
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
};

const loadPosts = async () => {
  const raw = await AsyncStorage.getItem(POSTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const savePosts = async (posts) => {
  await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

const loadClaims = async () => {
  const raw = await AsyncStorage.getItem(CLAIMS_KEY);
  return raw ? JSON.parse(raw) : {};
};

const saveClaims = async (claims) => {
  await AsyncStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
};

const computeScore = (lost, found) => {
  let score = 0;

  // Title overlap (50%)
  const t1 = (lost.title || '').toLowerCase();
  const t2 = (found.title || '').toLowerCase();
  const words1 = new Set(t1.split(/\W+/).filter(Boolean));
  const words2 = new Set(t2.split(/\W+/).filter(Boolean));
  let common = 0;
  words1.forEach((w) => { if (words2.has(w)) common++; });
  const maxWords = Math.max(words1.size, words2.size, 1);
  score += (common / maxWords) * 0.5;

  // Category (30%)
  if (lost.category && found.category && lost.category === found.category) score += 0.3;

  // Color (20%)
  if (lost.color && found.color && lost.color.toLowerCase() === found.color.toLowerCase()) score += 0.2;

  return Math.min(1, score);
};

// Seed posts on first import (call immediately in IIFE)
(async () => {
  await seedPosts();
})();

const api = {
  get: async (path) => {
    await delay();

    // /posts?type=found or lost
    if (path.startsWith('/posts')) {
      const [base, query] = path.split('?');

      // /posts/:id/claim-attempts
      const claimAttemptsMatch = path.match(/^\/posts\/(.+?)\/claim-attempts/);
      if (claimAttemptsMatch) {
        const postId = claimAttemptsMatch[1];
        const claims = await loadClaims();
        const entry = claims[postId] || { attemptsLeft: 3 };
        return { data: { attemptsLeft: entry.attemptsLeft, canAttempt: entry.attemptsLeft > 0 } };
      }

      // /posts/my-posts
      if (path === '/posts/my-posts') {
        const posts = await loadPosts();
        const userRaw = await AsyncStorage.getItem(USER_KEY);
        const user = userRaw ? JSON.parse(userRaw) : defaultUser;
        const my = posts.filter((p) => (p.owner && (p.owner._id === user.id || p.owner._id === user._id)) || (p.owner && p.owner._id === user.id));
        return { data: { posts: my } };
      }

      // /posts?type=lost or found
      const typeMatch = path.match(/type=(found|lost)/);
      if (typeMatch) {
        const type = typeMatch[1];
        const posts = await loadPosts();
        const filtered = posts.filter((p) => p.type === type);
        return { data: { posts: filtered } };
      }
    }

    // Default empty
    return { data: {} };
  },

  post: async (path, body, options = {}) => {
    await delay();

    // Register: POST /auth/register
    if (path === '/auth/register') {
      const user = {
        id: 'local-user-' + Date.now(),
        _id: 'local-user-' + Date.now(),
        name: body.name || 'Local User',
        email: body.email || 'local@example.com',
        phone: body.phone || null
      };
      const token = 'mock-jwt-token-' + Date.now();
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return { data: { token, user } };
    }

    // Login: POST /auth/login
    if (path === '/auth/login') {
      const userRaw = await AsyncStorage.getItem(USER_KEY);
      const user = userRaw ? JSON.parse(userRaw) : {
        id: 'local-user-1',
        _id: 'local-user-1',
        name: 'Local User',
        email: body.email || 'local@example.com',
        phone: null
      };
      const token = 'mock-jwt-token-' + Date.now();
      return { data: { token, user } };
    }

    // Create a post: POST /posts
    if (path === '/posts') {
      const posts = await loadPosts();
      const userRaw = await AsyncStorage.getItem(USER_KEY);
      const user = userRaw ? JSON.parse(userRaw) : defaultUser;

      const newPost = {
        _id: nowId(),
        type: body.get ? body.get('type') : body.type,
        title: body.get ? body.get('title') : body.title,
        description: body.get ? body.get('description') : body.description,
        category: body.get ? body.get('category') : body.category,
        color: body.get ? body.get('color') : body.color,
        location: body.get ? body.get('location') : body.location,
        dateTime: body.get ? body.get('dateTime') : body.dateTime,
        image: null,
        owner: { _id: user.id || user._id, name: user.name, email: user.email, phone: user.phone },
        securityQuestion: body.get ? body.get('securityQuestion') : body.securityQuestion,
        securityAnswer: body.get ? body.get('securityAnswer') : body.securityAnswer
      };

      // If an image file is passed through FormData, we can't upload it here; store its local uri if available
      if (body.get && body._parts) {
        const imagePart = body._parts.find((p) => p[0] === 'image');
        if (imagePart && imagePart[1] && imagePart[1].uri) {
          newPost.image = imagePart[1].uri;
        }
      } else if (body.image) {
        newPost.image = body.image;
      }

      posts.unshift(newPost);
      await savePosts(posts);

      // If creating a lost post, compute simple matches against found posts
      if (newPost.type === 'lost') {
        const founds = posts.filter((p) => p.type === 'found');
        const matches = founds.map((f) => ({ post: f, score: computeScore(newPost, f) })).filter(m => m.score > 0);
        matches.sort((a,b) => b.score - a.score);
        return { data: { post: newPost, matches } };
      }

      return { data: { post: newPost } };
    }

    // Claim a post: POST /posts/:id/claim
    const claimMatch = path.match(/^\/posts\/(.+?)\/claim/);
    if (claimMatch) {
      const postId = claimMatch[1];
      const posts = await loadPosts();
      const post = posts.find((p) => p._id === postId);
      if (!post) return { data: { success: false, message: 'Post not found' } };

      const claims = await loadClaims();
      const entry = claims[postId] || { attemptsLeft: 3 };

      if (entry.attemptsLeft <= 0) {
        return { data: { success: false, message: 'No attempts left', attemptsLeft: 0 } };
      }

      const provided = body.answer || body.get?.('answer');
      const correct = post.securityAnswer;

      if (provided && correct && provided.toString().trim().toLowerCase() === correct.toString().trim().toLowerCase()) {
        // success
        entry.attemptsLeft = Math.max(0, entry.attemptsLeft);
        claims[postId] = entry;
        await saveClaims(claims);
        return { data: { success: true, foundOwnerContact: post.owner } };
      }

      // wrong answer
      entry.attemptsLeft = Math.max(0, (entry.attemptsLeft || 3) - 1);
      claims[postId] = entry;
      await saveClaims(claims);

      return { data: { success: false, message: 'Incorrect answer', attemptsLeft: entry.attemptsLeft } };
    }

    return { data: {} };
  },

  delete: async (path) => {
    await delay();
    const delMatch = path.match(/^\/posts\/(.+)/);
    if (delMatch) {
      const postId = delMatch[1];
      let posts = await loadPosts();
      const before = posts.length;
      posts = posts.filter((p) => p._id !== postId);
      await savePosts(posts);
      return { data: { deleted: before - posts.length } };
    }

    return { data: {} };
  }
};

export default api;
