import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'dropdown';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { currentLanguage, languages, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (languageCode: string) => {
    console.log('🔄 Language selector: Changing language to', languageCode);
    setLanguage(languageCode);
    setIsOpen(false);

    // Force a re-render to see if translations update
    setTimeout(() => {
      console.log('🔄 Current language after change:', currentLanguage);
      console.log('🔄 Test translation:', t('nav.courses'));
    }, 100);
  };

  if (variant === 'dropdown') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentLang?.flag_emoji || '🇺🇸'}</span>
              <span className="text-sm">{currentLang?.native_name || 'English'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{language.flag_emoji}</span>
                <span className="text-sm">{language.native_name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4 text-emerald-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">{t('profile.language')}</span>
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div className="space-y-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center justify-between p-2 rounded text-sm transition-colors ${
                currentLanguage === language.code
                  ? 'bg-emerald-500 text-white'
                  : 'text-white hover:bg-emerald-500 hover:bg-opacity-20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{language.flag_emoji}</span>
                <span>{language.native_name}</span>
              </div>
              {currentLanguage === language.code && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:text-emerald-100 hover:bg-emerald-500 px-3 py-2"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {currentLang?.flag_emoji} {currentLang?.native_name || 'English'}
          </span>
          <span className="sm:hidden">
            {currentLang?.flag_emoji || '🇺🇸'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b">
          {t('profile.language')}
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{language.flag_emoji}</span>
              <div>
                <div className="font-medium">{language.native_name}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check className="w-4 h-4 text-emerald-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
