import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Monitor, 
  CheckCircle, 
  AlertTriangle,
  Info
} from "lucide-react";
import PWALayout from "./PWALayout";
import PWAContentWrapper from "./PWAContentWrapper";
import MobileHeader from "./MobileHeader";
import BottomNavigation from "./BottomNavigation";

/**
 * PWALayoutTest component for testing and demonstrating PWA safe area handling
 * This component helps developers verify that safe areas are working correctly
 */
const PWALayoutTest = () => {
  const [layoutMode, setLayoutMode] = useState<'full' | 'header-only' | 'nav-only' | 'none'>('full');

  const layoutModes = [
    { key: 'full', label: 'Header + Bottom Nav', hasHeader: true, hasBottomNav: true },
    { key: 'header-only', label: 'Header Only', hasHeader: true, hasBottomNav: false },
    { key: 'nav-only', label: 'Bottom Nav Only', hasHeader: false, hasBottomNav: true },
    { key: 'none', label: 'No Fixed Elements', hasHeader: false, hasBottomNav: false },
  ];

  const currentMode = layoutModes.find(mode => mode.key === layoutMode);

  const testItems = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Test Item ${i + 1}`,
    description: `This is test content item ${i + 1} to verify scrolling and safe area behavior.`
  }));

  return (
    <PWALayout 
      hasHeader={currentMode?.hasHeader || false} 
      hasBottomNav={currentMode?.hasBottomNav || false}
      className="bg-slate-50"
    >
      {/* Conditional Header */}
      {currentMode?.hasHeader && (
        <MobileHeader 
          title="PWA Layout Test" 
          showBackButton={false}
          showMenu={false}
        />
      )}

      <PWAContentWrapper padding="md">
        {/* Layout Mode Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Layout Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {layoutModes.map((mode) => (
                <Button
                  key={mode.key}
                  variant={layoutMode === mode.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayoutMode(mode.key as any)}
                  className="text-xs"
                >
                  {mode.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* PWA Status Indicators */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>PWA Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Standalone Mode</span>
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Detected via CSS
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Safe Area Support</span>
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Viewport Fit</span>
              <Badge variant="outline" className="text-xs">
                <Info className="h-3 w-3 mr-1" />
                Cover
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Safe Area Visualization */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Safe Area Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Top Safe Area:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                  env(safe-area-inset-top)
                </code>
              </div>
              <div className="flex justify-between">
                <span>Bottom Safe Area:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                  env(safe-area-inset-bottom)
                </code>
              </div>
              <div className="flex justify-between">
                <span>Left Safe Area:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                  env(safe-area-inset-left)
                </code>
              </div>
              <div className="flex justify-between">
                <span>Right Safe Area:</span>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                  env(safe-area-inset-right)
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scrollable Test Content */}
        <Card>
          <CardHeader>
            <CardTitle>Scrollable Content Test</CardTitle>
            <p className="text-sm text-slate-600">
              Scroll through this content to verify that it doesn't get hidden behind fixed elements.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {testItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 bg-slate-50 rounded-lg border"
              >
                <h4 className="font-medium text-slate-900">{item.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{item.description}</p>
              </div>
            ))}
            
            {/* Bottom marker */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-emerald-700 font-medium">
                End of Content
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                If you can see this clearly, safe areas are working correctly!
              </p>
            </div>
          </CardContent>
        </Card>
      </PWAContentWrapper>

      {/* Conditional Bottom Navigation */}
      {currentMode?.hasBottomNav && <BottomNavigation />}
    </PWALayout>
  );
};

export default PWALayoutTest;
