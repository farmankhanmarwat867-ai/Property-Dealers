import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Property,
  Customer,
  Lead,
  FollowUp,
  Deal,
  AgencySettings,
  LeadStatus,
  FollowUpStatus,
  DealStatus,
  PropertyStatus,
  CustomerStatus,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_CUSTOMERS,
  INITIAL_LEADS,
  INITIAL_FOLLOWUPS,
  INITIAL_DEALS,
  INITIAL_AGENCY_SETTINGS,
  MOCK_AGENTS,
} from '../data/mockData';
import { formatPKR } from '../utils/formatters';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Properties
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'slug' | 'addedDate' | 'viewsCount' | 'inquiriesCount'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  togglePropertyStatus: (id: string, status: PropertyStatus) => void;
  getPropertyById: (id: string) => Property | undefined;
  
  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdDate' | 'timeline'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerTimelineEvent: (customerId: string, event: { type: 'call' | 'whatsapp' | 'meeting' | 'site_visit' | 'note' | 'deal' | 'inquiry'; title: string; description: string; author?: string }) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => Lead;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Follow-ups
  followUps: FollowUp[];
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => FollowUp;
  updateFollowUpStatus: (id: string, status: FollowUpStatus) => void;
  rescheduleFollowUp: (id: string, date: string, time: string, notes?: string) => void;
  deleteFollowUp: (id: string) => void;

  // Deals
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'dealNumber'>) => Deal;
  updateDealStatus: (id: string, status: DealStatus) => void;

  // Public portal actions
  submitPublicInquiry: (inquiry: {
    propertyId?: string;
    propertyTitle?: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    budget?: number;
  }) => void;
  submitListProperty: (data: any) => void;
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;

  // Admin Auth
  isAuthenticated: boolean;
  login: (email: string, pass?: string) => boolean;
  logout: () => void;
  currentUser: { name: string; email: string; role: string; avatar: string };

  // Settings
  agencySettings: AgencySettings;
  updateAgencySettings: (settings: Partial<AgencySettings>) => void;

  // Toasts
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROPERTIES: 'peshawar_crm_properties_v1',
  CUSTOMERS: 'peshawar_crm_customers_v1',
  LEADS: 'peshawar_crm_leads_v1',
  FOLLOWUPS: 'peshawar_crm_followups_v1',
  DEALS: 'peshawar_crm_deals_v1',
  SETTINGS: 'peshawar_crm_settings_v1',
  AUTH: 'peshawar_crm_auth_v1',
  USER: 'peshawar_crm_user_v1',
  FAVORITES: 'peshawar_crm_favorites_v1',
};

