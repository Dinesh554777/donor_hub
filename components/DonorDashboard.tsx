import React, { useState, useEffect } from 'react';
import { Donor } from '../types';
import { MOCK_DONATION_CAMPS } from '../constants';
import { CheckCircleIcon, EditIcon, HeartIcon } from './icons';
import EditProfile from './EditProfile';

interface DonorDashboardProps {
  user: Donor;
}

const DonorDashboard: React.FC<DonorDashboardProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [animatedLivesSaved, setAnimatedLivesSaved] = useState(0);

  useEffect(() => {
    const target = user.totalDonations * 3;
    if (target === 0) return;

    let frame: number;
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setAnimatedLivesSaved(Math.floor(progress * target));
        if (progress < 1) {
            frame = requestAnimationFrame(step);
        }
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
}, [user.totalDonations]);


  if (isEditing) {
    return <EditProfile user={user} onCancel={() => setIsEditing(false)} />;
  }
  
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Profile */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold">{getInitial(user.name)}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
          <div className="mt-4 text-sm font-semibold text-white bg-red-600 rounded-full px-4 py-1 inline-block">
            Blood Group: {user.bloodType}
          </div>
        </div>
      </div>

      {/* Right Column: Donation Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Your Impact</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-4xl font-bold text-red-600">{user.totalDonations}</p>
                <p className="text-sm text-gray-600 font-semibold mt-1">Total Donations</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-center">
                    <HeartIcon className="w-8 h-8 text-red-500 mr-2" />
                    <p className="text-4xl font-bold text-red-600">{animatedLivesSaved}</p>
                </div>
                <p className="text-sm text-gray-600 font-semibold mt-1">Lives Saved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Donation Status</h3>
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-start">
            <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">You are eligible to donate!</h4>
              <p className="text-sm">Thank you for your willingness to save lives.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Donation History</h3>
          <div className="flex justify-between items-center text-gray-700">
            <p>Last Donation Date:</p>
            <p className="font-semibold text-gray-900">{user.lastDonationDate}</p>
          </div>
          <hr className="my-3"/>
          <div className="flex justify-between items-center text-red-600">
            <p>Next Eligible Date:</p>
            <p className="font-bold">{user.nextEligibleDate}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Upcoming Donation Camps</h3>
          <div className="space-y-4">
            {MOCK_DONATION_CAMPS.map(camp => (
              <div key={camp.id} className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-gray-800">{camp.name}</p>
                <p className="text-sm text-gray-600">{camp.date} - {camp.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;