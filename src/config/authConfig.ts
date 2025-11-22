/**
 * Authentication Configuration
 *
 * RetailDispense (Microsoft 365 Admin)
 * Configured for persistent authentication - SIGN IN ONCE!
 */

import { Configuration, PopupRequest } from '@azure/msal-browser';

// ============================================
// RETAILDISPENSE (Microsoft 365 Admin Auth)
// ============================================

export const retailDispenseMSALConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'b89b250d-e525-4d70-b875-c0c01eb75953',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'f50027fa-a290-4e2a-bafd-f349a6df5703'}`,
    redirectUri: window.location.origin + '/auth/retaildispense/callback',
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage', // Persistent storage - NO MORE PROMPTS!
    storeAuthStateInCookie: true,
    secureCookies: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        if (level === 0) console.error('[RetailDispense Auth]', message);
        if (level === 1) console.warn('[RetailDispense Auth]', message);
      },
    },
    allowNativeBroker: false,
  },
};

export const retailDispenseLoginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'User.ReadBasic.All',
    'User.ReadWrite.All', // Admin access
    'Directory.Read.All',
    'Directory.ReadWrite.All', // Full directory access
    'Calendars.ReadWrite',
    'Mail.ReadWrite',
    'Files.ReadWrite.All',
    'Sites.ReadWrite.All',
    'openid',
    'profile',
    'email',
    'offline_access', // CRITICAL: Refresh tokens for persistent auth!
  ],
  prompt: 'select_account', // Only ask once
};

// ============================================
// API ENDPOINTS
// ============================================

export const apiEndpoints = {
  // Microsoft Graph
  microsoft: {
    graph: 'https://graph.microsoft.com/v1.0',
    me: 'https://graph.microsoft.com/v1.0/me',
    mail: 'https://graph.microsoft.com/v1.0/me/messages',
    calendar: 'https://graph.microsoft.com/v1.0/me/calendar/events',
    files: 'https://graph.microsoft.com/v1.0/me/drive/root/children',
    users: 'https://graph.microsoft.com/v1.0/users',
  },
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const storageKeys = {
  retailDispenseToken: 'retaildispense_msal_token',
  retailDispenseUser: 'retaildispense_user',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if RetailDispense auth is valid
 */
export const isRetailDispenseAuthenticated = (): boolean => {
  const token = localStorage.getItem(storageKeys.retailDispenseToken);
  return !!token;
};

/**
 * Clear all authentication
 */
export const clearAllAuth = () => {
  Object.values(storageKeys).forEach(key => localStorage.removeItem(key));
};
