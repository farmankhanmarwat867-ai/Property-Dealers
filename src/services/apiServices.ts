import { Property, Customer, Lead, FollowUp, Deal, AgencySettings } from '../types';

/**
 * Service Layer Abstraction
 * Currently powered by the client state, easily replaceable with Axios / Fetch calls to:
 * `http://localhost:5000/api/properties`, `/api/leads`, etc.
 */

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    // In future: return (await axios.get('/api/properties')).data;
    return [];
  },
  async getPropertyById(id: string): Promise<Property | null> {
    return null;
  },
  async createProperty(payload: Partial<Property>): Promise<Property | null> {
    return null;
  },
  async updateProperty(id: string, payload: Partial<Property>): Promise<Property | null> {
    return null;
  },
  async deleteProperty(id: string): Promise<boolean> {
    return true;
  },
};

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    return [];
  },
  async createLead(payload: Partial<Lead>): Promise<Lead | null> {
    return null;
  },
  async updateLeadStatus(id: string, status: string): Promise<boolean> {
    return true;
  },
};

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    return [];
  },
  async getCustomerById(id: string): Promise<Customer | null> {
    return null;
  },
};

export const dealService = {
  async getDeals(): Promise<Deal[]> {
    return [];
  },
};
