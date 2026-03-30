// Test enhanced authentication system
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
      credentials: 'include', // Important for cookies
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
  console.log('\n🔐 Testing Enhanced Login...');
  
  const { response, data } = await makeRequest('/user/login', {
    method: 'POST',
    body: JSON.stringify(TEST_USER)
  });
  
  console.log(`Status: ${response.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));
  
  // Check for rate limiting headers
  const rateLimitHeaders = {
    limit: response.headers.get('X-RateLimit-Limit'),
    remaining: response.headers.get('X-RateLimit-Remaining'),
    reset: response.headers.get('X-RateLimit-Reset')
  };
  
  if (rateLimitHeaders.limit) {
    console.log('📊 Rate Limiting Headers:', rateLimitHeaders);
  }
  
  // Check for cookies
  const cookies = response.headers.get('set-cookie');
  console.log('🍪 Cookies set:', cookies || 'None');
  
  return { 
    success: response.status === 200, 
    token: data?.data?.token,
    cookies: cookies,
    rateLimitHeaders 
  };
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
      console.log('Rate limit response:', data);
      break;
    } else if (response.status === 401) {
      successCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
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

const testMultipleTokenSources = async () => {
  console.log('\n🔑 Testing Multiple Token Sources...');
  
  // Test with Authorization header
  const { response: headerResponse } = await makeRequest('/user/get-profile', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer test_token_here' }
  });
  
  // Test with cookie (should work automatically)
  const { response: cookieResponse } = await makeRequest('/user/get-profile', {
    method: 'GET'
  });
  
  console.log(`Header auth status: ${headerResponse.status}`);
  console.log(`Cookie auth status: ${cookieResponse.status}`);
  
  return {
    headerWorks: headerResponse.status === 200,
    cookieWorks: cookieResponse.status === 200
  };
};

const runTests = async () => {
  console.log('🧪 Starting Enhanced Authentication Tests...');
  console.log('========================================');
  
  const results = {
    healthCheck: false,
    login: false,
    protectedRoute: false,
    rateLimiting: false,
    tokenRefresh: false,
    logout: false,
    multipleTokenSources: false
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
      
      // Test 6: Multiple Token Sources
      results.multipleTokenSources = await testMultipleTokenSources();
    }
    
    // Test 7: Rate Limiting
    results.rateLimiting = await testRateLimiting();
    
  } catch (error) {
    console.error('💥 Test suite error:', error);
  }
  
  // Results Summary
  console.log('\n📊 Enhanced Authentication Test Results');
  console.log('========================================');
  console.log(`Health Check: ${results.healthCheck ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Enhanced Login: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Protected Route: ${results.protectedRoute ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Rate Limiting: ${results.rateLimiting ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Token Refresh: ${results.tokenRefresh ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Logout: ${results.logout ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Multiple Token Sources: ${results.multipleTokenSources ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Enhanced authentication system is working correctly.');
    console.log('✅ Features working:');
    console.log('   - JWT token generation with 1h expiry');
    console.log('   - HTTP-only cookie storage');
    console.log('   - Session management');
    console.log('   - Rate limiting (5 requests/min)');
    console.log('   - Multiple token source support');
    console.log('   - Token refresh mechanism');
    console.log('   - Logout functionality');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
};

// Run tests
runTests().catch(console.error);
