import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MobileHeader from './MobileHeader';
import BottomNavigation from './BottomNavigation';
import PWALayout from './PWALayout';
import PWAContentWrapper from './PWAContentWrapper';
import Social from '@/pages/Social'; // Use the real social component

const MobileSocial = () => {
  return (
    <PWALayout hasHeader={true} hasBottomNav={true} className="bg-slate-50">
      <MobileHeader title="Social" />

      <PWAContentWrapper padding="none">
        {/* Use the real Social component from web */}
        <Social />
      </PWAContentWrapper>

      <BottomNavigation />
    </PWALayout>
  );
};

export default MobileSocial;
