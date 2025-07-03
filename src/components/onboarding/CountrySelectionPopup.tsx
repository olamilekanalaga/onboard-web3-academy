import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  MapPin,
  Globe,
  CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Country {
  id: string;
  code: string;
  name: string;
  flag_emoji: string;
}

const CountrySelectionPopup: React.FC = () => {
  const { user } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    if (user) {
      checkCountryStatus();
      loadCountries().then(() => {
        // Detect location after countries are loaded
        detectUserLocation();
      });
    }
  }, [user]);

  // Listen for force country selection event
  useEffect(() => {
    const handleForceCountrySelection = () => {
      setShowPopup(true);
    };

    window.addEventListener('forceCountrySelection', handleForceCountrySelection);

    return () => {
      window.removeEventListener('forceCountrySelection', handleForceCountrySelection);
    };
  }, []);

  // Check country status on mount
  useEffect(() => {
    if (user && !showPopup) {
      checkCountryStatus();
    }
  }, [user]);

  useEffect(() => {
    // Filter countries based on search term
    if (searchTerm) {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchTerm, countries]);

  const checkCountryStatus = async () => {
    if (!user) return;

    try {
      // Check if user has already selected a country
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('country_code, country_name')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile query error:', profileError);
      }

      // Check onboarding status
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('user_onboarding_status')
        .select('country_selected')
        .eq('user_id', user.id)
        .maybeSingle();

      if (onboardingError) {
        console.error('Onboarding query error:', onboardingError);
      }

      // Show popup if country not selected - FORCE ALL USERS
      const hasCountry = profileData?.country_code;

      // Force popup for ALL users without country (ignore onboarding status)
      if (!hasCountry) {
        setShowPopup(true);
        console.log('Forcing country selection - no country set for user');
      }

    } catch (error) {
      console.error('Error checking country status:', error);
      throw error; // Don't hide database errors
    }
  };

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) {
        console.error('Countries query error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No countries found in database');
      }

      setCountries(data);
      setFilteredCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      throw error; // Don't hide database errors
    }
  };

  const detectUserLocation = async () => {
    if (countries.length === 0) {
      console.log('Countries not loaded yet, skipping detection');
      return;
    }

    try {
      // Try to detect user's location using IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      console.log('Detected location data:', data);

      if (data.country_code) {
        // Find the country in our list
        const country = countries.find(c =>
          c.code.toLowerCase() === data.country_code.toLowerCase()
        );

        console.log('Found country in list:', country);

        if (country) {
          setDetectedCountry(country);
          setSelectedCountry(country);
          console.log('Set detected and selected country:', country);
        } else {
          console.log('Country not found in list:', data.country_code);
        }

        // Log location for analytics
        try {
          await supabase
            .from('user_location_history')
            .insert({
              user_id: user?.id,
              country_code: data.country_code,
              country_name: data.country_name,
              region: data.region,
              city: data.city,
              ip_address: data.ip,
              detection_method: 'ip_geolocation'
            });
          console.log('Location logged to database');
        } catch (logError) {
          console.error('Error logging location:', logError);
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleConfirm = async () => {
    console.log('handleConfirm called with selectedCountry:', selectedCountry);

    if (!selectedCountry || !user) {
      console.log('Missing selectedCountry or user:', { selectedCountry, user: !!user });
      return;
    }

    setLoading(true);
    try {
      console.log('Saving country to database:', selectedCountry);

      // Update user profile with selected country
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          country_code: selectedCountry.code,
          country_name: selectedCountry.name,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Update onboarding status - try update first, then insert
      const { error: updateError } = await supabase
        .from('user_onboarding_status')
        .update({ country_selected: true })
        .eq('user_id', user.id);

      if (updateError && updateError.code === 'PGRST116') {
        // No rows updated, try insert
        const { error: insertError } = await supabase
          .from('user_onboarding_status')
          .insert({
            user_id: user.id,
            country_selected: true
          });

        if (insertError) {
          console.error('Onboarding insert error:', insertError);
          // Don't throw error, country selection is more important
        }
      } else if (updateError) {
        console.error('Onboarding update error:', updateError);
        // Don't throw error, country selection is more important
      }

      // Log the manual selection
      const { error: historyError } = await supabase
        .from('user_location_history')
        .insert({
          user_id: user.id,
          country_code: selectedCountry.code,
          country_name: selectedCountry.name,
          detection_method: 'manual_selection'
        });

      if (historyError) {
        console.error('History insert error:', historyError);
        // Don't throw here, it's not critical
      }

      console.log('Country saved successfully!');
      setShowPopup(false);
    } catch (error) {
      console.error('Error saving country selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Mark as completed even if skipped - try update first, then insert
      const { error: updateError } = await supabase
        .from('user_onboarding_status')
        .update({ country_selected: true })
        .eq('user_id', user?.id);

      if (updateError && updateError.code === 'PGRST116') {
        // No rows updated, try insert
        const { error: insertError } = await supabase
          .from('user_onboarding_status')
          .insert({
            user_id: user?.id,
            country_selected: true
          });

        if (insertError) {
          console.error('Error inserting onboarding status:', insertError);
        }
      } else if (updateError) {
        console.error('Error updating onboarding status:', updateError);
      }

      setShowPopup(false);
    } catch (error) {
      console.error('Error skipping country selection:', error);
      setShowPopup(false); // Hide popup anyway
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-lg">Select Your Country (Required)</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4 max-h-[calc(90vh-120px)]">
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">
              Help us provide better analytics and localized content by selecting your country.
            </p>
          </div>

          {detectedCountry && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Detected Location
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg">{detectedCountry.flag_emoji}</span>
                <span className="text-sm text-blue-700">{detectedCountry.name}</span>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Country List */}
          <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto border rounded-lg">
            {filteredCountries.map((country) => (
              <button
                key={country.id}
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                  selectedCountry?.code === country.code ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{country.flag_emoji}</span>
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-xs text-gray-500">({country.code})</span>
                </div>
                
                {selectedCountry?.code === country.code && (
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Selected Country Display */}
          {selectedCountry && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Selected</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-lg">{selectedCountry.flag_emoji}</span>
                <span className="text-sm text-green-700">{selectedCountry.name}</span>
              </div>
            </div>
          )}

        </CardContent>

        {/* Action Buttons - Fixed at bottom */}
        <div className="border-t p-4 space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
            <p className="text-sm text-orange-800 font-medium">
              🌍 Country selection is required for analytics and localized content
            </p>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!selectedCountry || loading}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Confirm Selection'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            This helps us provide better analytics and localized content for your region.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CountrySelectionPopup;
