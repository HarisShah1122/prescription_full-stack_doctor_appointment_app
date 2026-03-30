// Test cookie flow for TOKEN_MISSING fix
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test user data
const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123!'
};

async function testCookieFlow() {
  console.log('🍪 Testing Cookie Flow for TOKEN_MISSING Fix');
  console.log('=============================================');

  // Test 1: Server health
  console.log('\n🏥 Testing server health...');
  try {
    const healthResponse = await fetch('http://localhost:4000/health');
    const healthData = await healthResponse.json();
    console.log(`Health Status: ${healthResponse.status}`);
    console.log('Health Response:', JSON.stringify(healthData, null, 2));
  } catch (error) {
    console.log('❌ Server not running:', error.message);
    return;
  }

  // Test 2: Login with detailed cookie tracking
  console.log('\n🔐 Testing login with cookie tracking...');
  try {
    const loginResponse = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    const loginData = await loginResponse.json();
    console.log(`Login Status: ${loginResponse.status}`);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    // Check Set-Cookie header
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    console.log('Set-Cookie Header:', setCookieHeader);

    if (loginData.success && setCookieHeader) {
      console.log('✅ Login successful and cookie set!');
      
      // Extract cookie for manual testing
      const cookieMatch = setCookieHeader.match(/token=([^;]+)/);
      const token = cookieMatch ? cookieMatch[1] : null;
      
      if (token) {
        console.log('✅ Token extracted from cookie:', token.substring(0, 20) + '...');

        // Test 3: Protected route with automatic cookie handling
        console.log('\n🔒 Testing protected route (automatic cookies)...');
        try {
          const profileResponse = await fetch(`${API_BASE}/user/get-profile`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Origin': 'http://localhost:5173',
              'Referer': 'http://localhost:5173'
            },
            credentials: 'include'
          });

          const profileData = await profileResponse.json();
          console.log(`Profile Status: ${profileResponse.status}`);
          console.log('Profile Response:', JSON.stringify(profileData, null, 2));

          if (profileData.success) {
            console.log('✅ Protected route successful with cookies!');
          } else if (profileData.code === 'TOKEN_MISSING') {
            console.log('❌ TOKEN_MISSING - investigating...');
            console.log('Debug info:', profileData.debug);
          } else {
            console.log('❌ Other error:', profileData.message);
          }
        } catch (profileError) {
          console.error('💥 Profile request error:', profileError.message);
        }

        // Test 4: Protected route with manual cookie header
        console.log('\n🔒 Testing protected route (manual cookie header)...');
        try {
          const manualCookieResponse = await fetch(`${API_BASE}/user/get-profile`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Cookie': `token=${token}`,
              'Origin': 'http://localhost:5173'
            },
            credentials: 'include'
          });

          const manualCookieData = await manualCookieResponse.json();
          console.log(`Manual Cookie Status: ${manualCookieResponse.status}`);
          console.log('Manual Cookie Response:', JSON.stringify(manualCookieData, null, 2));

          if (manualCookieData.success) {
            console.log('✅ Protected route successful with manual cookie!');
          } else {
            console.log('❌ Manual cookie failed:', manualCookieData.message);
          }
        } catch (manualError) {
          console.error('💥 Manual cookie error:', manualError.message);
        }

        // Test 5: Protected route with Authorization header
        console.log('\n🔒 Testing protected route (Authorization header)...');
        try {
          const authHeaderResponse = await fetch(`${API_BASE}/user/get-profile`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Origin': 'http://localhost:5173'
            },
            credentials: 'include'
          });

          const authHeaderData = await authHeaderResponse.json();
          console.log(`Auth Header Status: ${authHeaderResponse.status}`);
          console.log('Auth Header Response:', JSON.stringify(authHeaderData, null, 2));

          if (authHeaderData.success) {
            console.log('✅ Protected route successful with Authorization header!');
          } else {
            console.log('❌ Authorization header failed:', authHeaderData.message);
          }
        } catch (authError) {
          console.error('💥 Authorization header error:', authError.message);
        }

      } else {
        console.log('❌ Could not extract token from cookie');
      }
    } else {
      console.log('❌ Login failed or no cookie set');
    }

  } catch (error) {
    console.error('💥 Login error:', error.message);
  }

  console.log('\n📊 Cookie Flow Test Summary');
  console.log('=============================================');
  console.log('🔍 Check the server console for detailed debugging logs');
  console.log('🔍 The enhanced auth middleware will show exactly where the issue is');
}

// Run test
testCookieFlow().catch(console.error);
