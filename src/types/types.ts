export interface User {
  userName: string;
  email: string;
  address?: string;
  mobileNo?: string;
  dateOfBirth?: string;
}

export interface BusinessOwner {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface Company {
  _id: string;
  companyName: string;
  businessOwner: BusinessOwner[];
}

export type PendingCompanies = Company[];
