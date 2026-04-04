import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, User, Stethoscope, Crown } from 'lucide-react';

const RoleIndicator = () => {
  const { userData } = useContext(AppContext);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'super_admin':
        return {
          icon: <Crown className="w-4 h-4" />,
          label: 'Super Admin',
          color: 'purple',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        };
      case 'admin':
        return {
          icon: <Shield className="w-4 h-4" />,
          label: 'Admin',
          color: 'blue',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'doctor':
        return {
          icon: <Stethoscope className="w-4 h-4" />,
          label: 'Doctor',
          color: 'green',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'lab_technician':
        return {
          icon: <User className="w-4 h-4" />,
          label: 'Lab Technician',
          color: 'orange',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      default:
        return {
          icon: <User className="w-4 h-4" />,
          label: 'Patient',
          color: 'gray',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const roleInfo = getRoleInfo(userData?.role);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${roleInfo.bgColor} ${roleInfo.textColor} px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2`}>
          {roleInfo.icon}
          <div className="text-sm">
            <div className="font-medium">{roleInfo.label}</div>
            <div className="text-xs opacity-75">Logged in as</div>
          </div>
      </div>
    </div>
  );
};

export default RoleIndicator;
