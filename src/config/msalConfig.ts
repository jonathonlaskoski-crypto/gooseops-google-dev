import { Configuration, PopupRequest } from '@azure/msal-browser';

/**
 * Microsoft Authentication Library (MSAL) Configuration
 *
 * This configures persistent M365 authentication with no more sign-in prompts!
 * Uses your tenant keys for full admin access.
 */

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'b89b250d-e525-4d70-b875-c0c01eb75953',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'f50027fa-a290-4e2a-bafd-f349a6df5703'}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin + '/auth/callback',
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage', // Enable persistent storage - NO MORE SIGN-INS!
    storeAuthStateInCookie: true, // Set to true for IE11 or Edge legacy
    secureCookies: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0: // Error
            console.error(message);
            return;
          case 1: // Warning
            console.warn(message);
            return;
          case 2: // Info
            console.info(message);
            return;
          case 3: // Verbose
            console.debug(message);
            return;
        }
      },
    },
    allowNativeBroker: false,
  },
};

/**
 * Scopes for Microsoft Graph API access
 * These give you access to all M365 data without constant prompts
 */
export const loginRequest: PopupRequest = {
  scopes: [
    'User.Read',
    'User.ReadBasic.All',
    'Calendars.Read',
    'Mail.Read',
    'Files.Read.All',
    'Sites.Read.All',
    'openid',
    'profile',
    'email',
    'offline_access', // CRITICAL: Enables refresh tokens for persistent auth!
  ],
};

/**
 * Scopes for silent token acquisition
 */
export const tokenRequest = {
  scopes: ['User.Read'],
  forceRefresh: false,
};

/**
 * Graph API endpoint
 */
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/v1.0/me/messages',
  graphCalendarEndpoint: 'https://graph.microsoft.com/v1.0/me/calendar/events',
  graphFilesEndpoint: 'https://graph.microsoft.com/v1.0/me/drive/root/children',
};
