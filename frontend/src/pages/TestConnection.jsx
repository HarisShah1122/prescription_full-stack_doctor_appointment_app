import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const TestConnection = () => {
    const { backendUrl } = useContext(AppContext);
    const [status, setStatus] = useState('Checking...');
    const [apiResults, setApiResults] = useState([]);

    const testApi = async (endpoint, name) => {
        try {
            const response = await axios.get(`${backendUrl}${endpoint}`);
            return { name, status: response.status, success: response.data?.success, data: response.data };
        } catch (error) {
            return { name, status: 'ERROR', success: false, error: error.message };
        }
    };

    useEffect(() => {
        const testAllApis = async () => {
            const tests = [
                { endpoint: '/api/user/available-doctors', name: 'Available Doctors' },
                { endpoint: '/api/admin/dashboard', name: 'Admin Dashboard' },
                { endpoint: '/api/doctor/dashboard', name: 'Doctor Dashboard' },
            ];

            const results = await Promise.all(tests.map(test => testApi(test.endpoint, test.name)));
            setApiResults(results);
            setStatus('Complete');
        };

        testAllApis();
    }, [backendUrl]);

    return (
        <div className="m-8 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Connection Test</h1>
            <p className="text-gray-600 mb-6">Status: {status}</p>
            
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">API Test Results:</h2>
                {apiResults.map((result, index) => (
                    <div key={index} className={`p-4 rounded border ${
                        result.status === 200 ? 'border-green-500 bg-green-50' : 
                        result.status === 'ERROR' ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}>
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{result.name}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                result.status === 200 ? 'bg-green-100 text-green-800' : 
                                result.status === 'ERROR' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {result.status}
                            </span>
                        </div>
                        <div className="mt-2 text-sm">
                            {result.success ? (
                                <span className="text-green-600">✅ Working</span>
                            ) : (
                                <span className="text-red-600">❌ Error: {result.error}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">URLs to Test:</h3>
                <ul className="text-sm space-y-1">
                    <li><strong>Frontend:</strong> <a href="http://localhost:5173" className="text-blue-600">http://localhost:5173</a></li>
                    <li><strong>Backend:</strong> <a href="http://localhost:4000" className="text-blue-600">http://localhost:4000</a></li>
                    <li><strong>Login:</strong> <a href="http://localhost:5173/login" className="text-blue-600">http://localhost:5173/login</a></li>
                    <li><strong>Admin Login:</strong> <a href="http://login" className="text-blue-600">http://localhost:5173/admin-login</a></li>
                    <li><strong>Admin Dashboard:</strong> <a href="http://localhost:5173/admin-dashboard" className="text-blue-600">http://localhost:5173/admin-dashboard</a></li>
                </ul>
            </div>
        </div>
    );
};

export default TestConnection;
