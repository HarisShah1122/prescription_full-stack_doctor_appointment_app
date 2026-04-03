import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  UserPlus,
  Stethoscope,
  Heart,
  FileText,
  AlertCircle
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAppointments: 0,
      todayAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      totalRevenue: 0,
      activeDoctors: 0,
      totalUsers: 0,
      pendingAppointments: 0
    },
    recentAppointments: [],
    weeklyData: [],
    monthlyRevenue: [],
    doctorStats: [],
    upcomingAppointments: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const statsResponse = await fetch(`${backendUrl}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const appointmentsResponse = await fetch(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (statsResponse.ok && appointmentsResponse.ok) {
        const stats = await statsResponse.json();
        const appointments = await appointmentsResponse.json();
        
        // Process data
        const processedData = {
          stats: {
            totalAppointments: appointments.appointments?.length || 0,
            todayAppointments: appointments.appointments?.filter(apt => {
              const today = new Date().toDateString();
              return new Date(apt.date).toDateString() === today;
            }).length || 0,
            completedAppointments: appointments.appointments?.filter(apt => !apt.cancelled).length || 0,
            cancelledAppointments: appointments.appointments?.filter(apt => apt.cancelled).length || 0,
            totalRevenue: appointments.appointments?.filter(apt => !apt.cancelled).reduce((sum, apt) => sum + (apt.amount || 0), 0) || 0,
            activeDoctors: 12, // Static for now
            totalUsers: 150, // Static for now
            pendingAppointments: appointments.appointments?.filter(apt => !apt.cancelled && new Date(apt.slotDate) >= new Date()).length || 0
          },
          recentAppointments: appointments.appointments?.slice(0, 5) || [],
          weeklyData: generateWeeklyData(appointments.appointments || []),
          monthlyRevenue: generateMonthlyRevenue(appointments.appointments || []),
          doctorStats: generateDoctorStats(appointments.appointments || []),
          upcomingAppointments: appointments.appointments?.filter(apt => !apt.cancelled && new Date(apt.slotDate) >= new Date()).slice(0, 3) || []
        };
        
        setDashboardData(processedData);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = (appointments) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({
      day,
      appointments: 0,
      completed: 0
    }));

    appointments.forEach(apt => {
      const date = new Date(apt.date);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayData = weekData.find(d => d.day === dayName);
      if (dayData) {
        dayData.appointments++;
        if (!apt.cancelled) dayData.completed++;
      }
    });

    return weekData;
  };

  const generateMonthlyRevenue = (appointments) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 5000) + 1000 // Mock data
    }));
  };

  const generateDoctorStats = (appointments) => {
    const doctors = ['Dr. Ahmed Khan', 'Dr. Fatima Zahra', 'Dr. Ayesha Siddiqui'];
    return doctors.map(doctor => ({
      name: doctor,
      appointments: Math.floor(Math.random() * 20) + 5,
      completed: Math.floor(Math.random() * 15) + 3
    }));
  };

  // Chart configurations
  const weeklyChartConfig = {
    labels: dashboardData.weeklyData.map(d => d.day),
    datasets: [
      {
        label: 'Total Appointments',
        data: dashboardData.weeklyData.map(d => d.appointments),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Completed',
        data: dashboardData.weeklyData.map(d => d.completed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const revenueChartConfig = {
    labels: dashboardData.monthlyRevenue.map(d => d.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: dashboardData.monthlyRevenue.map(d => d.revenue),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
      }
    ]
  };

  const statusChartConfig = {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        data: [
          dashboardData.stats.completedAppointments,
          dashboardData.stats.cancelledAppointments,
          dashboardData.stats.pendingAppointments
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)'
        ],
        borderWidth: 2,
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {userData?.name || 'User'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {userData?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.totalAppointments}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.todayAppointments}</p>
                <p className="text-gray-500 text-sm mt-2">Scheduled today</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${dashboardData.stats.totalRevenue}</p>
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Doctors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.stats.activeDoctors}</p>
                <p className="text-gray-500 text-sm mt-2">Available now</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Appointments Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointments</h3>
            <Line data={weeklyChartConfig} options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: { y: { beginAtZero: true } }
            }} />
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <Bar data={revenueChartConfig} options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: { y: { beginAtZero: true } }
            }} />
          </div>
        </div>

        {/* Status and Recent Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status</h3>
            <Doughnut data={statusChartConfig} options={{
              responsive: true,
              plugins: { legend: { position: 'bottom' } }
            }} />
          </div>

          {/* Recent Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {dashboardData.recentAppointments.map((apt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${apt.cancelled ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.docData?.name || 'Doctor'}</p>
                      <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.slotTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${apt.amount || 0}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.cancelled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {apt.cancelled ? 'Cancelled' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg p-4 transition-all">
              <UserPlus className="w-6 h-6 mb-2" />
              <p className="text-sm">New Patient</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg p-4 transition-all">
              <Calendar className="w-6 h-6 mb-2" />
              <p className="text-sm">Schedule</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg p-4 transition-all">
              <FileText className="w-6 h-6 mb-2" />
              <p className="text-sm">Reports</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg p-4 transition-all">
              <Activity className="w-6 h-6 mb-2" />
              <p className="text-sm">Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
