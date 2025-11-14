export type UserRole = 'DONOR' | 'ADMIN' | 'HOSPITAL';
export type View = 'dashboard' | 'donors' | 'requests' | 'inventory' | 'bloodstock' | 'profile' | 'editProfile';

// FIX: Added missing Achievement type.
export interface Achievement {
  title: string;
  description: string;
}

// FIX: Added missing AIFatigueResponse type.
export interface AIFatigueResponse {
  fatigueRisk: string;
  outreachSuggestion: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Donor extends User {
  role: 'DONOR';
  bloodType: string;
  totalDonations: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  age: number;
  phone: string;
  address: string;
  // FIX: Added optional donationHistory property to Donor type.
  donationHistory?: { date: string }[];
}

export interface Admin extends User {
  role: 'ADMIN';
}

export interface HospitalStaff extends User {
  role: 'HOSPITAL';
  hospitalName: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodStock {
  type: BloodType;
  units: number;
}

export interface DonationCamp {
    id: string;
    name: string;
    date: string;
    time: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface HospitalRequest {
    id: string;
    bloodType: BloodType;
    units: number;
    date: string;
    status: RequestStatus;
    reason?: string;
    hospital?: string;
}