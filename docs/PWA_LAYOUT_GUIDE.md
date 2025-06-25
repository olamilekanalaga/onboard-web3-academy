# PWA Layout Guide

This guide explains how to properly handle safe areas and layout in our Progressive Web App (PWA) to ensure content is not hidden behind system UI elements like status bars and home indicators.

## Overview

When users install our app as a PWA and use it in standalone mode, the app takes up the full screen. This means we need to account for:

- **Top safe area**: Status bar, notch, or dynamic island on mobile devices
- **Bottom safe area**: Home indicator on iOS and gesture navigation areas on Android
- **Side safe areas**: Curved edges or camera cutouts on some devices

## CSS Classes Available

### Basic Safe Area Classes

```css
.pt-safe    /* Top padding with safe area */
.pb-safe    /* Bottom padding with safe area */
.pl-safe    /* Left padding with safe area */
.pr-safe    /* Right padding with safe area */
```

### Layout-Specific Classes

```css
.mobile-header-safe     /* For fixed headers */
.content-safe-top       /* Content with fixed header */
.content-safe-bottom    /* Content with bottom navigation */
.content-safe-full      /* Content with both header and bottom nav */
.bottom-nav-safe        /* For bottom navigation bars */
```

### PWA-Specific Classes

```css
.pwa-content-safe       /* Enhanced spacing for PWA standalone mode */
.pwa-header-safe        /* Enhanced header spacing for PWA */
.scrollable-content     /* Proper scrolling behavior */
```

### Utility Classes

```css
.min-h-screen-safe      /* Full height minus safe areas */
.h-screen-safe          /* Exact height minus safe areas */
```

## Components

### PWALayout Component

Use this component as a wrapper for mobile pages:

```tsx
import PWALayout from '@/components/mobile/PWALayout';

const MyMobilePage = () => {
  return (
    <PWALayout 
      hasHeader={true}        // Does page have fixed header?
      hasBottomNav={true}     // Does page have bottom navigation?
      scrollable={true}       // Should content be scrollable?
      className="bg-slate-50" // Additional classes
    >
      {/* Your page content */}
    </PWALayout>
  );
};
```

### PWAContentWrapper Component

Use this for content areas that need proper spacing and scrolling:

```tsx
import PWAContentWrapper from '@/components/mobile/PWAContentWrapper';

const ContentArea = () => {
  return (
    <PWAContentWrapper 
      padding="md"           // 'none' | 'sm' | 'md' | 'lg'
      scrollable={true}      // Enable scrolling
      className="custom-class"
    >
      {/* Your content */}
    </PWAContentWrapper>
  );
};
```

## Usage Examples

### Page with Header and Bottom Navigation

```tsx
const MobilePage = () => {
  return (
    <PWALayout hasHeader={true} hasBottomNav={true}>
      <MobileHeader title="Page Title" />
      
      <PWAContentWrapper padding="md">
        {/* Page content automatically has proper spacing */}
      </PWAContentWrapper>
      
      <BottomNavigation />
    </PWALayout>
  );
};
```

### Page with Only Header

```tsx
const MobilePage = () => {
  return (
    <PWALayout hasHeader={true} hasBottomNav={false}>
      <MobileHeader title="Page Title" />
      
      <PWAContentWrapper>
        {/* Content with top spacing only */}
      </PWAContentWrapper>
    </PWALayout>
  );
};
```

### Full Screen Page (No Fixed Elements)

```tsx
const MobilePage = () => {
  return (
    <PWALayout hasHeader={false} hasBottomNav={false}>
      <PWAContentWrapper>
        {/* Content with all-around safe area spacing */}
      </PWAContentWrapper>
    </PWALayout>
  );
};
```

## Manual CSS Application

If you need to apply safe areas manually:

```tsx
// Header component
<header className="fixed top-0 left-0 right-0 mobile-header-safe pwa-header-safe">
  {/* Header content */}
</header>

// Main content
<main className="content-safe-full pwa-content-safe">
  {/* Page content */}
</main>

// Bottom navigation
<nav className="fixed bottom-0 left-0 right-0 bottom-nav-safe">
  {/* Navigation items */}
</nav>
```

## Testing

To test PWA safe areas:

1. **Chrome DevTools**: Use device emulation with devices that have notches
2. **iOS Safari**: Add to home screen and test in standalone mode
3. **Android Chrome**: Install PWA and test with gesture navigation enabled

## Browser Support

- **Modern browsers**: Full support with `env(safe-area-inset-*)` 
- **Fallback browsers**: Automatic fallback to fixed padding values
- **PWA detection**: Enhanced spacing when `display-mode: standalone`

## Best Practices

1. Always use `PWALayout` for mobile pages
2. Test on actual devices with notches/home indicators
3. Ensure scrollable content uses `scrollable-content` class
4. Don't mix manual safe area classes with layout components
5. Consider different orientations (portrait/landscape)
