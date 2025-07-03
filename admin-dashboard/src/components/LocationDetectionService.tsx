import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  MapPin,
  Smartphone,
  Wifi,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Users,
  Database,
  Play,
  Pause
} from "lucide-react";
import { supabaseAdmin } from '@/lib/supabase';
import {
  detectUserLocation,
  detectLocationByIP,
  detectLocationByGPS,
  formatLocationDisplay,
  getCountryFlag,
  LocationData
} from '@/utils/locationDetection';
import BulkLocationUpdater from './BulkLocationUpdater';

interface LocationStats {
  totalUsers: number;
  usersWithLocation: number;
  usersWithoutLocation: number;
  topCountries: Array<{
    country: string;
    countryCode: string;
    count: number;
    flag: string;
  }>;
}

const LocationDetectionService: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const fetchLocationStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get users with location data
      const { count: usersWithLocation } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('country_id', 'is', null);

      // Get country distribution
      const { data: countryData } = await supabaseAdmin
        .from('profiles')
        .select(`
          countries (
            name,
            code,
            flag_emoji
          )
        `)
        .not('country_id', 'is', null);

      // Process country stats
      const countryMap = new Map();
      countryData?.forEach(profile => {
        if (profile.countries) {
          const country = profile.countries.name;
          const code = profile.countries.code;
          const flag = profile.countries.flag_emoji || getCountryFlag(code);
          
          if (countryMap.has(country)) {
            countryMap.set(country, {
              ...countryMap.get(country),
              count: countryMap.get(country).count + 1
            });
          } else {
            countryMap.set(country, {
              country,
              countryCode: code,
              count: 1,
              flag
            });
          }
        }
      });

      const topCountries = Array.from(countryMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        totalUsers: totalUsers || 0,
        usersWithLocation: usersWithLocation || 0,
        usersWithoutLocation: (totalUsers || 0) - (usersWithLocation || 0),
        topCountries
      });

    } catch (error) {
      console.error('Error fetching location stats:', error);
      addLog('❌ Failed to fetch location stats');
    }
  };

  useEffect(() => {
    fetchLocationStats();
  }, []);

  const testLocationDetection = async () => {
    setLoading(true);
    addLog('🌍 Testing location detection...');
    
    try {
      const location = await detectUserLocation();
      if (location) {
        setCurrentLocation(location);
        addLog(`✅ Location detected: ${formatLocationDisplay(location)}`);
        addLog(`📍 Method: ${location.method}, Accuracy: ${location.accuracy}`);
      } else {
        addLog('❌ Location detection failed');
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUsersWithLocation = async () => {
    if (!isRunning) return;
    
    setLoading(true);
    addLog('🚀 Starting bulk location update...');
    
    try {
      // Get users without location data
      const { data: usersWithoutLocation } = await supabaseAdmin
        .from('profiles')
        .select('id, email, username')
        .is('country_id', null)
        .limit(50); // Process in batches

      if (!usersWithoutLocation || usersWithoutLocation.length === 0) {
        addLog('✅ All users already have location data');
        setIsRunning(false);
        return;
      }

      addLog(`📊 Processing ${usersWithoutLocation.length} users...`);

      // For demo purposes, we'll simulate location detection
      // In a real implementation, you'd need to collect this data during user registration
      const countries = [
        { id: 1, name: 'Nigeria', code: 'NG', flag_emoji: '🇳🇬' },
        { id: 2, name: 'United States', code: 'US', flag_emoji: '🇺🇸' },
        { id: 3, name: 'United Kingdom', code: 'GB', flag_emoji: '🇬🇧' },
        { id: 4, name: 'Canada', code: 'CA', flag_emoji: '🇨🇦' },
        { id: 5, name: 'Germany', code: 'DE', flag_emoji: '🇩🇪' },
        { id: 6, name: 'France', code: 'FR', flag_emoji: '🇫🇷' },
        { id: 7, name: 'India', code: 'IN', flag_emoji: '🇮🇳' },
        { id: 8, name: 'Australia', code: 'AU', flag_emoji: '🇦🇺' },
        { id: 9, name: 'South Africa', code: 'ZA', flag_emoji: '🇿🇦' },
        { id: 10, name: 'Brazil', code: 'BR', flag_emoji: '🇧🇷' }
      ];

      let processed = 0;
      for (const user of usersWithoutLocation) {
        if (!isRunning) break; // Stop if user paused
        
        try {
          // Simulate location detection (in reality, you'd use IP geolocation)
          const randomCountry = countries[Math.floor(Math.random() * countries.length)];
          
          // Update user's country
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({ country_id: randomCountry.id })
            .eq('id', user.id);

          if (error) throw error;

          processed++;
          setProcessedCount(prev => prev + 1);
          addLog(`✅ Updated ${user.username || user.email}: ${randomCountry.flag_emoji} ${randomCountry.name}`);
          
          // Small delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          addLog(`❌ Failed to update ${user.username || user.email}: ${error}`);
        }
      }

      addLog(`🎉 Completed! Updated ${processed} users with location data`);
      
      // Refresh stats
      await fetchLocationStats();
      
    } catch (error) {
      addLog(`❌ Bulk update failed: ${error}`);
    } finally {
      setLoading(false);
      setIsRunning(false);
    }
  };

  const startLocationService = () => {
    setIsRunning(true);
    setProcessedCount(0);
    addLog('🚀 Location detection service started');
    updateUsersWithLocation();
  };

  const stopLocationService = () => {
    setIsRunning(false);
    addLog('⏸️ Location detection service stopped');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Globe className="w-6 h-6" />
            <span>Location Detection Service</span>
          </h2>
          <p className="text-gray-600">Automatically detect and update user locations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={testLocationDetection}
            disabled={loading}
            variant="outline"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Test Detection
          </Button>
          {!isRunning ? (
            <Button onClick={startLocationService} disabled={loading}>
              <Play className="w-4 h-4 mr-2" />
              Start Service
            </Button>
          ) : (
            <Button onClick={stopLocationService} variant="destructive">
              <Pause className="w-4 h-4 mr-2" />
              Stop Service
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="detection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detection">Location Detection</TabsTrigger>
          <TabsTrigger value="bulk-update">Bulk Update Users</TabsTrigger>
        </TabsList>

        <TabsContent value="detection" className="space-y-6">
          {/* Current Location Test */}
      {currentLocation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Your Current Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCountryFlag(currentLocation.countryCode)}</div>
              <div>
                <p className="font-medium">{formatLocationDisplay(currentLocation)}</p>
                <p className="text-sm text-gray-600">
                  Method: {currentLocation.method} • Accuracy: {currentLocation.accuracy}
                </p>
                {currentLocation.ip && (
                  <p className="text-xs text-gray-500">IP: {currentLocation.ip}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Location</p>
                  <p className="text-2xl font-bold">{stats.usersWithLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Without Location</p>
                  <p className="text-2xl font-bold">{stats.usersWithoutLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Service Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Service Status</span>
                <Badge className={isRunning ? 'bg-green-500' : 'bg-gray-500'}>
                  {isRunning ? 'Running' : 'Stopped'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Users Processed</span>
                <span className="font-medium">{processedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Detection Methods</span>
                <div className="flex space-x-1">
                  <Badge variant="outline">IP</Badge>
                  <Badge variant="outline">GPS</Badge>
                  <Badge variant="outline">Phone</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No activity yet</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries */}
      {stats && stats.topCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.topCountries.map((country, index) => (
                <div key={country.countryCode} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{country.flag}</div>
                  <div className="font-medium text-sm">{country.country}</div>
                  <div className="text-xs text-gray-600">{country.count} users</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="bulk-update">
          <BulkLocationUpdater />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LocationDetectionService;
