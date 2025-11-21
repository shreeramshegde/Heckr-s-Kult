#!/usr/bin/env node

// Simple test script to verify the external API endpoint
const testFeedbackAPI = async () => {
  const testData = {
    rating: 4,
    experience: "satisfied",
    tmfcid: "TMFC001TC",
    comments: "Good service overall - Test from Lost & Found app"
  };

  try {
    console.log('Testing feedback API...');
    console.log('Sending:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('https://telemetry-api-iota.vercel.app/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ API test successful!');
      try {
        const jsonResult = JSON.parse(result);
        console.log('Parsed response:', JSON.stringify(jsonResult, null, 2));
      } catch (e) {
        console.log('Response is not valid JSON');
      }
    } else {
      console.log('❌ API test failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ API test error:', error.message);
  }
};

// Run the test
testFeedbackAPI();