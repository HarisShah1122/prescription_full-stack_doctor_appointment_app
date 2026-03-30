import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import { doctors as staticDoctors } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');

  // Configure axios defaults for credentials
  useEffect(() => {
    axios.defaults.withCredentials = true; // Important for HTTP-only cookies
    axios.defaults.baseURL = backendUrl;
    console.log('🔧 Axios configured with credentials:', axios.defaults.withCredentials);
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

  // Fetch logged-in user profile - Simplified
  const loadUserProfileData = async () => {
    try {
      console.log('👤 Loading user profile...');
      
      // Primary: Try with HTTP-only cookies
      try {
        const { data } = await axios.get('/api/user/get-profile');
        if (data.success) {
          setUserData(data.userData);
          console.log('✅ Profile loaded via cookies');
          return;
        } else {
          console.log('❌ Profile API returned failure:', data.message);
        }
      } catch (cookieError) {
        console.log('🔄 Cookie auth failed:', cookieError.response?.status);
        if (cookieError.response?.status !== 401) {
          // If it's not an auth error, it might be a server error
          throw cookieError;
        }
      }
      
      // Fallback: Try with Authorization header if we have a token
      if (token) {
        console.log('🔄 Trying token auth fallback...');
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
      // Only show toast if we have a token (meaning user should be logged in)
      if (token) {
        toast.error("Failed to fetch user profile.");
      }
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    loadUserProfileData();
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    aToken,
    setAToken,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
