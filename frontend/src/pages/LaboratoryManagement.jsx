import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { 
  TestTube, 
  FileText, 
  DollarSign, 
  Users, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react';

const LaboratoryManagement = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Get user role from context
  const { userData } = useContext(AppContext);
  const userRole = userData?.role || 'patient';
  
  // Test Management State
  const [tests, setTests] = useState([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  
  // Reports State
  const [reports, setReports] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  
  // Billing State
  const [billings, setBillings] = useState([]);
  const [showBillingForm, setShowBillingForm] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState({
    totalTests: 0,
    totalReports: 0,
    totalBilling: 0,
    pendingReports: 0,
    pendingBilling: 0
  });

  // Check if user can perform certain actions
  const canManageLab = ['admin', 'super_admin', 'lab_technician'].includes(userRole);
  const canViewReports = ['admin', 'super_admin', 'doctor', 'lab_technician', 'patient'].includes(userRole);
  const canViewBilling = ['admin', 'super_admin', 'patient'].includes(userRole);

  useEffect(() => {
    fetchLaboratoryData();
  }, [activeTab]);

  const fetchLaboratoryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsResponse = await fetch('/api/laboratory/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch data based on active tab
      let dataResponse;
      switch (activeTab) {
        case 'tests':
          dataResponse = await fetch('/api/laboratory/tests', {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'reports':
          dataResponse = await fetch('/api/laboratory/reports', {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'billing':
          dataResponse = await fetch('/api/laboratory/billing', {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      if (dataResponse?.ok) {
        const data = await dataResponse.json();
        switch (activeTab) {
          case 'tests':
            setTests(data.data || []);
            break;
          case 'reports':
            setReports(data.data || []);
            break;
          case 'billing':
            setBillings(data.data || []);
            break;
        }
      }
    } catch (error) {
      toast.error('Failed to fetch laboratory data');
    } finally {
      setLoading(false);
    }
  };

  // Test Management Functions
  const handleCreateTest = async (testData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/laboratory/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        toast.success('Lab test created successfully');
        setShowTestForm(false);
        fetchLaboratoryData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create test');
      }
    } catch (error) {
      toast.error('Failed to create test');
    }
  };

  const handleUpdateTest = async (testData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/laboratory/tests/${testData.labId}/${testData.testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        toast.success('Lab test updated successfully');
        setEditingTest(null);
        fetchLaboratoryData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update test');
      }
    } catch (error) {
      toast.error('Failed to update test');
    }
  };

  // Report Management Functions
  const handleGenerateReport = async (reportData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/laboratory/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        toast.success('Lab report generated successfully');
        setShowReportForm(false);
        fetchLaboratoryData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to generate report');
      }
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  // Billing Management Functions
  const handleCreateBilling = async (billingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/laboratory/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(billingData)
      });

      if (response.ok) {
        toast.success('Billing created successfully');
        setShowBillingForm(false);
        fetchLaboratoryData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create billing');
      }
    } catch (error) {
      toast.error('Failed to create billing');
    }
  };

  // Render Test Management Tab
  const renderTestsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laboratory Management</h2>
          <p className="text-sm text-gray-600">View and manage laboratory services</p>
        </div>
        {canManageLab && (
          <button
            onClick={() => setShowTestForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Test
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div key={test._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                <p className="text-sm text-gray-500">{test.testCode}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {test.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {test.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price:</span> ${test.price}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Duration:</span> {test.duration}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Lab:</span> {test.labName}
              </p>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditingTest(test)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Reports Tab
  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lab Reports</h2>
        <button
          onClick={() => setShowReportForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {report.reportNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.patientId?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {report.testId?.testName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    report.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(report.reportDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Download className="w-4 h-4" />
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

  // Render Billing Tab
  const renderBillingTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lab Billing</h2>
        <button
          onClick={() => setShowBillingForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Billing
        </button>
      </div>

      {/* Billing Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Billing Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {billings.map((billing) => (
              <tr key={billing._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {billing.billingNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {billing.patientId?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${billing.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    billing.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    billing.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {billing.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(billing.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Download className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
            </div>
            <TestTube className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Billing</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalBilling}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['tests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
            {canViewReports && (
              <button
                key="reports"
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === 'reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                reports
              </button>
            )}
            {canViewBilling && (
              <button
                key="billing"
                onClick={() => setActiveTab('billing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === 'billing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                billing
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'tests' && renderTestsTab()}
              {activeTab === 'reports' && renderReportsTab()}
              {activeTab === 'billing' && renderBillingTab()}
            </>
          )}
        </div>
      </div>

      {/* Forms would go here - simplified for brevity */}
      {showTestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Test</h3>
            <p className="text-gray-600">Test form would go here...</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowTestForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTestForm(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryManagement;
