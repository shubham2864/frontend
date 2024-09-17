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


export interface Quote {
  quoteNumber: string;
  policyNumber: string;
  carrierCompany: string;
  wholesaler: string;
  coverage: string;
  effectiveDate: string;
  expirationDate: string;
  minDaysToCancel: number;
  minEarnedRate: number;
  premium: number;
  taxes: number;
  otherFees: number;
  brokerFee: number;
  policyFee: number;
  commission: number;
  agencyFees: number;
  file: File | null;
  totalCost: number;
}

export interface Add1Error {
  email: string;
  firstname: string;
  lastname: string;
  contact: string;
  Address: string;
  city: string;
  state: string;
  Zip: string;
}

export interface Add2Error {
  BuisnessName: string;
  Address: string;
  Address2: string;
  city: string;
  state: string;
  Zip: string;
}

export interface QuoteError {
  quoteNumber: string;
  policyNumber: string;
  carrierCompany: string;
  wholesaler: string;
  coverage: string;
  effectiveDate: string;
  expirationDate: string;
  minDaysToCancel: string; // It's a number in Quote, but for errors, it's a string (the error message)
  minEarnedRate: string;
  premium: string;
  taxes: string;
  otherFees: string;
  brokerFee: string;
  policyFee: string;
  commission: string;
  agencyFees: string;
  file: string; // File validation is also a string error
}

export interface AgreementDetails {
  Add1: {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    Address: string;
    city: string;
    state: string;
    Zip: string;
  };
  Add2: {
    BuisnessName: string;
    Address: string;
    Address2: string;
    city: string;
    state: string;
    Zip: string;
  }[];
  quotes: {
    quoteNumber: string;
    policyNumber: string;
    carrierCompany: string;
    wholesaler: string;
    coverage: string;
    effectiveDate: string;
    expirationDate: string;
    minDaysToCancel: number;
    minEarnedRate: number;
    premium: number;
    taxes: number;
    otherFees: number;
    brokerFee: number;
    policyFee: number;
    commission: number;
    agencyFees: number;
    file: File | null;
    totalCost: number;
  }[];
}

export type PendingCompanies = Company[];
