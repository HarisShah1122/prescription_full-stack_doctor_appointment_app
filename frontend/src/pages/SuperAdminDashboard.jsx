import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Activity, 
  Shield, 
  Building, 
  Calendar,
  TrendingUp,
  FileText,
  LogOut,
  UserCheck,
  UserX,
  Database,
  Lock
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: { admins: 0, doctors: 0, patients: 0 },
    facilities: { laboratories: 0 },
    operations: { appointments: 0, labTests: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    fetchSystemStats();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/super-admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'admins', label: 'Admin Management', icon: Shield },
    { id: 'doctors', label: 'Doctor Management', icon: UserCheck },
    { id: 'labs', label: 'Laboratory Management', icon: Building },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent stats={stats} />;
      case 'users':
        return <UserManagement />;
      case 'admins':
        return <AdminManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'labs':
        return <LabManagement />;
      case 'audit':
        return <AuditLogs />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardContent stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Super Admin</h2>
          <p className="text-sm text-gray-600">System Control Panel</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your healthcare system from here
          </p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* User Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Users Overview</h3>
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Admins</span>
            <span className="text-2xl font-bold text-gray-900">{stats.users.admins}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Doctors</span>
            <span className="text-2xl font-bold text-gray-900">{stats.users.doctors}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Patients</span>
            <span className="text-2xl font-bold text-gray-900">{stats.users.patients}</span>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Facilities</h3>
          <Building className="w-6 h-6 text-green-600" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Laboratories</span>
            <span className="text-2xl font-bold text-gray-900">{stats.facilities.laboratories}</span>
          </div>
        </div>
      </div>

      {/* Operations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Operations</h3>
          <Activity className="w-6 h-6 text-purple-600" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Appointments</span>
            <span className="text-2xl font-bold text-gray-900">{stats.operations.appointments}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Lab Tests</span>
            <span className="text-2xl font-bold text-gray-900">{stats.operations.labTests}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white lg:col-span-3">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
            <UserPlus className="w-6 h-6 mb-2" />
            <p className="text-sm">Add Admin</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
            <UserCheck className="w-6 h-6 mb-2" />
            <p className="text-sm">Add Doctor</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
            <Building className="w-6 h-6 mb-2" />
            <p className="text-sm">Add Lab</p>
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all">
            <Database className="w-6 h-6 mb-2" />
            <p className="text-sm">Backup</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other sections
const UserManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">User Management</h3>
    <p className="text-gray-600">Manage all system users here</p>
  </div>
);

const AdminManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Admin Management</h3>
    <p className="text-gray-600">Create and manage admin accounts</p>
  </div>
);

const DoctorManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Doctor Management</h3>
    <p className="text-gray-600">Add, edit, and manage doctors</p>
  </div>
);

const LabManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Laboratory Management</h3>
    <p className="text-gray-600">Manage laboratories and tests</p>
  </div>
);

const AuditLogs = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
    <p className="text-gray-600">View system activity logs</p>
  </div>
);

const SystemSettings = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">System Settings</h3>
    <p className="text-gray-600">Configure system settings</p>
  </div>
);

export default SuperAdminDashboard;
