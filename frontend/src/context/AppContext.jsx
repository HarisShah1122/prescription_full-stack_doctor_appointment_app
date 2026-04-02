import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { doctors as staticDoctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    console.log('🔑 Initial token from localStorage:', storedToken ? 'exists' : 'none');
    return storedToken || '';
  });
  const [userData, setUserData] = useState(null);
  const [aToken, setAToken] = useState(() => {
    const storedAToken = localStorage.getItem('aToken');
    console.log('🔑 Initial admin token from localStorage:', storedAToken ? 'exists' : 'none');
    return storedAToken || '';
  });

  // Configure axios defaults for credentials
  useEffect(() => {
    axios.defaults.withCredentials = true; // Important for HTTP-only cookies
    axios.defaults.baseURL = backendUrl;
    console.log('🔧 Axios configured with credentials:', axios.defaults.withCredentials);
    
    // Set up interceptor to always include token in headers
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      const aToken = localStorage.getItem('aToken');
      
      if (token && !config.url?.includes('/admin/')) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (aToken && config.url?.includes('/admin/')) {
        config.headers.Authorization = `Bearer ${aToken}`;
      }
      
      return config;
    });
  }, [backendUrl]);

  // Add axios response interceptor for token refresh
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors - but only for protected routes
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Don't clear tokens for profile requests - let the component handle it
          if (originalRequest.url?.includes('/get-profile')) {
            console.log('🔄 Profile auth failed, but not clearing tokens');
            return Promise.reject(error);
          }
          
          console.log('🔄 Token expired, attempting to refresh authentication...');
          
          // Clear invalid tokens and redirect to login
          setToken('');
          setUserData(null);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          
          toast.error('Session expired. Please login again.');
          
          // Redirect to login page
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [backendUrl]);

  // Fetch doctors from backend - Only fallback on truly empty data
  const getDoctorsData = async () => {
    try {
      console.log('👨‍⚕️ Fetching doctors list...');
      const { data } = await axios.get('/api/doctor/list');
      console.log('📋 Doctors API response:', data);
      
      if (data?.success && Array.isArray(data.doctors) && data.doctors.length > 0) {
        setDoctors(data.doctors);
        console.log('✅ Doctors loaded from API:', data.doctors.length);
      } else if (data?.success && Array.isArray(data.doctors) && data.doctors.length === 0) {
        console.warn("No doctors found in database, using static fallback...");
        setDoctors(staticDoctors);
      } else {
        console.warn("Invalid API response format, using static fallback...");
        setDoctors(staticDoctors);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error.message);
      console.error("Error status:", error.response?.status);
      // Only show toast if it's not an auth error (which should be handled elsewhere)
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch doctors. Showing default list.");
      }
      setDoctors(staticDoctors);
    }
  };

  // Fetch logged-in user profile - Simplified and more robust
  const loadUserProfileData = async () => {
    try {
      console.log('👤 Loading user profile...');
      
      // Only try to load profile if we have a token
      if (!token) {
        console.log('❌ No token available for profile load');
        return;
      }
      
      // Try with HTTP-only cookies first
      try {
        const { data } = await axios.get('/api/user/get-profile');
        if (data.success) {
          setUserData(data.userData);
          console.log('✅ Profile loaded via cookies');
          return;
        }
      } catch (cookieError) {
        console.log('🔄 Cookie auth failed, trying token auth...');
      }
      
      // Fallback: Try with Authorization header
      try {
        const { data } = await axios.get('/api/user/get-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setUserData(data.userData);
          console.log('✅ Profile loaded via token');
          return;
        }
      } catch (tokenError) {
        console.log('❌ Token auth also failed');
      }
      
      // Final fallback: Try localStorage userData
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          console.log('✅ Profile loaded from localStorage');
          return;
        } catch (parseError) {
          console.log('❌ Failed to parse localStorage userData');
        }
      }
      
      console.warn('⚠️ Could not load user profile from any source');
      
    } catch (error) {
      console.error("Profile loading error:", error);
      // Don't show toast for profile loading errors to avoid spam
    }
  };

  // Enhanced logout function
  const logout = async () => {
    try {
      console.log('🔐 Logging out user...');
      
      // Call backend logout endpoint
      await axios.post('/api/user/logout', {}, {
        withCredentials: true
      });
      
      console.log('✅ Backend logout successful');
    } catch (error) {
      console.error('❌ Backend logout error:', error);
      // Continue with frontend logout even if backend fails
    } finally {
      // Clear frontend authentication data IMMEDIATELY
      setToken('');
      setUserData(null);
      setAToken('');
      
      // Clear localStorage IMMEDIATELY
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('aToken');
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
      
      // Force redirect to login page
      window.location.href = '/login';
      
      console.log('🧹 Frontend data cleared');
      toast.success('Logged out successfully');
    }
  };

  // Enhanced login function with better error handling
  const login = async (email, password, isAdmin = false) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const endpoint = isAdmin ? '/api/admin/login' : '/api/user/login';
      const { data } = await axios.post(endpoint, { email, password }, {
        withCredentials: true
      });

      console.log('📨 Login response:', data);

      if (data.success) {
        const userToken = data.data?.token || data.token;
        const userData = data.data?.user;
        
        console.log('🔑 Token received:', userToken ? 'YES' : 'NO');
        console.log('👤 User data received:', userData ? 'YES' : 'NO');
        
        if (userToken) {
          // Store token in localStorage
          localStorage.setItem(isAdmin ? "aToken" : "token", userToken);
          console.log('💾 Token saved to localStorage:', userToken.substring(0, 20) + '...');
          
          // Store user data in localStorage
          if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
            console.log('� User data saved to localStorage');
          }
          
          // Update React state
          if (isAdmin) {
            setAToken(userToken);
            console.log('🔐 Admin token set in state');
          } else {
            setToken(userToken);
            setUserData(userData);
            console.log('� User token and data set in state');
          }
        }
        
        toast.success(`${isAdmin ? 'Admin' : 'User'} login successful!`);
        console.log('✅ Login completed successfully');
        return { success: true, data };
      } else {
        console.log('❌ Login failed:', data.message);
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Enhanced register function
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/api/user/register', { name, email, password }, {
        withCredentials: true
      });

      if (data.success) {
        const userToken = data.data?.token || data.token;
        const userData = data.data?.user;
        
        if (userToken) {
          localStorage.setItem("token", userToken);
          console.log('💾 Register token saved to localStorage:', userToken.substring(0, 20) + '...');
          setToken(userToken);
          console.log('🔐 Register token set in state');
        }
        
        // Set userData immediately if available
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
          setUserData(userData);
          console.log('👤 Register user data set in state');
        }
        
        toast.success("Account created successfully!");
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      // Only check if we don't already have tokens
      const currentToken = localStorage.getItem('token');
      const currentAToken = localStorage.getItem('aToken');
      
      console.log('🔍 Checking auth status...');
      console.log('🔍 Current tokens:', { 
        token: currentToken ? 'exists' : 'none', 
        aToken: currentAToken ? 'exists' : 'none',
        stateToken: token ? 'exists' : 'none',
        stateAToken: aToken ? 'exists' : 'none'
      });
      
      // Only update state if localStorage has tokens but state doesn't
      if (currentToken && !token) {
        setToken(currentToken);
        console.log('🔄 Updated token from localStorage');
        await loadUserProfileData();
      }
      
      if (currentAToken && !aToken) {
        setAToken(currentAToken);
        console.log('🔄 Updated admin token from localStorage');
      }
      
      console.log('🔍 Authentication status checked');
    } catch (error) {
      console.error('❌ Auth status check failed:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    aToken,
    userData,
    login,
    register,
    logout,
    checkAuthStatus,
    // Simplified authentication check - only require token for basic auth
    isAuthenticated: !!token,
    isAdminAuthenticated: !!aToken,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
