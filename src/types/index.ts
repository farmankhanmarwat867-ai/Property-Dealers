export type PropertyPurpose = 'sale' | 'rent';
export type PropertyType = 'house' | 'plot' | 'apartment' | 'commercial' | 'portion';
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented';
export type AreaUnit = 'Marla' | 'Kanal' | 'Sq. Ft.' | 'Sq. Yd.';

export interface PropertyLocation {
  area: string; // e.g. "Hayatabad Phase 3", "University Town", "DHA Peshawar Sector A"
  city: string; // "Peshawar"
  address: string;
  landmark?: string;
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyFeatures {
  yearBuilt?: number;
  facing?: 'North' | 'South' | 'East' | 'West' | 'Corner' | 'Main Road';
  gasAvailable: boolean;
  electricityBackup: 'None' | 'UPS' | 'Solar System' | 'Generator';
  waterBoring: boolean;
  cornerPlot?: boolean;
  mainBoulevard?: boolean;
  furnished?: boolean;
  floors?: number;
  servantQuarter?: boolean;
}

export interface PropertyOwner {
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  avatar: string;
  role: string;
  rating?: number;
}

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Property {
  id: string;
  title: string;
  slug: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  price: number; // in PKR (e.g. 28500000)
  priceFormatted: string; // "Rs. 2.85 Crore"
  priceType: 'total' | 'monthly' | 'per_marla';
  areaValue: number; // e.g. 10
  areaUnit: AreaUnit; // "Marla"
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  totalFloors?: number;
  yearBuilt?: number;
  ownerName?: string;
  ownerPhone?: string;
  location: PropertyLocation;
  description: string;
  amenities: string[];
  features: PropertyFeatures;
  images: string[];
  status: PropertyStatus;
  featured?: boolean;
  verified?: boolean;
  addedDate: string;
  viewsCount: number;
  inquiriesCount: number;
  owner: PropertyOwner;
  agent: AgentInfo;
}

export type CustomerType = 'buyer' | 'tenant' | 'seller' | 'investor';
export type CustomerStatus = 'new' | 'interested' | 'negotiating' | 'converted' | 'lost';

export interface CustomerRequirement {
  purpose: PropertyPurpose;
  propertyType: PropertyType[];
  minBudget: number;
  maxBudget: number;
  preferredLocations: string[];
  minArea?: number;
  maxArea?: number;
  areaUnit?: AreaUnit;
  minBedrooms?: number;
  notes?: string;
}

export interface CustomerTimelineEvent {
  id: string;
  date: string;
  type: 'call' | 'whatsapp' | 'meeting' | 'site_visit' | 'note' | 'deal' | 'inquiry';
  title: string;
  description: string;
  author: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  type: CustomerType;
  status: CustomerStatus;
  budget: number;
  budgetFormatted: string;
  requirement: CustomerRequirement;
  interestedPropertyIds: string[];
  lastContact: string;
  createdDate: string;
  assignedAgent: string;
  notes: string;
  timeline: CustomerTimelineEvent[];
}

export type LeadSource = 
  | 'Website'
  | 'WhatsApp'
  | 'Facebook'
  | 'Instagram'
  | 'Phone'
  | 'Walk-in'
  | 'Referral'
  | 'Zameen Export';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'site_visit_scheduled'
  | 'viewing'
  | 'negotiation'
  | 'won'
  | 'lost';

export type LeadPriority = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  budget: number;
  budgetFormatted: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assignedAgent: string;
  message?: string;
  lastContact: string;
  createdAt: string;
  notes?: string;
  preferredLocation?: string;
}

export type FollowUpStatus = 'pending' | 'completed' | 'overdue' | 'cancelled';
export type FollowUpType = 'Call' | 'WhatsApp' | 'Site Visit' | 'Meeting' | 'Document Submission';

export interface FollowUp {
  id: string;
  customerId?: string;
  customerName: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: FollowUpType;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  status: FollowUpStatus;
  assignedAgent: string;
  completedAt?: string;
}

export type DealStatus = 'negotiating' | 'agreement' | 'completed' | 'cancelled';

export interface Deal {
  id: string;
  dealNumber: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  sellerPhone: string;
  dealValue: number; // in PKR
  dealValueFormatted: string;
  commissionPercent: number; // e.g. 1% or 2%
  commissionValue: number; // in PKR
  commissionValueFormatted: string;
  agentName: string;
  status: DealStatus;
  agreementDate: string;
  closingDate?: string;
  tokenPaid?: number;
  paymentScheduleNotes?: string;
  notes?: string;
}

export interface AgencySettings {
  agencyName: string;
  tagline: string;
  registrationNumber: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  branches: { name: string; address: string; phone: string }[];
  workingHours: string;
  defaultCommissionRate: number;
  currency: string;
  leadAutoAssign: boolean;
  featuredBannerText: string;
}

export interface FilterState {
  searchQuery: string;
  purpose: PropertyPurpose | 'all';
  type: PropertyType | 'all';
  location: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number | 'all';
  bathrooms: number | 'all';
  verifiedOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'area-desc' | 'popular';
}
