import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  retailDispenseMSALConfig,
  gmailGoogleConfig,
  storageKeys,
} from '../config/authConfig';

// Create MSAL instance for RetailDispense
const msalInstance = new PublicClientApplication(retailDispenseMSALConfig);

interface AuthContextType {
  // RetailDispense (M365)
  retailDispenseUser: AccountInfo | null;
  retailDispenseToken: string | null;
  loginRetailDispense: () => Promise<void>;
  logoutRetailDispense: () => void;
  isRetailDispenseAuth: boolean;

  // Gmail (Google)
  gmailUser: any | null;
  gmailToken: string | null;
  loginGmail: () => void;
  logoutGmail: () => void;
  isGmailAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // RetailDispense state
  const [retailDispenseUser, setRetailDispenseUser] = useState<AccountInfo | null>(null);
  const [retailDispenseToken, setRetailDispenseToken] = useState<string | null>(null);

  // Gmail state
  const [gmailUser, setGmailUser] = useState<any | null>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(null);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    // Initialize MSAL
    await msalInstance.initialize();

    // Check for existing RetailDispense session
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setRetailDispenseUser(accounts[0]);
      const savedToken = localStorage.getItem(storageKeys.retailDispenseToken);
      if (savedToken) {
        setRetailDispenseToken(savedToken);
      }
    }

    // Check for existing Gmail session
    const savedGmailToken = localStorage.getItem(storageKeys.gmailToken);
    const savedGmailUser = localStorage.getItem(storageKeys.gmailUser);
    if (savedGmailToken && savedGmailUser) {
      setGmailToken(savedGmailToken);
      setGmailUser(JSON.parse(savedGmailUser));
    }
  };

  // RetailDispense (M365) Login
  const loginRetailDispense = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ['User.Read', 'Mail.Read', 'Calendars.Read', 'offline_access'],
        prompt: 'select_account',
      });

      setRetailDispenseUser(response.account);
      setRetailDispenseToken(response.accessToken);

      // Persist token
      localStorage.setItem(storageKeys.retailDispenseToken, response.accessToken);
      localStorage.setItem(storageKeys.retailDispenseUser, JSON.stringify(response.account));

      console.log('✅ RetailDispense authenticated! No more prompts needed.');
    } catch (error) {
      console.error('RetailDispense login error:', error);
      throw error;
    }
  };

  // RetailDispense Logout
  const logoutRetailDispense = () => {
    msalInstance.logoutPopup();
    setRetailDispenseUser(null);
    setRetailDispenseToken(null);
    localStorage.removeItem(storageKeys.retailDispenseToken);
    localStorage.removeItem(storageKeys.retailDispenseUser);
  };

  // Gmail (Google) Login
  const loginGmail = () => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = new URLSearchParams({
      client_id: gmailGoogleConfig.clientId,
      redirect_uri: gmailGoogleConfig.redirectUri,
      response_type: 'token',
      scope: gmailGoogleConfig.scopes,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
    });

    // Open Google OAuth popup
    const authUrl = `${oauth2Endpoint}?${params.toString()}`;
    window.location.href = authUrl;
  };

  // Gmail Logout
  const logoutGmail = () => {
    setGmailUser(null);
    setGmailToken(null);
    localStorage.removeItem(storageKeys.gmailToken);
    localStorage.removeItem(storageKeys.gmailUser);
  };

  const value: AuthContextType = {
    // RetailDispense
    retailDispenseUser,
    retailDispenseToken,
    loginRetailDispense,
    logoutRetailDispense,
    isRetailDispenseAuth: !!retailDispenseToken,

    // Gmail
    gmailUser,
    gmailToken,
    loginGmail,
    logoutGmail,
    isGmailAuth: !!gmailToken,
  };

  return (
    <MsalProvider instance={msalInstance}>
      <GoogleOAuthProvider clientId={gmailGoogleConfig.clientId}>
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      </GoogleOAuthProvider>
    </MsalProvider>
  );
};

export default AuthProvider;
