const { calculateMatchScore } = require('../src/utils/matching');

describe('Matching Algorithm Tests', () => {
  test('Perfect match should score close to 1.0', () => {
    const foundPost = {
      category: 'Electronics',
      color: 'black',
      title: 'iPhone 13',
      description: 'Black iPhone 13 with case',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const lostPost = {
      category: 'Electronics',
      color: 'black',
      title: 'iPhone 13',
      description: 'Black iPhone 13 with case',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.total).toBeGreaterThan(0.8);
    expect(score.categoryMatch).toBe(true);
    expect(score.colorMatch).toBe(true);
    expect(score.locationMatch).toBe(true);
  });

  test('Different category should reduce score', () => {
    const foundPost = {
      category: 'Electronics',
      color: 'black',
      title: 'Phone',
      description: 'Black phone',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const lostPost = {
      category: 'Books',
      color: 'black',
      title: 'Phone',
      description: 'Black phone',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.categoryMatch).toBe(false);
    expect(score.total).toBeLessThan(0.7);
  });

  test('Date proximity should affect score', () => {
    const foundPost = {
      category: 'Electronics',
      color: 'black',
      title: 'Phone',
      description: 'Black phone',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const lostPost = {
      category: 'Electronics',
      color: 'black',
      title: 'Phone',
      description: 'Black phone',
      location: 'Library',
      dateTime: new Date('2025-11-10') // 10 days earlier
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.dateProximity).toBeLessThan(0.5);
  });

  test('Color partial match should work', () => {
    const foundPost = {
      category: 'Electronics',
      color: 'dark blue',
      title: 'Phone',
      description: 'Phone',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const lostPost = {
      category: 'Electronics',
      color: 'blue',
      title: 'Phone',
      description: 'Phone',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.colorMatch).toBe(true);
  });

  test('Text similarity should contribute to score', () => {
    const foundPost = {
      category: 'Electronics',
      color: 'black',
      title: 'Samsung Galaxy S21',
      description: 'Black Samsung phone with cracked screen',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const lostPost = {
      category: 'Electronics',
      color: 'black',
      title: 'Samsung S21',
      description: 'Samsung phone black color',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.textSimilarity).toBeGreaterThan(0.3);
  });

  test('No match should score low', () => {
    const foundPost = {
      category: 'Books',
      color: 'red',
      title: 'Mathematics Textbook',
      description: 'Red mathematics book',
      location: 'Cafeteria',
      dateTime: new Date('2025-11-01')
    };

    const lostPost = {
      category: 'Electronics',
      color: 'black',
      title: 'iPhone',
      description: 'Black iPhone 13',
      location: 'Library',
      dateTime: new Date('2025-11-20')
    };

    const score = calculateMatchScore(foundPost, lostPost);
    
    expect(score.total).toBeLessThan(0.3);
    expect(score.categoryMatch).toBe(false);
    expect(score.colorMatch).toBe(false);
  });
});
