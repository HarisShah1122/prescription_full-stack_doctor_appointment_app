import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Crown, Shield, Stethoscope, User } from 'lucide-react';

const DebugRole = () => {
  const { userData, token } = useContext(AppContext);

  useEffect(() => {
    console.log('🔍 Debug Role - Current User Data:', userData);
    console.log('🔑 Debug Role - Token:', token ? 'Present' : 'Missing');
  }, [userData, token]);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'super_admin':
        return { icon: <Crown className="w-8 h-8" />, label: 'Super Admin', color: 'purple' };
      case 'admin':
        return { icon: <Shield className="w-8 h-8" />, label: 'Admin', color: 'blue' };
      case 'doctor':
        return { icon: <Stethoscope className="w-8 h-8" />, label: 'Doctor', color: 'green' };
      case 'lab_technician':
        return { icon: <User className="w-8 h-8" />, label: 'Lab Technician', color: 'orange' };
      default:
        return { icon: <User className="w-8 h-8" />, label: 'Patient', color: 'gray' };
    }
  };

  const roleInfo = getRoleInfo(userData?.role);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Role Debug Information</h1>
          
          <div className="space-y-6">
            {/* Current Role Display */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Current Role</h2>
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg bg-${roleInfo.color}-100 text-${roleInfo.color}-800`}>
                  {roleInfo.icon}
                  <span className="ml-2 font-medium">{roleInfo.label}</span>
                </div>
              </div>
            </div>

            {/* User Data */}
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">User Data</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {userData?.name || 'Not available'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {userData?.email || 'Not available'}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> {userData?.role || 'Not available'}
                  </div>
                  <div>
                    <span className="font-medium">User ID:</span> {userData?.id || 'Not available'}
                  </div>
                </div>
              </div>
            </div>

            {/* Token Status */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Authentication Status</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Token:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      token ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {token ? '✅ Present' : '❌ Missing'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Token Length:</span>
                    <span className="ml-2">{token ? token.length : 0} characters</span>
                  </div>
                  <div>
                    <span className="font-medium">Token Preview:</span>
                    <code className="ml-2 block text-xs bg-gray-100 p-2 rounded">
                      {token ? `${token.substring(0, 20)}...` : 'No token'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* localStorage Data */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">localStorage Data</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Token in localStorage:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      localStorage.getItem('token') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {localStorage.getItem('token') ? '✅ Stored' : '❌ Not stored'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">User Data in localStorage:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      localStorage.getItem('userData') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {localStorage.getItem('userData') ? '✅ Stored' : '❌ Not stored'}
                    </span>
                  </div>
                  {localStorage.getItem('userData') && (
                    <div>
                      <span className="font-medium">Stored User Role:</span>
                      <span className="ml-2">
                        {JSON.parse(localStorage.getItem('userData')).role || 'Not available'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role-Based Access */}
            <div className="border-l-4 border-indigo-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Super Admin Access:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      userData?.role === 'super_admin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData?.role === 'super_admin' ? '✅ Available' : '❌ Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Admin Access:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      userData?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData?.role === 'admin' ? '✅ Available' : '❌ Not available'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Doctor Access:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      userData?.role === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {userData?.role === 'doctor' ? '✅ Available' : '❌ Not available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/admin-dashboard'}
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Admin Panel
            </button>
            <button
              onClick={() => window.location.href = '/super-admin-dashboard'}
              className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Super Admin Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugRole;
