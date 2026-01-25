import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const AdminDashboard = () => {
    const { backendUrl, aToken } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            
            if (data.success) {
                setDashboardData(data.dashData);
            } else {
                console.error('Failed to fetch dashboard data:', data.message);
                toast.error('Failed to load dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (aToken) {
            fetchDashboardData();
        } else {
            // If no admin token, try to get it from localStorage
            const token = localStorage.getItem('aToken');
            if (token) {
                setAToken(token);
                fetchDashboardData();
            } else {
                setLoading(false);
                toast.error('Please log in as admin to access dashboard');
            }
        }
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='text-center'>
                    <p className='text-red-500'>Failed to load dashboard data</p>
                    <button onClick={fetchDashboardData} className='mt-4 px-4 py-2 bg-primary text-white rounded'>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { doctors, appointments, patients, totalEarnings, thisMonthEarnings, latestAppointments, stats } = dashboardData;

    return (
        <div className='m-5'>
            {/* Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800'>MMC Mardan Medical Complex</h1>
                <p className='text-gray-600'>Admin Dashboard - Manage your hospital platform</p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Total Doctors</p>
                            <p className='text-2xl font-bold text-gray-800'>{doctors}</p>
                        </div>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Total Patients</p>
                            <p className='text-2xl font-bold text-gray-800'>{patients}</p>
                        </div>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 00-5.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Appointments</p>
                            <p className='text-2xl font-bold text-gray-800'>{appointments}</p>
                        </div>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Total Earnings</p>
                            <p className='text-2xl font-bold text-green-600'>Rs. {totalEarnings?.toLocaleString() || 0}</p>
                        </div>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Active Doctors</p>
                            <p className='text-2xl font-bold text-blue-600'>{stats?.activeDoctors || 0}</p>
                        </div>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='bg-white rounded-lg shadow-sm'>
                <div className='border-b border-gray-200'>
                    <nav className='flex space-x-8 px-6' aria-label='Tabs'>
                        {['overview', 'appointments', 'analytics', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='p-6'>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Platform Overview</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>Completed Appointments</p>
                                        <p className='text-xl font-bold text-green-600'>{stats?.completedAppointments || 0}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>Cancelled Appointments</p>
                                        <p className='text-xl font-bold text-red-600'>{stats?.cancelledAppointments || 0}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>This Month Earnings</p>
                                        <p className='text-xl font-bold text-green-600'>Rs. {thisMonthEarnings?.toLocaleString() || 0}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>New Patients This Month</p>
                                        <p className='text-xl font-bold text-blue-600'>{stats?.newPatientsThisMonth || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Recent Activity</h3>
                                <div className='space-y-3'>
                                    {latestAppointments?.slice(0, 5).map((appointment, index) => (
                                        <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <p className='font-medium text-gray-800'>
                                                        {appointment.userId?.name} - {appointment.docId?.name}
                                                    </p>
                                                    <p className='text-sm text-gray-600'>
                                                        {new Date(appointment.date).toLocaleDateString()} at {appointment.slotTime}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    appointment.cancelled 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {appointment.cancelled ? 'Cancelled' : 'Completed'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appointments' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>All Appointments</h3>
                            <div className='space-y-3'>
                                {latestAppointments?.map((appointment, index) => (
                                    <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <p className='font-medium text-gray-800'>
                                                    {appointment.userId?.name} - {appointment.docId?.name}
                                                </p>
                                                <p className='text-sm text-gray-600'>
                                                    {new Date(appointment.date).toLocaleDateString()} at {appointment.slotTime}
                                                </p>
                                                <p className='text-sm text-gray-500'>Amount: Rs. {appointment.amount}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                appointment.cancelled 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {appointment.cancelled ? 'Cancelled' : 'Completed'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Analytics Overview</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
                                    <p className='text-sm text-blue-600 mb-2'>Appointment Completion Rate</p>
                                    <p className='text-2xl font-bold text-blue-800'>
                                        {stats?.completedAppointments && stats?.completedAppointments + stats?.cancelledAppointments > 0
                                            ? Math.round((stats.completedAppointments / (stats.completedAppointments + stats.cancelledAppointments)) * 100)
                                            : 0}%
                                    </p>
                                </div>
                                <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
                                    <p className='text-sm text-green-600 mb-2'>Average Revenue per Appointment</p>
                                    <p className='text-2xl font-bold text-green-800'>
                                        Rs. {stats?.completedAppointments && totalEarnings > 0
                                            ? Math.round(totalEarnings / stats.completedAppointments)
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>System Settings</h3>
                            <div className='space-y-4'>
                                <div className='border border-gray-200 rounded-lg p-4'>
                                    <h4 className='font-medium text-gray-800 mb-2'>Platform Settings</h4>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-gray-600'>Maintenance Mode</span>
                                            <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded'>Active</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-gray-600'>Version</span>
                                            <span className='text-sm text-gray-800'>1.0.0</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className='border border-gray-200 rounded-lg p-4'>
                                    <h4 className='font-medium text-gray-800 mb-2'>Payment Methods</h4>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-gray-600'>Stripe</span>
                                            <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded'>Enabled</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-gray-600'>EasyPaisa</span>
                                            <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded'>Enabled</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-gray-600'>JazzCash</span>
                                            <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded'>Enabled</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
