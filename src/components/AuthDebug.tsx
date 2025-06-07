import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, LogIn, UserCheck } from "lucide-react";

const AuthDebug = () => {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5" />
          <span>Auth Debug Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-2">Current Status:</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-green-600">
                <User className="w-4 h-4" />
                <span className="font-medium">Logged In</span>
              </div>
              <p className="text-sm text-slate-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-slate-600">
                <strong>User ID:</strong> {user.id}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Not Logged In</span>
            </div>
          )}
        </div>

        {user ? (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              To test the sign-in functionality, you need to sign out first:
            </p>
            <Button 
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <p className="text-xs text-slate-500">
              After signing out, go to <code>/auth</code> to test sign-in
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              You're not logged in. You can now test the sign-in functionality:
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Go to Sign In
            </Button>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">How to Test Sign In:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Sign out (if logged in)</li>
            <li>2. Go to <code>/auth</code></li>
            <li>3. Click "Sign In" tab</li>
            <li>4. Enter your credentials</li>
            <li>5. Click "Sign In" button</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebug;