const DEFAULT_USER = {
  name: 'Hamza Afridi',
  email: 'hamza@khyberestate.pk',
  role: 'Principal Dealer & Director',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with fallbacks
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWUPS);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOWUPS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEALS);
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [agencySettings, setAgencySettings] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_AGENCY_SETTINGS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-4'];
  });

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
  }>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWUPS, JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(agencySettings));
  }, [agencySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Toast Helpers
  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Property Actions
  const addProperty = (
    data: Omit<Property, 'id' | 'slug' | 'addedDate' | 'viewsCount' | 'inquiriesCount'>
  ): Property => {
    const newId = 'prop-' + Date.now();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProperty: Property = {
      ...data,
      id: newId,
      slug: `${slug}-${newId.slice(-4)}`,
      addedDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      inquiriesCount: 0,
      priceFormatted: formatPKR(data.price, data.purpose === 'rent'),
    };

    setProperties((prev) => [newProperty, ...prev]);
    showToast('Property Listed Successfully', `"${newProperty.title}" is now available in the inventory.`);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.price) {
            updated.priceFormatted = formatPKR(updates.price, updated.purpose === 'rent');
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Property Updated', 'Listing changes have been saved.');
  };

  const deleteProperty = (id: string) => {
    const prop = properties.find((p) => p.id === id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast('Property Removed', `Listing "${prop?.title || id}" was deleted.`, 'info');
  };

  const togglePropertyStatus = (id: string, status: PropertyStatus) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    showToast('Status Updated', `Property marked as ${status.toUpperCase()}`);
  };

  const getPropertyById = (id: string) => {
    return properties.find((p) => p.id === id || p.slug === id);
  };

  // Customer Actions
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdDate' | 'timeline'>): Customer => {
    const newId = 'cust-' + Date.now();
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      timeline: [
        {
          id: 't-' + Date.now(),
          date: new Date().toISOString().split('T')[0],
          type: 'inquiry',
          title: 'Customer Profile Created',
          description: `Added to CRM database with requirement: ${customerData.requirement?.propertyType?.join(', ')}`,
          author: currentUser.name,
        },
      ],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast('Customer Added', `Customer record for ${newCustomer.name} created.`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer Record Updated', 'Customer information refreshed.');
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    showToast('Customer Removed', 'Customer record deleted from CRM.', 'info');
  };

  const addCustomerTimelineEvent = (
    customerId: string,
    event: { type: 'call' | 'whatsapp' | 'meeting' | 'site_visit' | 'note' | 'deal' | 'inquiry'; title: string; description: string; author?: string }
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newEvent = {
            id: 't-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            author: event.author || currentUser.name,
            ...event,
          };
          return {
            ...c,
            lastContact: new Date().toISOString().split('T')[0],
            timeline: [newEvent, ...c.timeline],
          };
        }
        return c;
      })
    );
    showToast('Timeline Updated', 'Activity logged to customer history.');
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id);
  };

  // Lead Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>): Lead => {
    const newId = 'lead-' + Date.now();
    const newLead: Lead = {
      ...leadData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, lastContact: new Date().toISOString().split('T')[0] } : l))
    );
    showToast('Lead Status Updated', `Pipeline moved to: ${status.toUpperCase()}`);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
    showToast('Lead Updated', 'Lead details updated.');
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead Deleted', 'Lead removed from pipeline.', 'info');
  };

  // Follow-up Actions
  const addFollowUp = (followUpData: Omit<FollowUp, 'id'>): FollowUp => {
    const newId = 'fu-' + Date.now();
    const newFU: FollowUp = {
      ...followUpData,
      id: newId,
    };
    setFollowUps((prev) => [newFU, ...prev]);
    showToast('Follow-up Scheduled', `Reminder set for ${newFU.date} at ${newFU.time}`);
    return newFU;
  };

  const updateFollowUpStatus = (id: string, status: FollowUpStatus) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id
          ? {
              ...fu,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            }
          : fu
      )
    );
    showToast('Follow-up Updated', `Status changed to ${status.toUpperCase()}`);
  };

  const rescheduleFollowUp = (id: string, date: string, time: string, notes?: string) => {
    setFollowUps((prev) =>
      prev.map((fu) =>
        fu.id === id
          ? {
              ...fu,
              date,
              time,
              status: 'pending',
              notes: notes ? `${fu.notes} (Rescheduled: ${notes})` : fu.notes,
            }
          : fu
      )
    );
    showToast('Follow-up Rescheduled', `Updated to ${date} at ${time}`);
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps((prev) => prev.filter((fu) => fu.id !== id));
    showToast('Follow-up Removed', 'Reminder deleted.', 'info');
  };

  // Deal Actions
  const addDeal = (dealData: Omit<Deal, 'id' | 'dealNumber'>): Deal => {
    const newId = 'deal-' + Date.now();
    const dealNumber = `PKR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newDeal: Deal = {
      ...dealData,
      id: newId,
      dealNumber,
    };
    setDeals((prev) => [newDeal, ...prev]);
    showToast('New Deal Created', `Deal #${dealNumber} logged for ${newDeal.propertyTitle}`);
    return newDeal;
  };

  const updateDealStatus = (id: string, status: DealStatus) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    showToast('Deal Updated', `Deal status changed to ${status.toUpperCase()}`);
  };

  // Public inquiry synchronized handler
  const submitPublicInquiry = (inquiry: {
    propertyId?: string;
    propertyTitle?: string;
    name: string;
    phone: string;
    email?: string;
    message: string;
    budget?: number;
  }) => {
    // 1. Create Lead in CRM
    const budgetVal = inquiry.budget || 10000000;
    const newLead = addLead({
      customerName: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      propertyId: inquiry.propertyId,
      propertyTitle: inquiry.propertyTitle || 'General Public Inquiry',
      budget: budgetVal,
      budgetFormatted: formatPKR(budgetVal),
      source: 'Website',
      status: 'new',
      priority: 'hot',
      assignedAgent: MOCK_AGENTS[0].name,
      message: inquiry.message,
      notes: 'Submitted directly from website inquiry form.',
    });

    // 2. Increment property inquiry count
    if (inquiry.propertyId) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === inquiry.propertyId
            ? { ...p, inquiriesCount: (p.inquiriesCount || 0) + 1 }
            : p
        )
      );
    }

    // 3. Create or update customer record if not exists
    const existingCustomer = customers.find((c) => c.phone === inquiry.phone);
    if (existingCustomer) {
      addCustomerTimelineEvent(existingCustomer.id, {
        type: 'inquiry',
        title: `Public Inquiry on ${inquiry.propertyTitle || 'Website'}`,
        description: inquiry.message,
        author: 'Website Form',
      });
    } else {
      addCustomer({
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        city: 'Peshawar',
        type: 'buyer',
        status: 'new',
        budget: budgetVal,
        budgetFormatted: formatPKR(budgetVal),
        requirement: {
          purpose: 'sale',
          propertyType: ['house'],
          minBudget: 0,
          maxBudget: budgetVal * 1.2,
          preferredLocations: ['Hayatabad', 'DHA Peshawar', 'University Town'],
          notes: inquiry.message,
        },
        interestedPropertyIds: inquiry.propertyId ? [inquiry.propertyId] : [],
        lastContact: new Date().toISOString().split('T')[0],
        assignedAgent: MOCK_AGENTS[0].name,
        notes: `Auto-created from website inquiry. Message: "${inquiry.message}"`,
      });
    }

    // 4. Automatically add a "Today's Follow-up" for dealer team
    addFollowUp({
      customerName: inquiry.name,
      phone: inquiry.phone,
      propertyTitle: inquiry.propertyTitle || 'Public Inquiry',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      type: 'Call',
      priority: 'high',
      notes: `New Website Lead: Call ${inquiry.name} regarding "${inquiry.propertyTitle || 'Peshawar properties'}"`,
      status: 'pending',
      assignedAgent: MOCK_AGENTS[0].name,
    });

    showToast(
      'Inquiry Received!',
      'Thank you! Our Peshawar property consultant will call or WhatsApp you within 30 minutes.'
    );
  };

  const submitListProperty = (formData: any) => {
    const rawPrice = formData.price || 15000000;
    const newProp = addProperty({
      title: formData.title || 'Newly Listed Property in Peshawar',
      purpose: formData.purpose || 'sale',
      type: formData.type || 'house',
      price: rawPrice,
      priceFormatted: formatPKR(rawPrice, formData.purpose === 'rent'),
      priceType: formData.purpose === 'rent' ? 'monthly' : 'total',
      areaValue: formData.areaValue || 10,
      areaUnit: formData.areaUnit || 'Marla',
      bedrooms: formData.bedrooms || 4,
      bathrooms: formData.bathrooms || 4,
      parkingSpaces: formData.parkingSpaces || 2,
      location: {
        area: formData.locationArea || 'Hayatabad Phase 3',
        city: 'Peshawar',
        address: formData.address || 'Peshawar',
      },
      description: formData.description || 'Verified property listing submitted via website portal.',
      amenities: formData.amenities || ['Gas Connection', 'Electricity', 'Water Boring'],
      features: {
        gasAvailable: true,
        electricityBackup: 'UPS',
        waterBoring: true,
        floors: 2,
      },
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      ],
      status: 'available',
      featured: false,
      verified: false,
      owner: {
        name: formData.ownerName || 'Property Owner',
        phone: formData.ownerPhone || '+92 300 1234567',
      },
      agent: MOCK_AGENTS[0],
    });

    showToast(
      'Property Submitted for Verification',
      'Your listing has been received. Our team will verify ownership documents and publish it live.'
    );
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      if (exists) {
        showToast('Removed from Saved', 'Property removed from your saved list.', 'info');
        return prev.filter((id) => id !== propertyId);
      } else {
        showToast('Saved Property', 'Property added to your favorites list.');
        return [...prev, propertyId];
      }
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  // Auth
  const login = (email: string, pass?: string): boolean => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    
    if (!cleanEmail) {
      showToast('Login Required', 'Please enter your dealer staff email.', 'error');
      return false;
    }

    let userToSet = DEFAULT_USER;

    if (cleanEmail.includes('hamza') || cleanEmail === 'admin@khyberestate.pk' || cleanEmail === 'admin@example.com') {
      userToSet = {
        name: 'Hamza Afridi',
        email: cleanEmail || 'hamza@khyberestate.pk',
        role: 'Principal Dealer & Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      };
    } else if (cleanEmail.includes('bilal') || cleanEmail.includes('marwat')) {
      userToSet = {
        name: 'Bilal Ahmad Marwat',
        email: cleanEmail,
        role: 'DHA Specialist & Land Acquisition Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      };
    } else {
      // Custom staff profile
      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      userToSet = {
        name: formattedName || 'Dealer Agent',
        email: cleanEmail,
        role: 'Property Consultant (Peshawar)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      };
    }

    setCurrentUser(userToSet);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToSet));
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');

    showToast(
      `Welcome, ${userToSet.name}!`,
      'Successfully authenticated into Khyber Estate CRM Portal.'
    );
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'false');
    showToast('Logged Out', 'You have been signed out of the admin portal.', 'info');
  };

  const updateAgencySettings = (newSettings: Partial<AgencySettings>) => {
    setAgencySettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings Saved', 'Agency configuration updated successfully.');
  };

  const resetToDemoData = () => {
    setProperties(INITIAL_PROPERTIES);
    setCustomers(INITIAL_CUSTOMERS);
    setLeads(INITIAL_LEADS);
    setFollowUps(INITIAL_FOLLOWUPS);
    setDeals(INITIAL_DEALS);
    setAgencySettings(INITIAL_AGENCY_SETTINGS);
    setFavorites(['prop-1', 'prop-4']);
    localStorage.clear();
    showToast('Reset Complete', 'Demo database restored to initial sample data.');
  };

  return (
    <AppContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        togglePropertyStatus,
        getPropertyById,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCustomerTimelineEvent,
        getCustomerById,
        leads,
        addLead,
        updateLeadStatus,
        updateLead,
        deleteLead,
        followUps,
        addFollowUp,
        updateFollowUpStatus,
        rescheduleFollowUp,
        deleteFollowUp,
        deals,
        addDeal,
        updateDealStatus,
        submitPublicInquiry,
        submitListProperty,
        favorites,
        toggleFavorite,
        isFavorite,
        isAuthenticated,
        login,
        logout,
        currentUser,
        agencySettings,
        updateAgencySettings,
        toasts,
        showToast,
        dismissToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
