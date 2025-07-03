import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';

const TestPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds for testing
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-lg">Test Notification</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPopup(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              🎉 Notification System Working!
            </h3>
            <p className="text-gray-600 mb-4">
              The popup system is working correctly. We can now implement:
            </p>
            
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>✅ Course reminder notifications</li>
              <li>✅ Social media follow enforcement</li>
              <li>✅ Country selection system</li>
              <li>✅ Push notifications</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => setShowPopup(false)} className="flex-1">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPopup;
