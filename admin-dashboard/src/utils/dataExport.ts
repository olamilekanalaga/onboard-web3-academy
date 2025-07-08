// Data Export Utilities for Admin Dashboard
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportData {
  [key: string]: any;
}

// Enhanced PDF report with better formatting
export const createProfessionalPDFReport = (data: ExportData[], title: string, subtitle?: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 30;

  // Header with logo space and title
  doc.setFillColor(41, 128, 185); // Blue header
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ACADEMIA', 20, 25);

  doc.setFontSize(14);
  doc.text(title, pageWidth - 20, 25, { align: 'right' });

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // Subtitle
  if (subtitle) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(subtitle, 20, yPosition);
    yPosition += 20;
  }

  // Report metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  doc.text(`Total Records: ${data.length}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 20;

  // Table headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const colWidth = (pageWidth - 40) / headers.length;

    // Header background
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition - 5, pageWidth - 40, 15, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      doc.text(header, 25 + (index * colWidth), yPosition + 5);
    });

    yPosition += 20;
    doc.setFont('helvetica', 'normal');

    // Table rows
    data.forEach((row, rowIndex) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 30;
      }

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPosition - 5, pageWidth - 40, 12, 'F');
      }

      headers.forEach((header, cellIndex) => {
        const cellValue = String(row[header] || '');
        const truncatedValue = cellValue.length > 25 ? cellValue.substring(0, 22) + '...' : cellValue;
        doc.text(truncatedValue, 25 + (cellIndex * colWidth), yPosition + 3);
      });

      yPosition += 12;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Academia Admin Dashboard', 20, pageHeight - 10);
    doc.text(new Date().toLocaleDateString(), pageWidth - 20, pageHeight - 10, { align: 'right' });
  }

  return doc;
};

// Export data to CSV format
export const exportToCSV = (data: ExportData[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export data to Excel format
export const exportToExcel = (data: ExportData[], filename: string, sheetName: string = 'Data') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-size columns
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String(row[key] || '').length))
  }));
  worksheet['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Save the file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Export data to PDF format
export const exportToPDF = (data: ExportData[], filename: string, title: string = 'Report') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const doc = createProfessionalPDFReport(data, title, `${data.length} Records`);
  doc.save(`${filename}.pdf`);
};

// Format user data for export
export const formatUserDataForExport = (users: any[]) => {
  return users.map(user => ({
    'User ID': user.user_id,
    'Email': user.email,
    'Full Name': user.full_name || 'N/A',
    'Country': user.country_name || 'Unknown',
    'Level': user.current_level,
    'Total XP': user.total_xp,
    'Completed Courses': user.completed_courses.length,
    'Current Streak': user.current_streak,
    'Longest Streak': user.longest_streak,
    'Study Time (hours)': Math.round(user.total_study_time / 60),
    'Completion Rate (%)': user.course_completion_rate.toFixed(1),
    'Last Activity': new Date(user.last_activity_date).toLocaleDateString(),
    'Registration Date': new Date(user.created_at).toLocaleDateString()
  }));
};

// Format analytics data for export
export const formatAnalyticsDataForExport = (analytics: any) => {
  return [{
    'Total Users': analytics.total_users,
    'Active Users Today': analytics.active_users_today,
    'Active Users (Week)': analytics.active_users_week,
    'Active Users (Month)': analytics.active_users_month,
    'New Users Today': analytics.new_users_today,
    'New Users (Week)': analytics.new_users_week,
    'New Users (Month)': analytics.new_users_month,
    'Average Session Duration': analytics.avg_session_duration,
    'Total Course Completions': analytics.total_course_completions,
    'Total XP Earned': analytics.total_xp_earned,
    'Export Date': new Date().toISOString()
  }];
};

// Format country data for export
export const formatCountryDataForExport = (countries: any[]) => {
  return countries.map(country => ({
    'Country': country.country_name,
    'Country Code': country.country_code,
    'Flag': country.flag_emoji,
    'Total Users': country.user_count,
    'Active Users': country.active_users,
    'Average XP': Math.round(country.avg_xp || 0),
    'Engagement Rate (%)': country.user_count > 0 ? ((country.active_users / country.user_count) * 100).toFixed(1) : '0.0'
  }));
};

// Generate comprehensive PDF report
export const generateComprehensivePDFReport = async (data: {
  analytics?: any;
  users?: any[];
  countries?: any[];
  courses?: any[];
}) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Professional header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ACADEMIA', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(16);
  doc.text('Comprehensive Analytics Report', pageWidth / 2, 40, { align: 'center' });

  // Reset colors and add content
  doc.setTextColor(0, 0, 0);
  let yPosition = 70;

  // Report metadata
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  doc.text(`Report ID: ${timestamp}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 20;

  // Executive Summary Box
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPosition, pageWidth - 40, 80, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, yPosition, pageWidth - 40, 80);

  yPosition += 15;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 30, yPosition);

  yPosition += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  if (data.analytics) {
    const summaryData = [
      { label: 'Total Users', value: data.analytics.total_users?.toLocaleString() || 'N/A' },
      { label: 'Active Users (Month)', value: data.analytics.active_users_month?.toLocaleString() || 'N/A' },
      { label: 'Total XP Earned', value: data.analytics.total_xp_earned?.toLocaleString() || 'N/A' },
      { label: 'Course Completions', value: data.analytics.total_course_completions?.toLocaleString() || 'N/A' },
      { label: 'Countries Represented', value: data.countries?.length?.toString() || '0' }
    ];

    summaryData.forEach((item, index) => {
      const xPos = 30 + (index % 2) * 120;
      const yPos = yPosition + Math.floor(index / 2) * 12;
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.label}:`, xPos, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(item.value, xPos + 80, yPos);
    });
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Academia Admin Dashboard - Confidential', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the comprehensive report
  doc.save(`academia-comprehensive-report-${timestamp}.pdf`);
};

// Generate Excel workbook with multiple sheets
export const generateComprehensiveExcelReport = async (data: {
  analytics?: any;
  users?: any[];
  countries?: any[];
  courses?: any[];
}) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const workbook = XLSX.utils.book_new();

  // Analytics Summary Sheet
  if (data.analytics) {
    const analyticsData = formatAnalyticsDataForExport(data.analytics);
    const analyticsSheet = XLSX.utils.json_to_sheet(analyticsData);
    XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics Summary');
  }

  // Users Sheet
  if (data.users && data.users.length > 0) {
    const userData = formatUserDataForExport(data.users);
    const usersSheet = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');
  }

  // Countries Sheet
  if (data.countries && data.countries.length > 0) {
    const countryData = formatCountryDataForExport(data.countries);
    const countriesSheet = XLSX.utils.json_to_sheet(countryData);
    XLSX.utils.book_append_sheet(workbook, countriesSheet, 'Countries');
  }

  // Save the workbook
  XLSX.writeFile(workbook, `academia-comprehensive-report-${timestamp}.xlsx`);
};

// Utility to format numbers for display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Utility to format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Utility to format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Utility to calculate growth rate
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Utility to format date ranges
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = startDate.toLocaleDateString();
  const end = endDate.toLocaleDateString();
  return `${start} - ${end}`;
};
