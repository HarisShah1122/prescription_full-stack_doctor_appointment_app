import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Users, 
  Stethoscope, 
  Building, 
  Calendar, 
  Activity, 
  Plus,
  Edit,
  Trash2,
  FileText,
  TrendingUp,
  LogOut,
  TestTube,
  DollarSign,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    laboratories: 0,
    labTests: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [doctors, setDoctors] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [labResults, setLabResults] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch doctors
      const doctorsResponse = await fetch('/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch laboratories
      const labsResponse = await fetch('/api/admin-lab/laboratories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch lab results
      const resultsResponse = await fetch('/api/admin-lab/lab-results', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data.stats || stats);
      }
      
      if (doctorsResponse.ok) {
        const data = await doctorsResponse.json();
        setDoctors(data.doctors || []);
      }
      
      if (labsResponse.ok) {
        const data = await labsResponse.json();
        setLaboratories(data.data || []);
      }
      
      if (resultsResponse.ok) {
        const data = await resultsResponse.json();
        setLabResults(data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
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
    { id: 'doctors', label: 'Doctor Management', icon: Stethoscope },
    { id: 'laboratories', label: 'Laboratory Management', icon: Building },
    { id: 'lab-tests', label: 'Lab Tests & Results', icon: TestTube },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent stats={stats} />;
      case 'doctors':
        return <DoctorManagement doctors={doctors} />;
      case 'laboratories':
        return <LaboratoryManagement laboratories={laboratories} />;
      case 'lab-tests':
        return <LabTestManagement labResults={labResults} />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'reports':
        return <ReportsManagement />;
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
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600">Healthcare Management</p>
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
            Manage your healthcare operations from here
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Total Doctors</h3>
          <Stethoscope className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.doctors}</div>
        <p className="text-sm text-gray-600 mt-2">Active physicians</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
          <Calendar className="w-6 h-6 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.appointments}</div>
        <p className="text-sm text-gray-600 mt-2">This month</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Laboratories</h3>
          <Building className="w-6 h-6 text-purple-600" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.laboratories}</div>
        <p className="text-sm text-gray-600 mt-2">Active labs</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Lab Tests</h3>
          <TestTube className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.labTests}</div>
        <p className="text-sm text-gray-600 mt-2">Completed</p>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-4">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">New doctor registered</p>
                <p className="text-sm text-gray-600">Dr. John Doe - Cardiology</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Lab test completed</p>
                <p className="text-sm text-gray-600">Blood Test - Patient #1234</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">New appointment scheduled</p>
                <p className="text-sm text-gray-600">Dr. Sarah Smith - Tomorrow 10:00 AM</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Doctor Management Component
const DoctorManagement = ({ doctors }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Doctor Management</h3>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-gray-600">Name</th>
              <th className="pb-3 text-gray-600">Speciality</th>
              <th className="pb-3 text-gray-600">Email</th>
              <th className="pb-3 text-gray-600">Status</th>
              <th className="pb-3 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{doctor.name}</td>
                <td className="py-3">{doctor.speciality}</td>
                <td className="py-3">{doctor.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Laboratory Management Component
const LaboratoryManagement = ({ laboratories }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Laboratory Management</h3>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Laboratory
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laboratories.map((lab) => (
          <div key={lab._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-lg">{lab.name}</h4>
              <span className={`px-2 py-1 rounded text-xs ${
                lab.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {lab.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{lab.type}</p>
            <p className="text-gray-600 text-sm mb-2">{lab.location.building}, {lab.location.floor}</p>
            <p className="text-gray-600 text-sm mb-3">{lab.contact.phone}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{lab.services?.length || 0} tests</span>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Lab Test Management Component
const LabTestManagement = ({ labResults }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Lab Tests & Results</h3>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Test
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-gray-600">Patient</th>
              <th className="pb-3 text-gray-600">Test</th>
              <th className="pb-3 text-gray-600">Laboratory</th>
              <th className="pb-3 text-gray-600">Status</th>
              <th className="pb-3 text-gray-600">Date</th>
              <th className="pb-3 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labResults.map((result) => (
              <tr key={result._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{result.patientId?.name || 'N/A'}</td>
                <td className="py-3">{result.testId?.testName || 'N/A'}</td>
                <td className="py-3">{result.labId?.name || 'N/A'}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    result.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    result.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {result.status}
                  </span>
                </td>
                <td className="py-3">{new Date(result.created).toLocaleDateString()}</td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Placeholder components
const AppointmentManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Appointment Management</h3>
    <p className="text-gray-600">Manage appointments and scheduling</p>
  </div>
);

const ReportsManagement = () => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4">Reports & Analytics</h3>
    <p className="text-gray-600">View detailed reports and analytics</p>
  </div>
);

export default AdminDashboard;
