# Sentry Configuration for Habit Tracker

## Overview

Sentry is configured to work silently in the background to monitor and capture errors in your habit tracker application.

## Configuration Files

### 1. `sentry.server.config.ts`

- Handles server-side error tracking
- Configured for production with reduced sampling rate
- Silent operation in development mode

### 2. `sentry.edge.config.ts`

- Handles edge runtime error tracking
- Used for middleware and edge routes
- Consistent with server configuration

### 3. `instrumentation-client.ts`

- Handles client-side error tracking
- Monitors browser errors and performance
- Silent operation in development mode

### 4. `app/global-error.tsx`

- Global error boundary for the application
- Automatically captures unhandled errors
- Provides fallback UI for errors

## How It Works

### Development Mode

- Sentry is **silent** and won't send errors to the dashboard
- All error tracking is disabled unless `SENTRY_DEBUG=true` is set
- This prevents development noise in your Sentry dashboard

### Production Mode

- Sentry actively monitors and captures errors
- Performance data is collected with 10% sampling rate
- All errors are sent to your Sentry dashboard

## Monitoring Features

### ✅ Error Tracking

- JavaScript errors (client and server-side)
- Unhandled exceptions
- API errors and network failures
- React component errors

### ✅ Performance Monitoring

- Page load times
- API response times
- User interactions
- Navigation performance

### ✅ User Context

- Browser information
- User session data
- Device information
- Geographic location

## Dashboard Access

Visit your Sentry dashboard at: https://sentry.io

- Organization: `gurvak-singh`
- Project: `habit-tracker`

## Environment Variables

To enable Sentry debugging in development:

```bash
SENTRY_DEBUG=true npm run dev
```

## What You'll See in Sentry

1. **Issues** - Grouped errors with stack traces
2. **Performance** - Page load and API performance metrics
3. **Releases** - Deployment tracking
4. **Users** - User session and error context
5. **Alerts** - Real-time notifications for critical errors

## Benefits

- **Silent Operation** - No visible UI elements or buttons
- **Automatic Error Capture** - No manual error reporting needed
- **Performance Insights** - Monitor app performance over time
- **User Context** - Understand who is affected by errors
- **Real-time Alerts** - Get notified of critical issues immediately

## Testing (Optional)

If you need to test Sentry functionality:

1. Set `SENTRY_DEBUG=true` in your environment
2. Create a test error in your code
3. Check your Sentry dashboard for the captured error
4. Remove the test code and reset the environment variable

Your application now has professional error monitoring without any visible Sentry elements in the UI!
