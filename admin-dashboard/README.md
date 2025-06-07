# Onboard Web3 Academy - Admin Dashboard

This is the admin dashboard for the Onboard Web3 Academy platform. It provides comprehensive tools for managing bookings, analyzing user data, and monitoring platform performance.

## Features

- 📊 **Analytics Dashboard** - View key metrics and performance indicators
- 📅 **Booking Management** - Approve, manage, and track session bookings
- 👥 **User Analytics** - Monitor user demographics and behavior
- ⚙️ **Session Control** - Create and manage available session slots
- 🔐 **Secure Admin Access** - Protected with authentication and admin verification

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the Supabase database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) in your browser

### Admin Access

To access the admin dashboard, you need:

1. A user account in the main platform
2. Admin privileges granted in the `admin_users` table

Contact the platform administrator to get admin access.

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── hooks/          # Custom hooks for data fetching
│   ├── lib/            # Utility functions and Supabase client
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Key Components

- **Dashboard** - Main analytics and overview page
- **Login** - Admin authentication page
- **AuthContext** - Manages authentication state
- **AdminAuthGuard** - Protects admin routes

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `dist`
4. Deploy!

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Deploy!

## Environment Variables

The admin dashboard uses the same Supabase instance as the main platform. The connection details are configured in `src/lib/supabase.ts`.

## Security

- All admin routes are protected with authentication
- Admin access is verified through the `admin_users` table
- Row Level Security (RLS) policies ensure data isolation
- All API calls use secure Supabase client

## Support

For technical support or questions about the admin dashboard, please contact the development team.

## License

This project is part of the Onboard Web3 Academy platform.
