
import React, { useState, useMemo, useEffect } from 'react';
import { Admin, View, HospitalRequest, Donor, AIFatigueResponse, BloodType, BloodStock } from '../types';
import { MOCK_BLOOD_STOCKS, MOCK_HOSPITAL_REQUESTS, MOCK_CHART_DATA, MOCK_DONORS_LIST } from '../constants';
import BloodStockCard from './BloodStockCard';
import { CheckCircleIcon, XCircleIcon, ClockIcon, SearchIcon, PlusIcon, ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon, EditIcon } from './icons';
import { analyzeDonorFatigue } from '../services/geminiService';

interface AdminPanelProps {
  user: Admin;
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

const AdminDashboard: React.FC = () => {
    const maxDonations = Math.max(...MOCK_CHART_DATA.map(d => d.donations));

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Monthly Donations Analytics</h3>
                <div className="flex items-end h-64 space-x-4 border-l border-b border-gray-200 pl-4 pb-1">
                    {MOCK_CHART_DATA.map(data => (
                        <div key={data.name} className="flex-1 flex flex-col items-center justify-end">
                            <div className="w-full bg-red-200 rounded-t-md hover:bg-red-400 transition-colors" style={{ height: `${(data.donations / maxDonations) * 100}%` }}>
                                <div className="text-center text-xs font-medium text-red-800 opacity-0 hover:opacity-100">{data.donations}</div>
                            </div>
                            <span className="text-xs font-medium text-gray-500 mt-2">{data.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Blood Inventory</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MOCK_BLOOD_STOCKS.map(stock => <BloodStockCard key={stock.type} stock={stock} />)}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Hospital Requests</h3>
                    <div className="space-y-4">
                        {MOCK_HOSPITAL_REQUESTS.slice(0, 3).map(req => (
                            <div key={req.id} className="border-l-4 p-3 rounded-r-md" style={{borderColor: req.status === 'Approved' ? '#10B981' : req.status === 'Rejected' ? '#EF4444' : '#F59E0B'}}>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-700">{req.reason}</p>
                                    <span className="font-bold text-lg text-red-600">{req.bloodType} ({req.units} units)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <p className="text-gray-500">{req.hospital}</p>
                                    <div>
                                        <button className="text-green-600 hover:text-green-800 font-medium mr-2">Approve</button>
                                        <button className="text-red-600 hover:text-red-800 font-medium">Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const NewDonorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (donor: Omit<Donor, 'id' | 'role' | 'totalDonations' | 'nextEligibleDate'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [newDonor, setNewDonor] = useState({
        name: '',
        email: '',
        bloodType: 'A+' as BloodType,
        lastDonationDate: '',
        age: 18,
        phone: '',
        address: '',
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDonor(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDonor.name && newDonor.email && newDonor.age > 17) {
            onSave(newDonor);
            setNewDonor({ name: '', email: '', bloodType: 'A+', lastDonationDate: '', age: 18, phone: '', address: '' });
        } else {
            alert('Please fill out all required fields. Donor must be 18 or older.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <style>{`
                  @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; }
                `}</style>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Add New Donor</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={newDonor.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value={newDonor.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" id="phone" value={newDonor.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" id="address" value={newDonor.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                            <input type="number" name="age" id="age" value={newDonor.age} onChange={handleChange} min="18" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                            <select name="bloodType" id="bloodType" value={newDonor.bloodType} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500">
                                {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="lastDonationDate" className="block text-sm font-medium text-gray-700">Last Donation Date (Optional)</label>
                        <input type="date" name="lastDonationDate" id="lastDonationDate" value={newDonor.lastDonationDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700">
                            Save Donor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditDonorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (donor: Donor) => void;
    donor: Donor | null;
}> = ({ isOpen, onClose, onSave, donor }) => {
    const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const [formData, setFormData] = useState<Donor | null>(null);

    useEffect(() => {
        if (donor) {
            setFormData(donor);
        }
    }, [donor]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'age' || name === 'totalDonations' ? parseInt(value, 10) : value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                 <style>{`
                  @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; }
                `}</style>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Edit Donor: {donor?.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="18" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                            <select name="bloodType" id="bloodType" value={formData.bloodType} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500">
                                {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lastDonationDate" className="block text-sm font-medium text-gray-700">Last Donation Date</label>
                            <input type="date" name="lastDonationDate" id="lastDonationDate" value={formData.lastDonationDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                         <div>
                            <label htmlFor="totalDonations" className="block text-sm font-medium text-gray-700">Total Donations</label>
                            <input type="number" name="totalDonations" id="totalDonations" value={formData.totalDonations} onChange={handleChange} min="0" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const DonorsView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBloodType, setSelectedBloodType] = useState('all');
    const [selectedAgeRange, setSelectedAgeRange] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: 'name'; direction: 'asc' | 'desc' } | null>(null);
    const [analysisResults, setAnalysisResults] = useState<{ [key: string]: AIFatigueResponse | { error: string } }>({});
    const [loadingAnalysis, setLoadingAnalysis] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS_LIST);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

    const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const AGE_RANGES = [
        { value: 'all', label: 'All Ages' },
        { value: '18-25', label: '18-25' },
        { value: '26-40', label: '26-40' },
        { value: '41+', label: '41+' },
    ];
    
    const getRiskColorClasses = (risk: string) => {
        const riskLower = risk.toLowerCase();
        if (riskLower === 'low') return 'bg-green-100 text-green-800';
        if (riskLower === 'medium') return 'bg-yellow-100 text-yellow-800';
        if (riskLower === 'high') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const handleSaveDonor = (newDonorData: Omit<Donor, 'id' | 'role' | 'totalDonations' | 'nextEligibleDate'>) => {
        const newDonor: Donor = {
            ...newDonorData,
            id: `donor-${Date.now()}`,
            role: 'DONOR',
            totalDonations: newDonorData.lastDonationDate ? 1 : 0,
            nextEligibleDate: 'N/A' // This would be calculated in a real app
        };
        setDonors(prev => [...prev, newDonor]);
        setIsModalOpen(false);
    };

    const handleOpenEditModal = (donor: Donor) => {
        setEditingDonor(donor);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingDonor(null);
        setIsEditModalOpen(false);
    };

    const handleUpdateDonor = (updatedDonor: Donor) => {
        setDonors(prevDonors =>
            prevDonors.map(donor =>
                donor.id === updatedDonor.id ? updatedDonor : donor
            )
        );
        handleCloseEditModal();
    };

    const requestSort = (key: 'name') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredDonors = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        let filtered = donors.filter(donor => {
            const matchesBloodType = selectedBloodType === 'all' || donor.bloodType === selectedBloodType;
            const matchesSearchTerm = !searchTerm || donor.name.toLowerCase().includes(lowercasedTerm);
            
            const matchesAgeRange = () => {
                if (selectedAgeRange === 'all') return true;
                if (selectedAgeRange === '18-25') return donor.age >= 18 && donor.age <= 25;
                if (selectedAgeRange === '26-40') return donor.age >= 26 && donor.age <= 40;
                if (selectedAgeRange === '41+') return donor.age >= 41;
                return true;
            };

            return matchesBloodType && matchesSearchTerm && matchesAgeRange();
        });

        if (sortConfig) {
            filtered.sort((a, b) => {
                if (sortConfig.direction === 'asc') {
                    return a.name.localeCompare(b.name);
                } else {
                    return b.name.localeCompare(a.name);
                }
            });
        }
        
        return filtered;
    }, [searchTerm, selectedBloodType, selectedAgeRange, sortConfig, donors]);

    const handleAnalyze = async (donor: Donor) => {
        setLoadingAnalysis(donor.id);
        try {
            const result = await analyzeDonorFatigue(donor);
            setAnalysisResults(prev => ({ ...prev, [donor.id]: result }));
        } catch (error) {
            console.error("Analysis failed for donor:", donor.id, error);
            setAnalysisResults(prev => ({ ...prev, [donor.id]: { error: 'Analysis failed.' } }));
        } finally {
            setLoadingAnalysis(null);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="font-bold text-lg text-gray-800">Manage Donors</h3>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select
                        value={selectedBloodType}
                        onChange={(e) => setSelectedBloodType(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="all">All Blood Types</option>
                        {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                    </select>
                    <select
                        value={selectedAgeRange}
                        onChange={(e) => setSelectedAgeRange(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        {AGE_RANGES.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
                    </select>
                    <div className="relative w-full sm:w-auto">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Donor
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>
                                <div className="flex items-center space-x-1">
                                    <span>Name</span>
                                    {sortConfig && sortConfig.key === 'name' ? (
                                        sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donations</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donated</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Actions</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDonors.length > 0 ? (
                            filteredDonors.map((donor) => {
                                const result = analysisResults[donor.id];
                                return (
                                <tr key={donor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.bloodType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.totalDonations}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.lastDonationDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {loadingAnalysis === donor.id ? (
                                            <div className="flex items-center text-gray-600">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Analyzing...</span>
                                            </div>
                                        ) : result ? (
                                            'error' in result ? (
                                                <span className="text-red-600 font-semibold">{result.error}</span>
                                            ) : (
                                                <div className="text-xs max-w-xs space-y-1">
                                                    <div>
                                                        <span className="font-semibold text-gray-800 mr-2">Risk:</span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${getRiskColorClasses(result.fatigueRisk)}`}>
                                                            {result.fatigueRisk}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">Suggestion:</p>
                                                        <p className="text-gray-600 italic">"{result.outreachSuggestion}"</p>
                                                    </div>
                                                </div>
                                            )
                                        ) : (
                                            <button
                                                onClick={() => handleAnalyze(donor)}
                                                disabled={loadingAnalysis !== null}
                                                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                Analyze Fatigue
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleOpenEditModal(donor)}
                                            className="text-red-600 hover:text-red-900 flex items-center"
                                            aria-label={`Edit ${donor.name}`}
                                        >
                                            <EditIcon className="w-5 h-5 mr-1" />
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    No donors found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
             <NewDonorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDonor}
            />
            <EditDonorModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleUpdateDonor}
                donor={editingDonor}
            />
        </div>
    );
};

const RequestsView: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold text-lg text-gray-800 mb-4">All Hospital Requests</h3>
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_HOSPITAL_REQUESTS.map((req) => (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.hospital}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.bloodType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.units}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusPill(req.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">Details</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);

const EditStockModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (units: number) => void;
    stock: BloodStock;
}> = ({ isOpen, onClose, onSave, stock }) => {
    const [units, setUnits] = useState(stock.units);

    useEffect(() => {
        setUnits(stock.units);
    }, [stock]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(units);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                <style>{`
                  @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .animate-fade-in-scale { animation: fade-in-scale 0.3s forwards; }
                `}</style>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Edit Stock for {stock.type}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="units" className="block text-sm font-medium text-gray-700">Units Available</label>
                        <input
                            type="number"
                            name="units"
                            id="units"
                            value={units}
                            onChange={(e) => setUnits(parseInt(e.target.value, 10) || 0)}
                            min="0"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InventoryView: React.FC = () => {
    const [bloodStocks, setBloodStocks] = useState<BloodStock[]>(MOCK_BLOOD_STOCKS);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStock, setEditingStock] = useState<BloodStock | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenEditModal = (stock: BloodStock) => {
        setEditingStock(stock);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditingStock(null);
        setIsEditModalOpen(false);
    };

    const handleSaveStock = (updatedUnits: number) => {
        if (!editingStock) return;
        setBloodStocks(prevStocks =>
            prevStocks.map(stock =>
                stock.type === editingStock.type ? { ...stock, units: updatedUnits } : stock
            )
        );
        handleCloseEditModal();
    };
    
    const filteredBloodStocks = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase().replace(/\s+/g, '');
        if (!lowercasedTerm) {
            return bloodStocks;
        }
        return bloodStocks.filter(stock => 
            stock.type.toLowerCase().includes(lowercasedTerm)
        );
    }, [searchTerm, bloodStocks]);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="font-bold text-lg text-gray-800">Full Blood Inventory</h3>
                <div className="relative w-full sm:w-auto">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Filter by blood type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>
             
            {filteredBloodStocks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredBloodStocks.map(stock => <BloodStockCard key={stock.type} stock={stock} onEdit={() => handleOpenEditModal(stock)} />)}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    No blood stock found for "{searchTerm}".
                </div>
            )}

            {editingStock && (
                <EditStockModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveStock}
                    stock={editingStock}
                />
            )}
        </div>
    );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ user, activeView }) => {
  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <AdminDashboard />;
      case 'donors': return <DonorsView />;
      case 'requests': return <RequestsView />;
      case 'inventory': return <InventoryView />;
      default: return <AdminDashboard />;
    }
  }

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
        {renderView()}
    </div>
  );
};

export default AdminPanel;
