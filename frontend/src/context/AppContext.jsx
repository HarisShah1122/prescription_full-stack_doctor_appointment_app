import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDoctorsWithFallback, fetchUserProfile } from '../utils/apiHelper';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('unknown'); // 'api' or 'fallback'

  // Fetch doctors with intelligent fallback
  const getDoctorsData = async () => {
    setIsLoading(true);
    
    try {
      const result = await getDoctorsWithFallback();
      
      // Set the normalized data
      setDoctors(result.data);
      
      // Track data source for debugging
      setDataSource(result.fromFallback ? 'fallback' : 'api');
      
      // Only show error message if we're using fallback due to API failure
      if (result.fromFallback && result.error) {
        console.warn('Using fallback data due to API error:', result.error);
        toast.info('Using offline doctor data. Some features may be limited.');
      } else if (!result.fromFallback) {
        console.log(`✅ Loaded ${result.data.length} doctors from API`);
      }
      
    } catch (error) {
      console.error('Complete failure in getDoctorsData:', error);
      toast.error('Failed to load doctor data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logged-in user profile with centralized error handling
  const loadUserProfileData = async () => {
    if (!token) {
      setUserData(null);
      return;
    }

    try {
      const result = await fetchUserProfile();
      
      if (result.success) {
        setUserData(result.data);
        console.log('✅ User profile loaded successfully');
      } else {
        console.warn('Failed to load user profile:', result.error);
        setUserData(null);
        // Error is already handled by the API helper
      }
    } catch (error) {
      console.error('Unexpected error in loadUserProfileData:', error);
      setUserData(null);
    }
  };

  // Refresh doctors data (useful for admin operations)
  const refreshDoctorsData = async () => {
    console.log('🔄 Refreshing doctors data...');
    await getDoctorsData();
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
    refreshDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    aToken,
    setAToken,
    loadUserProfileData,
    isLoading,
    dataSource, // Expose data source for debugging
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
