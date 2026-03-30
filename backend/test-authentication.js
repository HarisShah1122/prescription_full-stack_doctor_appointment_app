// Test script for secure authentication system
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test configuration
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

// Helper function to make requests
const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return { error };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...');
  const { response, data } = await makeRequest('/health');
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return response.status === 200;
};

const testLogin = async () => {
  console.log('\n🔐 Testing Login...');
  
  const { response, data } = await makeRequest('/user/login', {
    method: 'POST',
    body: JSON.stringify(TEST_USER)
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  // Extract token from response or cookies
  let token = data?.data?.token;
  const cookies = response.headers.get('set-cookie');
  
  console.log('Token from response:', token ? 'Present' : 'Missing');
  console.log('Cookies:', cookies || 'None');
  
  return { success: response.status === 200, token, cookies };
};

const testProtectedRoute = async (token) => {
  console.log('\n🛡️ Testing Protected Route...');
  
  const { response, data } = await makeRequest('/user/get-profile', {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return response.status === 200;
};

const testRateLimiting = async () => {
  console.log('\n⏱️ Testing Rate Limiting...');
  
  let successCount = 0;
  let rateLimited = false;
  
  // Make 7 requests (limit is 5 per minute)
  for (let i = 1; i <= 7; i++) {
    console.log(`Request ${i}...`);
    
    const { response, data } = await makeRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
    });
    
    if (response.status === 429) {
      rateLimited = true;
      console.log(`⚠️ Rate limited on request ${i}`);
      break;
    } else if (response.status === 401) {
      successCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`Successful attempts: ${successCount}`);
  console.log(`Rate limiting working: ${rateLimited ? 'Yes' : 'No'}`);
  
  return rateLimited;
};

const testTokenRefresh = async (token) => {
  console.log('\n🔄 Testing Token Refresh...');
  
  const { response, data } = await makeRequest('/user/refresh-token', {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return response.status === 200;
};

const testLogout = async (token) => {
  console.log('\n🚪 Testing Logout...');
  
  const { response, data } = await makeRequest('/user/logout', {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return response.status === 200;
};

const testInvalidToken = async () => {
  console.log('\n❌ Testing Invalid Token...');
  
  const { response, data } = await makeRequest('/user/get-profile', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer invalid_token_here' }
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  return response.status === 401;
};

const runTests = async () => {
  console.log('🧪 Starting Authentication Tests...');
  console.log('=====================================');
  
  const results = {
    healthCheck: false,
    login: false,
    protectedRoute: false,
    rateLimiting: false,
    tokenRefresh: false,
    logout: false,
    invalidToken: false
  };
  
  try {
    // Test 1: Health Check
    results.healthCheck = await testHealthCheck();
    
    // Test 2: Login (this will likely fail if test user doesn't exist)
    const loginResult = await testLogin();
    results.login = loginResult.success;
    
    if (loginResult.success && loginResult.token) {
      // Test 3: Protected Route
      results.protectedRoute = await testProtectedRoute(loginResult.token);
      
      // Test 4: Token Refresh
      results.tokenRefresh = await testTokenRefresh(loginResult.token);
      
      // Test 5: Logout
      results.logout = await testLogout(loginResult.token);
    }
    
    // Test 6: Rate Limiting
    results.rateLimiting = await testRateLimiting();
    
    // Test 7: Invalid Token
    results.invalidToken = await testInvalidToken();
    
  } catch (error) {
    console.error('💥 Test suite error:', error);
  }
  
  // Results Summary
  console.log('\n📊 Test Results Summary');
  console.log('=====================================');
  console.log(`Health Check: ${results.healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Protected Route: ${results.protectedRoute ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Rate Limiting: ${results.rateLimiting ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Token Refresh: ${results.tokenRefresh ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Logout: ${results.logout ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Invalid Token: ${results.invalidToken ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
};

// Run tests
runTests().catch(console.error);
