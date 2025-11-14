import { Donor, Admin, HospitalStaff, BloodStock, DonationCamp, HospitalRequest } from './types';

export const MOCK_DONOR: Donor = {
    id: 'donor-123',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'DONOR',
    bloodType: 'O-',
    totalDonations: 8,
    lastDonationDate: 'January 15, 2024',
    nextEligibleDate: 'March 11, 2024',
    age: 25,
    phone: '234-567-8901',
    address: '456 Oak Ave, Anytown',
};

export const MOCK_ADMIN: Admin = {
  id: 'admin-001',
  name: 'Admin Alex',
  email: 'alex@bbms.org',
  role: 'ADMIN',
};

export const MOCK_HOSPITAL: HospitalStaff = {
  id: 'hospital-777',
  name: 'Dr. Carter',
  email: 'carter@generalhospital.com',
  role: 'HOSPITAL',
  hospitalName: 'General Hospital',
};

export const MOCK_BLOOD_STOCKS: BloodStock[] = [
    { type: 'A+', units: 35 },
    { type: 'A-', units: 15 },
    { type: 'B+', units: 28 },
    { type: 'B-', units: 8 },
    { type: 'AB+', units: 12 },
    { type: 'AB-', units: 5 },
    { type: 'O+', units: 45 },
    { type: 'O-', units: 18 },
];

export const MOCK_DONATION_CAMPS: DonationCamp[] = [
    { id: 'camp-1', name: 'City Hall Community Drive', date: 'August 15, 2024', time: '9:00 AM to 3:00 PM' },
    { id: 'camp-2', name: 'University Campus Blood Drive', date: 'September 5, 2024', time: '10:00 AM to 4:00 PM' },
];

export const MOCK_HOSPITAL_REQUESTS: HospitalRequest[] = [
    { id: 'req-1', bloodType: 'A+', units: 5, date: '2024-07-20', status: 'Pending', reason: 'Emergency surgery for trauma patient', hospital: 'General Hospital' },
    { id: 'req-2', bloodType: 'O-', units: 10, date: '2024-07-18', status: 'Approved', reason: 'Scheduled transfusion', hospital: 'Mercy Hospital' },
    { id: 'req-3', bloodType: 'B+', units: 3, date: '2024-07-21', status: 'Pending', reason: 'Emergency surgery', hospital: 'City Central' },
    { id: 'req-4', bloodType: 'AB-', units: 2, date: '2024-07-15', status: 'Rejected', reason: 'Stock unavailable', hospital: 'General Hospital' },
];

export const MOCK_DONORS_LIST: Donor[] = [
  MOCK_DONOR,
  { id: 'donor-2', name: 'John Doe', email: 'john@example.com', role: 'DONOR', bloodType: 'A+', totalDonations: 12, lastDonationDate: 'Feb 10, 2024', nextEligibleDate: 'April 6, 2024', age: 34, phone: '123-456-7890', address: '123 Main St' },
  { id: 'donor-3', name: 'Peter Jones', email: 'peter@example.com', role: 'DONOR', bloodType: 'B-', totalDonations: 3, lastDonationDate: 'May 1, 2024', nextEligibleDate: 'June 26, 2024', age: 28, phone: '123-456-7890', address: '123 Main St' },
]

export const MOCK_CHART_DATA = [
    { name: 'Jan', donations: 40 },
    { name: 'Feb', donations: 30 },
    { name: 'Mar', donations: 52 },
    { name: 'Apr', donations: 45 },
    { name: 'May', donations: 80 },
    { name: 'Jun', donations: 60 },
    { name: 'Jul', donations: 75 },
];