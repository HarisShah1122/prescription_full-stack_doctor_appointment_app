import api from './axios';
import { toast } from 'react-toastify';

// Centralized API error handling
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  let errorMessage = fallbackMessage;
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        errorMessage = data?.message || 'Invalid request data';
        break;
      case 401:
        errorMessage = 'Authentication required. Please login again.';
        // Clear tokens on 401
        localStorage.removeItem('token');
        localStorage.removeItem('aToken');
        window.location.href = '/login';
        break;
      case 403:
        errorMessage = 'Access denied. Insufficient permissions.';
        break;
      case 404:
        errorMessage = 'Requested resource not found.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = data?.message || fallbackMessage;
    }
  } else if (error.request) {
    // Network error
    errorMessage = 'Network error. Please check your connection.';
  } else {
    // Other errors
    errorMessage = error.message || fallbackMessage;
  }
  
  toast.error(errorMessage);
  return errorMessage;
};

// Data normalization utilities
export const normalizeDoctorData = (doctors) => {
  if (!Array.isArray(doctors)) return [];
  
  return doctors.map(doctor => ({
    _id: doctor._id || doctor.id,
    name: doctor.name || 'Unknown Doctor',
    image: doctor.image || null,
    speciality: doctor.speciality || 'General Physician',
    degree: doctor.degree || 'MBBS',
    experience: doctor.experience || '0 Years',
    about: doctor.about || 'Experienced medical professional',
    fees: doctor.fees || 1000,
    address: {
      line1: doctor.address?.line1 || 'Medical Center',
      line2: doctor.address?.line2 || 'City'
    },
    available: doctor.available !== undefined ? doctor.available : true,
    // Ensure consistent data types
    fees: Number(doctor.fees) || 1000
  }));
};

// API wrapper with consistent error handling
export const apiCall = async (method, url, data = null, options = {}) => {
  try {
    console.log(`🔄 API Call: ${method.toUpperCase()} ${url}`, data || '');
    
    const config = {
      method,
      url,
      ...options
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await api(config);
    
    console.log(`✅ API Success: ${method.toUpperCase()} ${url}`, response.data);
    
    return {
      success: true,
      data: response.data,
      error: null
    };
    
  } catch (error) {
    const errorMessage = handleApiError(error, options.fallbackMessage);
    
    console.log(`❌ API Error: ${method.toUpperCase()} ${url}`, errorMessage);
    
    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
};

// Specific API methods with proper error handling
export const fetchDoctors = async () => {
  const result = await apiCall('GET', '/api/doctor/list');
  
  if (result.success && result.data) {
    // Backend returns { success: true, doctors: [...] }
    const doctors = result.data.doctors || [];
    
    // Only use fallback if there's a genuine error, not for empty arrays
    if (Array.isArray(doctors)) {
      return {
        success: true,
        data: normalizeDoctorData(doctors),
        fromFallback: false
      };
    }
  }
  
  return {
    success: false,
    data: null,
    fromFallback: false,
    error: result.error
  };
};

export const fetchUserProfile = async () => {
  const result = await apiCall('GET', '/api/user/get-profile');
  
  if (result.success && result.data) {
    return {
      success: true,
      data: result.data.userData,
      error: null
    };
  }
  
  return {
    success: false,
    data: null,
    error: result.error
  };
};

// Fallback data loader (only used when API truly fails)
export const loadFallbackDoctors = () => {
  console.warn('📦 Loading fallback doctors data');
  return import('../assets/assets.js').then(module => {
    const normalizedDoctors = normalizeDoctorData(module.doctors);
    console.log(`✅ Fallback loaded: ${normalizedDoctors.length} doctors`);
    return normalizedDoctors;
  });
};

// Unified data fetching with intelligent fallback
export const getDoctorsWithFallback = async () => {
  try {
    // Try API first
    const apiResult = await fetchDoctors();
    
    if (apiResult.success) {
      console.log(`📋 Using API data: ${apiResult.data.length} doctors`);
      return {
        data: apiResult.data,
        fromFallback: false,
        error: null
      };
    }
    
    // API failed, use fallback
    console.warn('⚠️ API failed, using fallback data');
    const fallbackData = await loadFallbackDoctors();
    
    return {
      data: fallbackData,
      fromFallback: true,
      error: apiResult.error
    };
    
  } catch (error) {
    console.error('💥 Complete failure, using fallback:', error);
    const fallbackData = await loadFallbackDoctors();
    
    return {
      data: fallbackData,
      fromFallback: true,
      error: error.message
    };
  }
};
