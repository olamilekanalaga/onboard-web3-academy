// Location Detection Utilities for Academia
// Automatically detect user location using multiple methods

export interface LocationData {
  country: string;
  countryCode: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  flag?: string;
  ip?: string;
  method: 'ip' | 'gps' | 'phone' | 'manual';
  accuracy: 'high' | 'medium' | 'low';
}

// Free IP Geolocation Services (No API key required)
const IP_GEOLOCATION_APIS = [
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    parser: (data: any): LocationData => ({
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      currency: data.currency,
      ip: data.ip,
      method: 'ip',
      accuracy: 'high'
    })
  },
  {
    name: 'ipgeolocation.io',
    url: 'https://api.ipgeolocation.io/ipgeo',
    parser: (data: any): LocationData => ({
      country: data.country_name,
      countryCode: data.country_code2,
      region: data.state_prov,
      city: data.city,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timezone: data.time_zone?.name,
      currency: data.currency?.code,
      flag: data.country_flag,
      ip: data.ip,
      method: 'ip',
      accuracy: 'high'
    })
  },
  {
    name: 'ip-api.com',
    url: 'http://ip-api.com/json/',
    parser: (data: any): LocationData => ({
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      ip: data.query,
      method: 'ip',
      accuracy: 'medium'
    })
  }
];

/**
 * Detect user location using IP Geolocation
 * This is the most reliable method for automatic location detection
 */
export const detectLocationByIP = async (): Promise<LocationData | null> => {
  for (const api of IP_GEOLOCATION_APIS) {
    try {
      console.log(`Trying ${api.name} for location detection...`);
      
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const locationData = api.parser(data);
      
      // Validate required fields
      if (locationData.country && locationData.countryCode) {
        console.log(`✅ Location detected via ${api.name}:`, locationData);
        return locationData;
      } else {
        throw new Error('Invalid response data');
      }
      
    } catch (error) {
      console.warn(`❌ ${api.name} failed:`, error);
      continue; // Try next API
    }
  }
  
  console.error('❌ All IP geolocation services failed');
  return null;
};

/**
 * Detect user location using Browser Geolocation API (GPS)
 * Requires user permission - more accurate but less reliable
 */
export const detectLocationByGPS = (): Promise<LocationData | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('❌ Geolocation not supported by browser');
      resolve(null);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes cache
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get country from coordinates
          const locationData = await reverseGeocode(latitude, longitude);
          
          if (locationData) {
            console.log('✅ Location detected via GPS:', locationData);
            resolve({
              ...locationData,
              latitude,
              longitude,
              method: 'gps',
              accuracy: 'high'
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.error('❌ GPS reverse geocoding failed:', error);
          resolve(null);
        }
      },
      (error) => {
        console.warn('❌ GPS location access denied or failed:', error.message);
        resolve(null);
      },
      options
    );
  });
};

/**
 * Reverse geocoding: Convert coordinates to country information
 */
const reverseGeocode = async (lat: number, lon: number): Promise<Partial<LocationData> | null> => {
  try {
    // Using OpenStreetMap Nominatim (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Academia-App/1.0'
        }
      }
    );

    const data = await response.json();
    
    if (data.address && data.address.country) {
      return {
        country: data.address.country,
        countryCode: data.address.country_code?.toUpperCase(),
        region: data.address.state || data.address.region,
        city: data.address.city || data.address.town || data.address.village
      };
    }
    
    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

/**
 * Extract country from phone number
 * Useful if you collect phone numbers during registration
 */
