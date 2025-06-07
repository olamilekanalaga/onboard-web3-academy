import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Database, Users, Shield } from "lucide-react";
import { supabase } from '@/lib/supabase';

const TestConnection = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>({});

  const runTests = async () => {
    setTesting(true);
    const testResults: any = {};

    try {
      // Test 1: Basic Supabase connection
      console.log('Testing Supabase connection...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      testResults.connection = !authError;
      testResults.connectionError = authError?.message;

      // Test 2: Countries table
      console.log('Testing countries table...');
      const { data: countries, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .limit(5);
      testResults.countries = !countriesError && countries && countries.length > 0;
      testResults.countriesError = countriesError?.message;
      testResults.countriesCount = countries?.length || 0;

      // Test 3: Session types table
      console.log('Testing session_types table...');
      const { data: sessionTypes, error: sessionTypesError } = await supabase
        .from('session_types')
        .select('*')
        .limit(5);
      testResults.sessionTypes = !sessionTypesError && sessionTypes && sessionTypes.length > 0;
      testResults.sessionTypesError = sessionTypesError?.message;
      testResults.sessionTypesCount = sessionTypes?.length || 0;

      // Test 4: Admin users table
      console.log('Testing admin_users table...');
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .limit(5);
      testResults.adminUsers = !adminError;
      testResults.adminUsersError = adminError?.message;
      testResults.adminUsersCount = adminUsers?.length || 0;

      // Test 5: Profiles table
      console.log('Testing profiles table...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      testResults.profiles = !profilesError;
      testResults.profilesError = profilesError?.message;
      testResults.profilesCount = profiles?.length || 0;

      // Test 6: Analytics functions
      console.log('Testing analytics functions...');
      try {
        const { data: countryStats, error: countryStatsError } = await supabase.rpc('get_user_country_stats');
        testResults.countryStats = !countryStatsError;
        testResults.countryStatsError = countryStatsError?.message;
      } catch (err: any) {
        testResults.countryStats = false;
        testResults.countryStatsError = err.message;
      }

      try {
        const { data: bookingStats, error: bookingStatsError } = await supabase.rpc('get_booking_stats');
        testResults.bookingStats = !bookingStatsError;
        testResults.bookingStatsError = bookingStatsError?.message;
      } catch (err: any) {
        testResults.bookingStats = false;
        testResults.bookingStatsError = err.message;
      }

    } catch (error: any) {
      console.error('Test error:', error);
      testResults.generalError = error.message;
    }

    setResults(testResults);
    setTesting(false);
  };

  const TestResult = ({ name, success, error, count }: any) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center space-x-3">
        {success ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <div>
          <p className="font-medium text-slate-900">{name}</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          {count !== undefined && <p className="text-xs text-slate-600">{count} records found</p>}
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-xs font-medium ${
        success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {success ? 'PASS' : 'FAIL'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Database Connection Test</h1>
          <p className="text-xl text-slate-600">
            Test the connection between admin dashboard and Supabase database
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Connection Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="mb-6 bg-blue-600 hover:bg-blue-700"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Run Connection Tests
                </>
              )}
            </Button>

            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                <TestResult 
                  name="Supabase Connection" 
                  success={results.connection} 
                  error={results.connectionError}
                />
                
                <TestResult 
                  name="Countries Table" 
                  success={results.countries} 
                  error={results.countriesError}
                  count={results.countriesCount}
                />
                
                <TestResult 
                  name="Session Types Table" 
                  success={results.sessionTypes} 
                  error={results.sessionTypesError}
                  count={results.sessionTypesCount}
                />
                
                <TestResult 
                  name="Admin Users Table" 
                  success={results.adminUsers} 
                  error={results.adminUsersError}
                  count={results.adminUsersCount}
                />
                
                <TestResult 
                  name="Profiles Table" 
                  success={results.profiles} 
                  error={results.profilesError}
                  count={results.profilesCount}
                />
                
                <TestResult 
                  name="Country Stats Function" 
                  success={results.countryStats} 
                  error={results.countryStatsError}
                />
                
                <TestResult 
                  name="Booking Stats Function" 
                  success={results.bookingStats} 
                  error={results.bookingStatsError}
                />

                {results.generalError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">General Error:</p>
                    <p className="text-red-600 text-sm">{results.generalError}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Setup Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">1. Run Database Schema</h4>
                <p className="text-blue-800">
                  Execute the SQL schema in your Supabase dashboard to create all required tables and functions.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">2. Create Admin User</h4>
                <p className="text-green-800">
                  Add your user ID to the admin_users table to get admin access to the dashboard.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">3. Test Connection</h4>
                <p className="text-purple-800">
                  Run the tests above to verify everything is working correctly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestConnection;
