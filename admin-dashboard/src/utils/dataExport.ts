// Data Export Utilities for Admin Dashboard

export interface ExportData {
  [key: string]: any;
}

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

// Export data to JSON format
export const exportToJSON = (data: ExportData[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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
    'Average XP': Math.round(country.avg_xp),
    'Total Revenue': country.total_revenue.toFixed(2),
    'Engagement Rate (%)': ((country.active_users / country.user_count) * 100).toFixed(1)
  }));
};

// Generate comprehensive report
export const generateComprehensiveReport = async (data: {
  analytics?: any;
  users?: any[];
  countries?: any[];
  courses?: any[];
}) => {
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Export each dataset separately
  if (data.analytics) {
    const analyticsData = formatAnalyticsDataForExport(data.analytics);
    exportToCSV(analyticsData, `analytics-report-${timestamp}`);
  }
  
  if (data.users && data.users.length > 0) {
    const userData = formatUserDataForExport(data.users);
    exportToCSV(userData, `users-report-${timestamp}`);
  }
  
  if (data.countries && data.countries.length > 0) {
    const countryData = formatCountryDataForExport(data.countries);
    exportToCSV(countryData, `countries-report-${timestamp}`);
  }
  
  if (data.courses && data.courses.length > 0) {
    exportToCSV(data.courses, `courses-report-${timestamp}`);
  }
  
  // Create a summary report
  const summary = {
    'Report Generated': new Date().toISOString(),
    'Total Users': data.users?.length || 0,
    'Total Countries': data.countries?.length || 0,
    'Total Courses': data.courses?.length || 0,
    'Data Included': Object.keys(data).join(', ')
  };
  
  exportToJSON([summary], `admin-dashboard-summary-${timestamp}`);
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
