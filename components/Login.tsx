import React, { useState } from 'react';
import { UserRole } from '../types';
import { BloodDropLogoIcon, MailIcon, LockClosedIcon } from './icons';
import Register from './Register';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('DONOR');
  const [view, setView] = useState<'login' | 'register'>('login');

  const TabButton = ({ role, children }: { role: UserRole, children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => setActiveTab(role)}
      className={`w-full py-2.5 text-sm font-semibold leading-5 rounded-lg focus:outline-none transition-colors duration-200
        ${activeTab === role
          ? 'bg-red-600 text-white shadow'
          : 'text-gray-600 hover:bg-red-100'
        }`}
    >
      {children}
    </button>
  );

  if (view === 'register') {
    return <Register onBackToLogin={() => setView('login')} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Branding Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-white bg-gradient-to-br from-red-600 to-red-500">
           <BloodDropLogoIcon className="w-20 h-20 mb-4" />
          <h1 className="text-4xl font-bold mb-3 text-center">Give the Gift of Life</h1>
          <p className="text-red-100 text-center">Your donation can save up to three lives. Thank you for making a difference.</p>
        </div>

        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Sign in to continue to your dashboard.</p>
            
            <div className="mb-6">
                <div className="flex space-x-2 rounded-lg bg-gray-100 p-1">
                    <TabButton role="DONOR">Donor</TabButton>
                    <TabButton role="HOSPITAL">Hospital</TabButton>
                    <TabButton role="ADMIN">Admin</TabButton>
                </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(activeTab); }}>
                <div>
                    <label htmlFor="email" className="sr-only">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="email" name="email" type="email" autoComplete="email" required className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-100 border-2 border-transparent focus:border-red-500 focus:bg-white focus:ring-0 transition" placeholder="Email Address" />
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input id="password" name="password" type="password" autoComplete="current-password" required className="w-full pl-10 pr-4 py-3 rounded-md bg-gray-100 border-2 border-transparent focus:border-red-500 focus:bg-white focus:ring-0 transition" placeholder="Password" />
                    </div>
                </div>
                <div className="text-right text-sm">
                    <a href="#" className="font-medium text-red-600 hover:text-red-500">Forgot password?</a>
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105">
                        Sign In
                    </button>
                </div>
            </form>

            <div className="text-center mt-6 text-sm">
                <p className="text-gray-600">
                    Not a donor yet?{' '}
                    <button onClick={() => setView('register')} className="font-semibold text-red-600 hover:text-red-500">
                        Register here
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;