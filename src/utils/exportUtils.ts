import { Property, Lead, Deal, Customer } from '../types';
import { formatPKR } from './formatters';

/**
 * Helper to download a string content as a CSV file in browser
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clean & escape string fields for CSV compatibility
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Export Deals to CSV
 */
export function exportDealsToCSV(deals: Deal[]): void {
  const headers = [
    'Deal Number',
    'Agreement Date',
    'Closing Date',
    'Status',
    'Property Title',
    'Location',
    'Buyer Name',
    'Buyer Phone',
    'Seller Name',
    'Seller Phone',
    'Deal Value (PKR)',
    'Deal Value Formatted',
    'Commission %',
    'Commission Value (PKR)',
    'Commission Formatted',
    'Agent Name',
    'Token Paid (PKR)',
    'Payment Notes',
  ];

  const rows = deals.map((d) => [
    escapeCSV(d.dealNumber),
    escapeCSV(d.agreementDate),
    escapeCSV(d.closingDate || 'N/A'),
    escapeCSV(d.status.toUpperCase()),
    escapeCSV(d.propertyTitle),
    escapeCSV(d.propertyLocation),
    escapeCSV(d.buyerName),
    escapeCSV(d.buyerPhone),
    escapeCSV(d.sellerName),
    escapeCSV(d.sellerPhone),
    escapeCSV(d.dealValue),
    escapeCSV(d.dealValueFormatted),
    escapeCSV(d.commissionPercent + '%'),
    escapeCSV(d.commissionValue),
    escapeCSV(d.commissionValueFormatted),
    escapeCSV(d.agentName),
    escapeCSV(d.tokenPaid || 0),
    escapeCSV(d.paymentScheduleNotes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`KhyberProperties_Deals_Report_${dateStr}.csv`, csvContent);
}

/**
 * Export Properties Inventory to CSV
 */
export function exportPropertiesToCSV(properties: Property[]): void {
  const headers = [
    'Property ID',
    'Title',
    'Purpose',
    'Type',
    'Status',
    'Area Size',
    'Area Unit',
    'Price (PKR)',
    'Price Formatted',
    'City',
    'Area / Sector',
    'Address',
    'Bedrooms',
    'Bathrooms',
    'Gas Available',
    'Water Boring',
    'Electricity Backup',
    'Facing',
    'Listing Agent',
    'Agent Phone',
    'Added Date',
  ];

  const rows = properties.map((p) => [
    escapeCSV(p.id),
    escapeCSV(p.title),
    escapeCSV(p.purpose.toUpperCase()),
    escapeCSV(p.type.toUpperCase()),
    escapeCSV(p.status.toUpperCase()),
    escapeCSV(p.areaValue),
    escapeCSV(p.areaUnit),
    escapeCSV(p.price),
    escapeCSV(p.priceFormatted),
    escapeCSV(p.location?.city || 'Peshawar'),
    escapeCSV(p.location?.area || 'Peshawar'),
    escapeCSV(p.location?.address || ''),
    escapeCSV(p.bedrooms || 0),
    escapeCSV(p.bathrooms || 0),
    escapeCSV(p.features?.gasAvailable ? 'Yes' : 'No'),
    escapeCSV(p.features?.waterBoring ? 'Yes' : 'No'),
    escapeCSV(p.features?.electricityBackup || 'Grid'),
    escapeCSV(p.features?.facing || 'Normal'),
    escapeCSV(p.agent?.name || 'Hamza Afridi'),
    escapeCSV(p.agent?.phone || ''),
    escapeCSV(p.addedDate || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`KhyberProperties_Inventory_${dateStr}.csv`, csvContent);
}

/**
 * Export Leads to CSV
 */
export function exportLeadsToCSV(leads: Lead[]): void {
  const headers = [
    'Lead ID',
    'Customer Name',
    'Phone',
    'Email',
    'Source',
    'Status',
    'Priority',
    'Property Interested',
    'Target Budget (PKR)',
    'Budget Formatted',
    'Preferred Location',
    'Assigned Agent',
    'Created Date',
    'Last Contact',
    'Inquiry Message',
  ];

  const rows = leads.map((l) => [
    escapeCSV(l.id),
    escapeCSV(l.customerName),
    escapeCSV(l.phone),
    escapeCSV(l.email || 'N/A'),
    escapeCSV(l.source),
    escapeCSV(l.status.toUpperCase()),
    escapeCSV(l.priority.toUpperCase()),
    escapeCSV(l.propertyTitle || 'General'),
    escapeCSV(l.budget || 0),
    escapeCSV(l.budgetFormatted || formatPKR(l.budget || 0)),
    escapeCSV(l.preferredLocation || 'Peshawar'),
    escapeCSV(l.assignedAgent),
    escapeCSV(l.createdAt),
    escapeCSV(l.lastContact),
    escapeCSV(l.message || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`KhyberProperties_Leads_Pipeline_${dateStr}.csv`, csvContent);
}

/**
 * Export Customers CRM to CSV
 */
export function exportCustomersToCSV(customers: Customer[]): void {
  const headers = [
    'Customer ID',
    'Full Name',
    'Phone',
    'Email',
    'Type',
    'City',
    'Budget (PKR)',
    'Budget Formatted',
    'Target Locations',
    'Min-Max Area',
    'Area Unit',
    'Property Type Requirement',
    'Assigned Agent',
    'Registered Date',
    'Total Interactions',
  ];

  const rows = customers.map((c) => {
    const locations = c.requirement?.preferredLocations || (c.requirement as any)?.locations || [];
    const propTypes = Array.isArray(c.requirement?.propertyType)
      ? c.requirement.propertyType.join('; ')
      : (c.requirement as any)?.type || 'Any';

    return [
      escapeCSV(c.id),
      escapeCSV(c.name),
      escapeCSV(c.phone),
      escapeCSV(c.email || 'N/A'),
      escapeCSV(c.type.toUpperCase()),
      escapeCSV(c.city || 'Peshawar'),
      escapeCSV(c.budget || c.requirement?.maxBudget || 0),
      escapeCSV(c.budgetFormatted || formatPKR(c.requirement?.maxBudget || 0)),
      escapeCSV(locations.join('; ')),
      escapeCSV(`${c.requirement?.minArea || 0} - ${c.requirement?.maxArea || 0}`),
      escapeCSV(c.requirement?.areaUnit || 'Marla'),
      escapeCSV(propTypes),
      escapeCSV(c.assignedAgent),
      escapeCSV(c.createdDate),
      escapeCSV(c.timeline?.length || 0),
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`KhyberProperties_Customers_CRM_${dateStr}.csv`, csvContent);
}

/**
 * Export Complete Executive Intelligence Summary CSV
 */
export function exportExecutiveSummaryCSV(data: {
  totalVolume: number;
  totalCommission: number;
  dealsCount: number;
  propertiesCount: number;
  activeLeadsCount: number;
  customersCount: number;
  localities: { name: string; share: number; volume: string; count: number }[];
  agentLeaderboard: { name: string; role: string; deals: number; volume: string; commission: string; rating: string }[];
}): void {
  const lines: string[] = [];
  lines.push('KHYBER PROPERTIES & REAL ESTATE CONSULTANTS - EXECUTIVE MARKET REPORT');
  lines.push(`Generated On: ${new Date().toLocaleString()}`);
  lines.push(`Headquarters: Main University Road / Saddar, Peshawar, KP, Pakistan`);
  lines.push('');
  lines.push('--- EXECUTIVE SUMMARY METRICS ---');
  lines.push(`Gross Sales Transaction Volume,${formatPKR(data.totalVolume)} (${data.totalVolume} PKR)`);
  lines.push(`Agency Commission Earnings,${formatPKR(data.totalCommission)} (${data.totalCommission} PKR)`);
  lines.push(`Total Transactions / Deals,${data.dealsCount}`);
  lines.push(`Active Inventory Listings,${data.propertiesCount}`);
  lines.push(`Active Buyer/Investor Leads,${data.activeLeadsCount}`);
  lines.push(`Registered CRM Customers,${data.customersCount}`);
  lines.push('');
  lines.push('--- PESHAWAR LOCALITY DEMAND BREAKDOWN ---');
  lines.push('Locality Name,Market Share %,Transaction Volume,Property Listings');
  data.localities.forEach((loc) => {
    lines.push(`${escapeCSV(loc.name)},${loc.share}%,${escapeCSV(loc.volume)},${loc.count}`);
  });
  lines.push('');
  lines.push('--- AGENT & BROKER PERFORMANCE LEADERBOARD ---');
  lines.push('Agent Name,Designation,Deals Closed,Sales Volume,Commission Earned,Rating');
  data.agentLeaderboard.forEach((ag) => {
    lines.push(`${escapeCSV(ag.name)},${escapeCSV(ag.role)},${ag.deals},${escapeCSV(ag.volume)},${escapeCSV(ag.commission)},${ag.rating}`);
  });

  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`KhyberProperties_Executive_Report_${dateStr}.csv`, lines.join('\r\n'));
}

/**
 * Generate and trigger Printable/PDF Document for the Report
 */
export function generatePrintableReport(reportData: {
  totalVolume: number;
  totalCommission: number;
  propertiesCount: number;
  leadsCount: number;
  customersCount: number;
  deals: Deal[];
  localities: { name: string; share: number; volume: string; count: number }[];
  agentLeaderboard: { name: string; role: string; deals: number; volume: string; commission: string; rating: string }[];
}): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to generate and print PDF reports.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const dealsRows = reportData.deals
    .map(
      (d) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: bold;">${d.dealNumber}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
        <div style="font-weight: 600;">${d.propertyTitle}</div>
        <div style="font-size: 11px; color: #64748b;">${d.propertyLocation}</div>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.buyerName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${d.dealValueFormatted}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #059669;">${d.commissionValueFormatted}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.agentName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
        <span style="display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; border-radius: 4px; background-color: ${
          d.status === 'completed' ? '#dcfce7; color: #166534' : '#fef9c3; color: #854d0e'
        }; text-transform: uppercase;">${d.status}</span>
      </td>
    </tr>
  `
    )
    .join('');

  const localityRows = reportData.localities
    .map(
      (l) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${l.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1; background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #2563eb; height: 100%; width: ${l.share}%;"></div>
          </div>
          <span style="font-weight: bold; font-size: 12px;">${l.share}%</span>
        </div>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">${l.volume}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${l.count} Listings</td>
    </tr>
  `
    )
    .join('');

  const agentRows = reportData.agentLeaderboard
    .map(
      (ag) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
        <div style="font-weight: bold; color: #0f172a;">${ag.name}</div>
        <div style="font-size: 11px; color: #64748b;">${ag.role}</div>
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-align: center;">${ag.deals} Deals</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${ag.volume}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #059669;">${ag.commission}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #d97706; text-align: center;">${ag.rating}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Khyber Properties - Executive Business Intelligence Report</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 20px;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .agency-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .agency-sub {
          font-size: 13px;
          color: #64748b;
          margin-top: 3px;
        }
        .report-meta {
          text-align: right;
          font-size: 12px;
          color: #475569;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .metric-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
        }
        .metric-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }
        .metric-val {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 4px;
        }
        .metric-accent {
          color: #2563eb;
        }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid #cbd5e1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          margin-bottom: 24px;
        }
        th {
          background: #f1f5f9;
          padding: 8px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          color: #475569;
          text-transform: uppercase;
          border-bottom: 2px solid #cbd5e1;
        }
        .footer {
          margin-top: 30px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #94a3b8;
        }
        .print-btn-bar {
          background: #0f172a;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
        button {
          background: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <div>
          <strong>Executive Report Ready</strong> — Save as PDF using your browser's Print dialog.
        </div>
        <div>
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
      </div>

      <div class="header">
        <div>
          <div class="agency-title">KHYBER PROPERTIES</div>
          <div class="agency-sub">Premier Real Estate Brokerage & Investment Advisory • Peshawar, Pakistan</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">University Road & Saddar Commercial Branches • Phone: +92 91 5841234</div>
        </div>
        <div class="report-meta">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">EXECUTIVE BUSINESS REPORT</div>
          <div>Report Date: ${currentDate}</div>
          <div>Period: Current Financial Quarter</div>
          <div>Authority: Management Confidential</div>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Gross Transaction Volume</div>
          <div class="metric-val">${formatPKR(reportData.totalVolume)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Agency Commission Net</div>
          <div class="metric-val metric-accent">${formatPKR(reportData.totalCommission)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Closed / Ongoing Deals</div>
          <div class="metric-val">${reportData.deals.length} Deals</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Registered CRM Pipeline</div>
          <div class="metric-val">${reportData.customersCount} Clients / ${reportData.leadsCount} Leads</div>
        </div>
      </div>

      <div class="section-title">1. Closed Deals & Transaction Ledger</div>
      <table>
        <thead>
          <tr>
            <th>Deal #</th>
            <th>Property & Location</th>
            <th>Buyer</th>
            <th>Value</th>
            <th>Commission</th>
            <th>Agent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${dealsRows}
        </tbody>
      </table>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <div class="section-title">2. Peshawar Locality Demand Share</div>
          <table>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Share</th>
                <th>Volume</th>
                <th>Listings</th>
              </tr>
            </thead>
            <tbody>
              ${localityRows}
            </tbody>
          </table>
        </div>
        <div>
          <div class="section-title">3. Top Broker Performance</div>
          <table>
            <thead>
              <tr>
                <th>Specialist</th>
                <th>Deals</th>
                <th>Volume</th>
                <th>Commission</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              ${agentRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="footer">
        <div>Khyber Properties Peshawar • Reg No: KP-REA-2024-9182</div>
        <div>Generated by Khyber ERP System • Page 1 of 1</div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
