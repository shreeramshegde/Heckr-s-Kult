const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');
const Post = require('../models/Post');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lost_found');
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john.doe@nie.ac.in',
        password: 'password123',
        phone: '9876543210'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@nie.ac.in',
        password: 'password123',
        phone: '9876543211'
      },
      {
        name: 'Admin User',
        email: 'admin@nie.ac.in',
        password: 'admin123',
        phone: '9876543212',
        isAdmin: true
      }
    ]);
    console.log('✓ Created users');

    // Create lost posts
    const lostPosts = await Post.create([
      {
        type: 'lost',
        title: 'Black iPhone 13',
        description: 'Black iPhone 13 with a blue case. Lost near the library on November 18th.',
        category: 'Electronics',
        color: 'Black',
        location: 'Main Library',
        dateTime: new Date('2025-11-18T14:30:00'),
        owner: users[0]._id,
        securityQuestion: 'What is the wallpaper on the phone?',
        securityAnswerHash: await bcrypt.hash('mountain landscape', 10)
      },
      {
        type: 'lost',
        title: 'Red Engineering Notebook',
        description: 'Red spiral notebook with engineering notes. Has my name written inside.',
        category: 'Books',
        color: 'Red',
        location: 'Engineering Block A',
        dateTime: new Date('2025-11-19T10:00:00'),
        owner: users[1]._id,
        securityQuestion: 'What subject are the notes for?',
        securityAnswerHash: await bcrypt.hash('mechanical engineering', 10)
      },
      {
        type: 'lost',
        title: 'Silver Watch',
        description: 'Silver analog watch with brown leather strap. Sentimental value.',
        category: 'Accessories',
        color: 'Silver',
        location: 'Sports Complex',
        dateTime: new Date('2025-11-17T16:00:00'),
        owner: users[0]._id,
        securityQuestion: 'What brand is the watch?',
        securityAnswerHash: await bcrypt.hash('fossil', 10)
      },
      {
        type: 'lost',
        title: 'Blue Backpack',
        description: 'Navy blue backpack with laptop compartment. Contains important documents.',
        category: 'Other',
        color: 'Blue',
        location: 'Cafeteria',
        dateTime: new Date('2025-11-20T12:00:00'),
        owner: users[1]._id,
        securityQuestion: 'What is the brand of the laptop inside?',
        securityAnswerHash: await bcrypt.hash('dell', 10)
      },
      {
        type: 'lost',
        title: 'College ID Card',
        description: 'Student ID card with photo. Need it urgently for exams.',
        category: 'ID Cards',
        color: 'White',
        location: 'Exam Hall 2',
        dateTime: new Date('2025-11-19T09:00:00'),
        owner: users[0]._id,
        securityQuestion: 'What is the student ID number?',
        securityAnswerHash: await bcrypt.hash('nie2021cs001', 10)
      }
    ]);
    console.log('✓ Created lost posts');

    // Create found posts
    const foundPosts = await Post.create([
      {
        type: 'found',
        title: 'Black Phone',
        description: 'Found a black smartphone near the library. Has a blue protective case.',
        category: 'Electronics',
        color: 'Black',
        location: 'Main Library',
        dateTime: new Date('2025-11-18T15:00:00'),
        owner: users[1]._id
      },
      {
        type: 'found',
        title: 'Notebook',
        description: 'Found a red colored notebook in Engineering Block. Contains handwritten notes.',
        category: 'Books',
        color: 'Red',
        location: 'Engineering Block A',
        dateTime: new Date('2025-11-19T11:00:00'),
        owner: users[0]._id
      },
      {
        type: 'found',
        title: 'Keys with Keychain',
        description: 'Found a bunch of keys with a red keychain near the parking lot.',
        category: 'Keys',
        color: 'Silver',
        location: 'Parking Lot B',
        dateTime: new Date('2025-11-20T08:00:00'),
        owner: users[1]._id
      },
      {
        type: 'found',
        title: 'Water Bottle',
        description: 'Blue metal water bottle found in the gym. Has some stickers on it.',
        category: 'Other',
        color: 'Blue',
        location: 'Gymnasium',
        dateTime: new Date('2025-11-19T17:00:00'),
        owner: users[0]._id
      }
    ]);
    console.log('✓ Created found posts');

    console.log('\n========================================');
    console.log('Seed data created successfully!');
    console.log('========================================');
    console.log('\nTest Users:');
    console.log('1. Email: john.doe@nie.ac.in | Password: password123');
    console.log('2. Email: jane.smith@nie.ac.in | Password: password123');
    console.log('3. Email: admin@nie.ac.in | Password: admin123 (Admin)');
    console.log('\nTotal Lost Posts:', lostPosts.length);
    console.log('Total Found Posts:', foundPosts.length);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
