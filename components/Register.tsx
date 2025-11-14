import React from 'react';
import { BloodDropLogoIcon } from './icons';

interface RegisterProps {
    onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
             {/* Branding Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-white bg-gradient-to-br from-red-600 to-red-500">
                <BloodDropLogoIcon className="w-20 h-20 mb-4" />
                <h1 className="text-4xl font-bold mb-3 text-center">Become a Lifesaver</h1>
                <p className="text-red-100 text-center">Join our community of donors and make a real impact. The registration is quick and easy.</p>
            </div>
            
            {/* Form Panel */}
            <div className="w-full md:w-1/2 p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
                <p className="text-gray-500 mb-8">Fill out the form below to get started.</p>

                <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="sm:col-span-2">
                        <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="full-name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="tel" id="phone" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                        <input type="number" id="age" min="18" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="blood-group" className="block text-sm font-medium text-gray-700">Blood Group</label>
                        <select id="blood-group" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500">
                           <option>A+</option>
                           <option>A-</option>
                           <option>B+</option>
                           <option>B-</option>
                           <option>AB+</option>
                           <option>AB-</option>
                           <option>O+</option>
                           <option>O-</option>
                        </select>
                    </div>
                     <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" id="address" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    
                    <div className="sm:col-span-2 pt-4">
                         <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105">
                            Register
                        </button>
                    </div>
                </form>

                 <div className="text-center mt-6 text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onBackToLogin} className="font-semibold text-red-600 hover:text-red-500">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;