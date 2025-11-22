import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import {
  retailDispenseMSALConfig,
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

  const value: AuthContextType = {
    retailDispenseUser,
    retailDispenseToken,
    loginRetailDispense,
    logoutRetailDispense,
    isRetailDispenseAuth: !!retailDispenseToken,
  };

  return (
    <MsalProvider instance={msalInstance}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </MsalProvider>
  );
};

export default AuthProvider;
