import { Property, CustomerRequirement } from '../types';

/**
 * Format PKR amounts into Pakistani Lacs & Crores format
 * e.g., 25,000,000 -> "Rs. 2.50 Crore"
 *        8,500,000 -> "Rs. 85 Lac"
 *           75,000 -> "Rs. 75,000"
 */
export function formatPKR(amount: number, isRent = false): string {
  if (!amount || amount === 0) return 'Price on Call';

  let formatted = '';
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    formatted = `Rs. ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Crore`;
  } else if (amount >= 100000) {
    const lac = amount / 100000;
    formatted = `Rs. ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`;
  } else if (amount >= 1000) {
    formatted = `Rs. ${amount.toLocaleString('en-PK')}`;
  } else {
    formatted = `Rs. ${amount}`;
  }

  if (isRent) {
    return `${formatted}/mo`;
  }
  return formatted;
}

/**
 * Convert user string input (e.g. "2.5 crore", "85 lac", "75000") to raw number
 */
export function parsePKRInput(input: string): number {
  const clean = input.toLowerCase().replace(/,/g, '').trim();
  if (clean.includes('crore') || clean.includes('cr')) {
    const num = parseFloat(clean.replace(/crore|cr/g, '').trim());
    return isNaN(num) ? 0 : Math.round(num * 10000000);
  }
  if (clean.includes('lac') || clean.includes('lakh')) {
    const num = parseFloat(clean.replace(/lac|lakh/g, '').trim());
    return isNaN(num) ? 0 : Math.round(num * 100000);
  }
  if (clean.includes('k')) {
    const num = parseFloat(clean.replace(/k/g, '').trim());
    return isNaN(num) ? 0 : Math.round(num * 1000);
  }
  const parsed = parseFloat(clean.replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format Area with standard Pakistani real estate units
 */
export function formatArea(value: number, unit: string): string {
  if (unit === 'Marla' && value >= 20) {
    const kanals = value / 20;
    return `${kanals % 1 === 0 ? kanals.toFixed(0) : kanals.toFixed(1)} Kanal (${value} Marla)`;
  }
  return `${value} ${unit}`;
}

/**
 * Calculate match percentage between a Customer's Requirement and a Property
 */
export interface PropertyMatchResult {
  property: Property;
  score: number; // 0 to 100
  matchedCriteria: string[];
  unmatchedCriteria: string[];
}

export function calculatePropertyMatch(
  requirement: CustomerRequirement,
  property: Property
): PropertyMatchResult {
  let score = 0;
  const matchedCriteria: string[] = [];
  const unmatchedCriteria: string[] = [];

  if (!requirement || !property) {
    return {
      property,
      score: 50,
      matchedCriteria: ['General availability'],
      unmatchedCriteria: [],
    };
  }

  // 1. Purpose match (Weight: 25%)
  if (!requirement.purpose || requirement.purpose === property.purpose) {
    score += 25;
    matchedCriteria.push(`Purpose: ${property.purpose?.toUpperCase() || 'SALE'}`);
  } else {
    unmatchedCriteria.push(`Purpose mismatch (${property.purpose})`);
  }

  // 2. Property Type match (Weight: 25%)
  const types = Array.isArray(requirement.propertyType)
    ? requirement.propertyType
    : (requirement as any).type
    ? [(requirement as any).type]
    : [];

  if (types.length === 0 || types.includes(property.type)) {
    score += 25;
    matchedCriteria.push(`Type: ${property.type?.toUpperCase() || 'RESIDENTIAL'}`);
  } else {
    unmatchedCriteria.push(`Type mismatch (Is ${property.type})`);
  }

  // 3. Location match (Weight: 25%)
  const prefLocations =
    requirement.preferredLocations || (requirement as any).locations || [];

  const propArea = property.location?.area || '';

  if (!Array.isArray(prefLocations) || prefLocations.length === 0) {
    score += 20;
    matchedCriteria.push('Any location acceptable');
  } else {
    const locationMatch = prefLocations.some(
      (loc) =>
        loc &&
        propArea &&
        (propArea.toLowerCase().includes(loc.toLowerCase()) ||
          loc.toLowerCase().includes(propArea.toLowerCase()))
    );
    if (locationMatch) {
      score += 25;
      matchedCriteria.push(`Location matched (${propArea || 'Peshawar'})`);
    } else {
      unmatchedCriteria.push(`Different location (${propArea || 'Peshawar'})`);
    }
  }

  // 4. Budget match (Weight: 25%)
  const minBudget = requirement.minBudget || 0;
  const maxBudget = requirement.maxBudget || Infinity;
  const propPrice = property.price || 0;

  if (propPrice >= minBudget && propPrice <= maxBudget) {
    score += 25;
    matchedCriteria.push('Within exact budget');
  } else if (propPrice <= maxBudget * 1.15 && propPrice >= minBudget * 0.85) {
    score += 15;
    matchedCriteria.push('Near budget range (±15%)');
  } else {
    unmatchedCriteria.push(
      propPrice > maxBudget ? 'Above maximum budget' : 'Below minimum budget'
    );
  }

  return {
    property,
    score: Math.min(100, score),
    matchedCriteria,
    unmatchedCriteria,
  };
}

/**
 * Format dates into friendly relative strings
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
