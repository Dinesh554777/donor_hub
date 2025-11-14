import React from 'react';
import { Donor } from '../types';

interface EditProfileProps {
    user: Donor;
    onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onCancel }) => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
                    <p className="text-gray-600">Keep your information up to date.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" id="full-name" defaultValue={user.name} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="blood-group" className="block text-sm font-medium text-gray-700">Blood Group</label>
                                <input type="text" id="blood-group" value={user.bloodType} disabled className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                <input type="number" id="age" value={user.age} disabled className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="tel" id="phone" defaultValue={user.phone} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" id="email" defaultValue={user.email} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                         <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" id="address" defaultValue={user.address} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md hover:bg-gray-300">
                                Cancel
                            </button>
                            <button type="submit" className="bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
