
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md',
  showLabel = false 
}) => {
  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-10 w-10';
    }
  };

  // Light mode only - just show the sun icon
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${getButtonSize()} p-0`}
      disabled
    >
      <Sun className="h-4 w-4" />
      {showLabel && (
        <span className="ml-2">Light</span>
      )}
    </Button>
  );
};

export default ThemeToggle;
