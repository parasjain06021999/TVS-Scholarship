# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the frontend root directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://tvs-scholarship.onrender.com

# Development API URL (uncomment for local development)
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Environment Files

- `.env.local` - Local development environment (not committed to git)
- `.env.example` - Example environment file (committed to git)

## Usage

The application uses the `NEXT_PUBLIC_API_BASE_URL` environment variable to configure the API base URL. This allows you to:

1. **Production**: Use the deployed backend URL
2. **Development**: Use local backend URL
3. **Testing**: Use test backend URL

## Configuration

The API configuration is centralized in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://tvs-scholarship.onrender.com',
  ENDPOINTS: {
    AUTH: '/auth',
    APPLICATIONS: '/applications',
    SCHOLARSHIPS: '/scholarships',
    DOCUMENTS: '/documents',
    PAYMENTS: '/payments',
    USERS: '/users',
    FEEDBACK: '/feedback',
  }
};
```

## Benefits

- ✅ **Centralized Configuration**: All API URLs in one place
- ✅ **Environment Flexibility**: Easy switching between environments
- ✅ **Security**: No hardcoded URLs in source code
- ✅ **Maintainability**: Easy to update API endpoints
- ✅ **Development**: Local development support

## Files Updated

The following files have been updated to use environment variables:

- `src/app/admin/analytics/page.tsx`
- `src/app/admin/applications/page.tsx`
- `src/app/admin/applications/[id]/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/application-form/page.tsx`
- `src/app/admin/scholarships/page.tsx`
- `src/app/admin/dashboard/page.tsx`
- `src/lib/api.ts`
- `src/config/api.ts` (new file)

## Setup Instructions

1. Copy the environment variables to your `.env.local` file
2. Update the `NEXT_PUBLIC_API_BASE_URL` as needed
3. Restart your development server
4. The application will now use the configured API URL
