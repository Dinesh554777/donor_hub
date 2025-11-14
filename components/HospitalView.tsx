import React, { useState, useMemo } from 'react';
import { HospitalStaff, View, BloodStock, HospitalRequest } from '../types';
import { MOCK_BLOOD_STOCKS, MOCK_HOSPITAL_REQUESTS } from '../constants';
import BloodStockCard from './BloodStockCard';
import { PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon, SearchIcon } from './icons';

interface HospitalViewProps {
  user: HospitalStaff;
  activeView: View;
}

const getStatusPill = (status: HospitalRequest['status']) => {
  switch (status) {
    case 'Approved':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircleIcon className="w-4 h-4 mr-1.5"/>{status}</span>;
    case 'Rejected':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircleIcon className="w-4 h-4 mr-1.5"/>{status}</span>;
    case 'Pending':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><ClockIcon className="w-4 h-4 mr-1.5"/>{status}</span>;
  }
}

const HospitalDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRequests = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        return MOCK_HOSPITAL_REQUESTS.filter(r =>
            r.hospital === 'General Hospital' &&
            (lowercasedTerm === '' ||
             r.bloodType.toLowerCase().includes(lowercasedTerm) ||
             r.status.toLowerCase().includes(lowercasedTerm))
        );
    }, [searchTerm]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Blood Stock Search</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MOCK_BLOOD_STOCKS.map(stock => <BloodStockCard key={stock.type} stock={stock} />)}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                        <h3 className="font-bold text-lg text-gray-800">Track Existing Requests</h3>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by blood type or status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRequests.length > 0 ? (
                            filteredRequests.map(req => (
                              <tr key={req.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-800">{req.bloodType}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{req.units}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{req.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">{getStatusPill(req.status)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">
                                    No requests found matching "{searchTerm}".
                                </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                </div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow sticky top-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Request Blood</h3>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="blood-group" className="block text-sm font-medium text-gray-700">Blood Group</label>
                            <input type="text" id="blood-group" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="units-required" className="block text-sm font-medium text-gray-700">Units Required</label>
                            <input type="number" id="units-required" placeholder="e.g., 5" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Request</label>
                            <textarea id="reason" rows={3} placeholder="e.g., Emergency surgery for trauma patient" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const BloodStockView: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Current Blood Stock</h2>
        <p className="text-gray-600 mb-6">Real-time inventory levels.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MOCK_BLOOD_STOCKS.map(stock => (
                 <div key={stock.type} className={`border-2 rounded-lg p-4 text-center ${stock.units < 10 ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                    {stock.units < 10 && <span className="block text-xs font-bold text-red-600 mb-2">LOW STOCK</span>}
                    <div className="text-4xl font-bold text-red-700">{stock.type}</div>
                    <div className="text-gray-600">{stock.units} Units Available</div>
                 </div>
            ))}
        </div>
    </div>
);


const HospitalView: React.FC<HospitalViewProps> = ({ user, activeView }) => {
    const renderView = () => {
        switch(activeView) {
            case 'dashboard': return <HospitalDashboard />;
            case 'bloodstock': return <BloodStockView />;
            default: return <HospitalDashboard />;
        }
    }
    
    return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
            <button className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">
                <PlusIcon className="w-5 h-5 mr-2" /> New Blood Request
            </button>
        </div>
        {renderView()}
    </div>
  );
};

export default HospitalView;