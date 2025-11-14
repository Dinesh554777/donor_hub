
import React from 'react';
import { User } from '../types';
import { BellIcon, LogoutIcon } from './icons';

interface HeaderProps {
  title: string;
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, user, onLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">
              Welcome, <span className="font-semibold">{user.name.split(' ')[0]}</span>!
            </span>
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <BellIcon className="h-6 w-6" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Logout"
            >
              <LogoutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
