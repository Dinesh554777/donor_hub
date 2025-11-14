import React from 'react';
import { User, View } from '../types';
import { BloodDropLogoIcon, LogoutIcon, DashboardIcon, UsersIcon, ClipboardListIcon, ArchiveIcon, BeakerIcon } from './icons';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavLink: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-red-700 text-white'
        : 'text-red-100 hover:bg-red-700'
    }`}
  >
    <Icon className="h-6 w-6" />
    <span className="font-semibold">{label}</span>
  </button>
);


const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, activeView, setActiveView }) => {
  
  const getNavItems = () => {
    switch (user.role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
          { id: 'donors', label: 'Donors', icon: UsersIcon },
          { id: 'requests', label: 'Requests', icon: ClipboardListIcon },
          { id: 'inventory', label: 'Inventory', icon: ArchiveIcon },
        ];
      case 'HOSPITAL':
        return [
            { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
            { id: 'bloodstock', label: 'Blood Stock', icon: BeakerIcon },
        ];
      case 'DONOR':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();

  return (
    <div className="w-64 bg-red-600 text-white flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-red-700">
        <BloodDropLogoIcon className="h-8 w-8 mr-2" />
        <span className="text-2xl font-bold">BBMS</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
            <NavLink
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => setActiveView(item.id as View)}
            />
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-red-700">
        <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-100 hover:bg-red-700 transition-colors duration-200"
        >
          <LogoutIcon className="h-6 w-6" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;