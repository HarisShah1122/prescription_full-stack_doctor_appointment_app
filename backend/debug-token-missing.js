// Debug TOKEN_MISSING authentication error
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Test user data
const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123!'
};

async function debugTokenMissing() {
  console.log('🔍 Debugging TOKEN_MISSING Authentication Error');
  console.log('=============================================');

  // Test 1: Registration and Login
  console.log('\n📝 Step 1: Creating/Logging in test user...');
  try {
    const loginResponse = await fetch(`${API_BASE}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:5173'
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

    if (loginData.success) {
      console.log('✅ Login successful!');
      
      // Test 2: Extract cookies from response headers
      console.log('\n🍪 Step 2: Checking response cookies...');
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      console.log('Set-Cookie Header:', setCookieHeader);
      
      if (setCookieHeader) {
        console.log('✅ Cookie is being set by backend');
        
        // Extract cookie details
        const cookieParts = setCookieHeader.split(';');
        const cookieDetails = {};
        cookieParts.forEach(part => {
          const [key, value] = part.trim().split('=');
          if (key && value) {
            cookieDetails[key] = value;
          }
        });
        console.log('Cookie Details:', cookieDetails);
      } else {
        console.log('❌ No Set-Cookie header found');
      }

      // Test 3: Test protected route with cookies
      console.log('\n🔒 Step 3: Testing protected route with cookies...');
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
          console.log('✅ Protected route access successful!');
        } else if (profileData.code === 'TOKEN_MISSING') {
          console.log('❌ TOKEN_MISSING error - investigating...');
          
          // Test 4: Manual cookie test
          console.log('\n🧪 Step 4: Testing with manual cookie...');
          
          // Extract token from login response
          const token = loginData.data?.token;
          if (token) {
            console.log('✅ Token available in login response');
            
            // Test with Authorization header
            const manualHeaderResponse = await fetch(`${API_BASE}/user/get-profile`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Origin': 'http://localhost:5173'
              },
              credentials: 'include'
            });

            const manualHeaderData = await manualHeaderResponse.json();
            console.log(`Manual Header Status: ${manualHeaderResponse.status}`);
            console.log('Manual Header Response:', JSON.stringify(manualHeaderData, null, 2));

            if (manualHeaderData.success) {
              console.log('✅ Authorization header works - issue is with cookies');
            } else {
              console.log('❌ Even Authorization header fails - deeper issue');
            }
          } else {
            console.log('❌ No token in login response');
          }
        } else {
          console.log('❌ Different error:', profileData.message);
        }
      } catch (profileError) {
        console.error('💥 Profile request error:', profileError.message);
      }

    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('💥 Login error:', error.message);
  }

  // Test 5: CORS preflight check
  console.log('\n🌐 Step 5: Testing CORS preflight...');
  try {
    const corsResponse = await fetch(`${API_BASE}/user/get-profile`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log(`CORS Status: ${corsResponse.status}`);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': corsResponse.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers')
    });
    
    if (corsResponse.status === 200 || corsResponse.status === 204) {
      console.log('✅ CORS preflight successful');
    } else {
      console.log('❌ CORS preflight failed');
    }
  } catch (corsError) {
    console.error('💥 CORS test error:', corsError.message);
  }

  // Test 6: Health check
  console.log('\n🏥 Step 6: Testing health endpoint...');
  try {
    const healthResponse = await fetch('http://localhost:4000/health');
    const healthData = await healthResponse.json();
    console.log(`Health Status: ${healthResponse.status}`);
    console.log('Health Response:', JSON.stringify(healthData, null, 2));
  } catch (healthError) {
    console.error('💥 Health check error:', healthError.message);
  }

  console.log('\n📊 Debug Summary');
  console.log('=============================================');
  console.log('🔍 Check the following:');
  console.log('1. Is Set-Cookie header present in login response?');
  console.log('2. Are cookies being sent in subsequent requests?');
  console.log('3. Is CORS configured correctly?');
  console.log('4. Is cookie-parser middleware working?');
  console.log('5. Is auth middleware reading cookies correctly?');
}

// Run debug
debugTokenMissing().catch(console.error);
