const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/User');

describe('Auth API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lost_found_test');
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    test('Should register a new user with @nie.ac.in email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@nie.ac.in',
          password: 'password123',
          phone: '1234567890'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('testuser@nie.ac.in');
    });

    test('Should reject non-@nie.ac.in email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@gmail.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors || response.body.error).toBeDefined();
    });

    test('Should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'duplicate@nie.ac.in',
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Two',
          email: 'duplicate@nie.ac.in',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already registered');
    });

    test('Should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'weak@nie.ac.in',
          password: '123'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test',
          email: 'logintest@nie.ac.in',
          password: 'password123'
        });
    });

    test('Should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@nie.ac.in',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('logintest@nie.ac.in');
    });

    test('Should reject wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@nie.ac.in',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });

    test('Should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@nie.ac.in',
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });

    test('Should reject non-@nie.ac.in email on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@gmail.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });
  });
});
