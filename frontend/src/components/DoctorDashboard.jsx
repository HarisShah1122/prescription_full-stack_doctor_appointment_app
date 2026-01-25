import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const DoctorDashboard = () => {
    const { backendUrl, dtoken } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                headers: { dtoken }
            });
            
            if (data.success) {
                setDashboardData(data.dashboardData);
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
        if (dtoken) {
            fetchDashboardData();
        } else {
            // If no doctor token, try to get it from localStorage
            const token = localStorage.getItem('dtoken');
            if (token) {
                fetchDashboardData();
            } else {
                setLoading(false);
                toast.error('Please log in as doctor to access dashboard');
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

    const { doctor, stats, todayAppointments, recentAppointments } = dashboardData;

    return (
        <div className='m-5'>
            {/* Header */}
            <div className='flex flex-wrap gap-4 mb-8'>
                <div className='flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm'>
                    <img src={doctor.image || assets.profile_pic} alt="" className='w-16 h-16 rounded-full object-cover' />
                    <div>
                        <p className='text-xl font-semibold text-gray-800'>{doctor.name}</p>
                        <p className='text-sm text-gray-600'>{doctor.speciality}</p>
                        <p className='text-xs text-green-600'>{doctor.available ? 'Available' : 'Unavailable'}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Total Appointments</p>
                            <p className='text-2xl font-bold text-gray-800'>{stats.totalAppointments}</p>
                        </div>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Completed</p>
                            <p className='text-2xl font-bold text-green-600'>{stats.completedCount}</p>
                        </div>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Upcoming</p>
                            <p className='text-2xl font-bold text-blue-600'>{stats.upcomingCount}</p>
                        </div>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-sm text-gray-600'>Total Earnings</p>
                            <p className='text-2xl font-bold text-purple-600'>Rs. {stats.totalEarnings.toLocaleString()}</p>
                        </div>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                            <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className='bg-white rounded-lg shadow-sm'>
                <div className='border-b border-gray-200'>
                    <nav className='flex space-x-8 px-6' aria-label='Tabs'>
                        {['overview', 'today', 'recent', 'earnings'].map((tab) => (
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
                                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Today's Overview</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>Today's Appointments</p>
                                        <p className='text-xl font-bold text-gray-800'>{todayAppointments.length}</p>
                                    </div>
                                    <div className='bg-gray-50 p-4 rounded-lg'>
                                        <p className='text-sm text-gray-600'>This Month Earnings</p>
                                        <p className='text-xl font-bold text-green-600'>Rs. {stats.thisMonthEarnings.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'today' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Today's Appointments</h3>
                            {todayAppointments.length > 0 ? (
                                <div className='space-y-3'>
                                    {todayAppointments.map((appointment, index) => (
                                        <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <p className='font-medium text-gray-800'>{appointment.userId.name}</p>
                                                    <p className='text-sm text-gray-600'>{appointment.slotTime}</p>
                                                </div>
                                                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded'>
                                                    Confirmed
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-500 text-center py-8'>No appointments scheduled for today</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'recent' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Recent Appointments</h3>
                            {recentAppointments.length > 0 ? (
                                <div className='space-y-3'>
                                    {recentAppointments.map((appointment, index) => (
                                        <div key={index} className='border border-gray-200 rounded-lg p-4'>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <p className='font-medium text-gray-800'>{appointment.userId.name}</p>
                                                    <p className='text-sm text-gray-600'>{appointment.slotDate} at {appointment.slotTime}</p>
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
                            ) : (
                                <p className='text-gray-500 text-center py-8'>No recent appointments</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'earnings' && (
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Earnings Summary</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
                                    <p className='text-sm text-green-600 mb-1'>Total Earnings</p>
                                    <p className='text-2xl font-bold text-green-800'>Rs. {stats.totalEarnings.toLocaleString()}</p>
                                </div>
                                <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
                                    <p className='text-sm text-blue-600 mb-1'>This Month</p>
                                    <p className='text-2xl font-bold text-blue-800'>Rs. {stats.thisMonthEarnings.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
