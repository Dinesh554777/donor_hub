import React, { useState } from 'react';
import { User, UserRole, View } from './types';
import { MOCK_DONOR, MOCK_ADMIN, MOCK_HOSPITAL } from './constants';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import DonorDashboard from './components/DonorDashboard';
import AdminPanel from './components/AdminPanel';
import HospitalView from './components/HospitalView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const handleLogin = (role: UserRole) => {
    if (role === 'DONOR') setCurrentUser(MOCK_DONOR);
    else if (role === 'ADMIN') setCurrentUser(MOCK_ADMIN);
    else if (role === 'HOSPITAL') setCurrentUser(MOCK_HOSPITAL);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
  
  const renderContent = () => {
    switch (currentUser.role) {
      case 'DONOR':
        return <DonorDashboard user={MOCK_DONOR} />;
      case 'ADMIN':
        return <AdminPanel user={MOCK_ADMIN} activeView={activeView} />;
      case 'HOSPITAL':
        return <HospitalView user={MOCK_HOSPITAL} activeView={activeView} />;
      default:
        return <div>Not implemented</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        user={currentUser} 
        onLogout={handleLogout} 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;