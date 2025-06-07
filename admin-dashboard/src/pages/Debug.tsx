import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, User, Shield, Database, AlertTriangle } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Debug = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const runDebugTests = async () => {
    setLoading(true);
    const debugResults: any = {};

    try {
      // Test 1: Check current auth state
      debugResults.currentUser = user;
      debugResults.isCurrentlyAdmin = isAdmin;

      // Test 2: Check if admin_users table exists
      const { data: adminTableCheck, error: adminTableError } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);
      
      debugResults.adminTableExists = !adminTableError;
      debugResults.adminTableError = adminTableError?.message;

      // Test 3: Get all users
      const { data: allUsers, error: usersError } = await supabase.auth.admin.listUsers();
      debugResults.allUsersCount = allUsers?.users?.length || 0;
      debugResults.usersError = usersError?.message;

      // Test 4: Get all admin users
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from('admin_users')
        .select(`
          *,
          profiles!inner(email)
        `);
      
      debugResults.adminUsers = adminUsers || [];
      debugResults.adminUsersError = adminUsersError?.message;

      // Test 5: If email provided, check specific user
      if (email) {
        // Find user by email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        debugResults.specificUser = userData;
        debugResults.specificUserError = userError?.message;

        if (userData) {
          // Check if this user is admin
          const { data: adminCheck, error: adminCheckError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', userData.id)
            .single();

          debugResults.specificUserIsAdmin = !!adminCheck;
          debugResults.specificUserAdminError = adminCheckError?.message;
        }
      }

    } catch (error: any) {
      debugResults.generalError = error.message;
    }

    setResults(debugResults);
    setLoading(false);
  };

  const createAdminUser = async () => {
    if (!email) {
      alert('Please enter an email address first');
      return;
    }

    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        alert('User not found with that email');
        return;
      }

      // Add to admin_users
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          user_id: userData.id,
          role: 'admin',
          is_active: true
        });

      if (adminError) {
        alert('Error creating admin user: ' + adminError.message);
      } else {
        alert('Admin user created successfully!');
        runDebugTests(); // Refresh results
      }

    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const StatusIcon = ({ success }: { success: boolean }) => (
    success ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Debug Panel</h1>
          <p className="text-xl text-slate-600">
            Debug authentication and admin access issues
          </p>
        </div>

        {/* Current Auth Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Current Authentication Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-600">Logged In</p>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusIcon success={!!user} />
                  <span className="text-slate-900">{user ? user.email : 'Not logged in'}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-600">Admin Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusIcon success={isAdmin} />
                  <span className="text-slate-900">{isAdmin ? 'Admin' : 'Not Admin'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Tools */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-600" />
              <span>Debug Tools</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email to Check/Make Admin
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1"
                  />
                  <Button onClick={runDebugTests} disabled={loading}>
                    {loading ? 'Checking...' : 'Debug Check'}
                  </Button>
                  <Button onClick={createAdminUser} variant="outline">
                    Make Admin
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Results */}
        {Object.keys(results).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span>Debug Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 mb-2">Admin Table Status</p>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={results.adminTableExists} />
                      <span className="text-sm">
                        {results.adminTableExists ? 'Table exists' : 'Table missing'}
                      </span>
                    </div>
                    {results.adminTableError && (
                      <p className="text-xs text-red-600 mt-1">{results.adminTableError}</p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 mb-2">Total Users</p>
                    <p className="text-lg font-bold text-slate-900">{results.allUsersCount}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-600 mb-2">Admin Users</p>
                    <p className="text-lg font-bold text-slate-900">{results.adminUsers?.length || 0}</p>
                  </div>

                  {email && results.specificUser && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm font-medium text-slate-600 mb-2">User Admin Status</p>
                      <div className="flex items-center space-x-2">
                        <StatusIcon success={results.specificUserIsAdmin} />
                        <span className="text-sm">
                          {results.specificUserIsAdmin ? 'Is Admin' : 'Not Admin'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {results.adminUsers && results.adminUsers.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Current Admin Users:</h4>
                    <div className="space-y-2">
                      {results.adminUsers.map((admin: any, index: number) => (
                        <div key={index} className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="text-sm">
                            <strong>User ID:</strong> {admin.user_id}
                          </p>
                          <p className="text-sm">
                            <strong>Role:</strong> {admin.role}
                          </p>
                          <p className="text-sm">
                            <strong>Active:</strong> {admin.is_active ? 'Yes' : 'No'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.generalError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Error</span>
                    </div>
                    <p className="text-red-700 text-sm">{results.generalError}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Debug;