export const detectLocationByPhone = (phoneNumber: string): LocationData | null => {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Common country codes (you can expand this list)
  const countryCodes: { [key: string]: { country: string; code: string } } = {
    '1': { country: 'United States', code: 'US' },
    '44': { country: 'United Kingdom', code: 'GB' },
    '33': { country: 'France', code: 'FR' },
    '49': { country: 'Germany', code: 'DE' },
    '234': { country: 'Nigeria', code: 'NG' },
    '91': { country: 'India', code: 'IN' },
    '86': { country: 'China', code: 'CN' },
    '81': { country: 'Japan', code: 'JP' },
    '82': { country: 'South Korea', code: 'KR' },
    '55': { country: 'Brazil', code: 'BR' },
    '52': { country: 'Mexico', code: 'MX' },
    '61': { country: 'Australia', code: 'AU' },
    '27': { country: 'South Africa', code: 'ZA' },
    '20': { country: 'Egypt', code: 'EG' },
    '971': { country: 'United Arab Emirates', code: 'AE' },
    '966': { country: 'Saudi Arabia', code: 'SA' },
    '90': { country: 'Turkey', code: 'TR' },
    '7': { country: 'Russia', code: 'RU' },
    '39': { country: 'Italy', code: 'IT' },
    '34': { country: 'Spain', code: 'ES' },
    '31': { country: 'Netherlands', code: 'NL' },
    '46': { country: 'Sweden', code: 'SE' },
    '47': { country: 'Norway', code: 'NO' },
    '45': { country: 'Denmark', code: 'DK' },
    '41': { country: 'Switzerland', code: 'CH' },
    '43': { country: 'Austria', code: 'AT' },
    '32': { country: 'Belgium', code: 'BE' },
    '351': { country: 'Portugal', code: 'PT' },
    '30': { country: 'Greece', code: 'GR' },
    '48': { country: 'Poland', code: 'PL' },
    '420': { country: 'Czech Republic', code: 'CZ' },
    '36': { country: 'Hungary', code: 'HU' },
    '40': { country: 'Romania', code: 'RO' },
    '359': { country: 'Bulgaria', code: 'BG' },
    '385': { country: 'Croatia', code: 'HR' },
    '386': { country: 'Slovenia', code: 'SI' },
    '421': { country: 'Slovakia', code: 'SK' },
    '372': { country: 'Estonia', code: 'EE' },
    '371': { country: 'Latvia', code: 'LV' },
    '370': { country: 'Lithuania', code: 'LT' }
  };

  // Try to match country codes (longest first)
  const sortedCodes = Object.keys(countryCodes).sort((a, b) => b.length - a.length);
  
  for (const code of sortedCodes) {
    if (digits.startsWith(code)) {
      const countryInfo = countryCodes[code];
      return {
        country: countryInfo.country,
        countryCode: countryInfo.code,
        method: 'phone',
        accuracy: 'high'
      };
    }
  }
  
  return null;
};

/**
 * Comprehensive location detection
 * Tries multiple methods in order of reliability
 */
export const detectUserLocation = async (): Promise<LocationData | null> => {
  console.log('🌍 Starting comprehensive location detection...');
  
  // Method 1: IP Geolocation (most reliable, no permission needed)
  try {
    const ipLocation = await detectLocationByIP();
    if (ipLocation) {
      return ipLocation;
    }
  } catch (error) {
    console.warn('IP geolocation failed:', error);
  }
  
  // Method 2: GPS (more accurate but requires permission)
  try {
    const gpsLocation = await detectLocationByGPS();
    if (gpsLocation) {
      return gpsLocation;
    }
  } catch (error) {
    console.warn('GPS location failed:', error);
  }
  
  console.warn('❌ All location detection methods failed');
  return null;
};

/**
 * Get country flag emoji from country code
 */
export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

/**
 * Format location data for display
 */
export const formatLocationDisplay = (location: LocationData): string => {
  const flag = getCountryFlag(location.countryCode);
  let display = `${flag} ${location.country}`;
  
  if (location.region && location.city) {
    display += `, ${location.city}, ${location.region}`;
  } else if (location.city) {
    display += `, ${location.city}`;
  } else if (location.region) {
    display += `, ${location.region}`;
  }
  
  return display;
};
