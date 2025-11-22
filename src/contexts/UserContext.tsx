import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserRole } from '../lib/permissionSystem';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  businessAccount: boolean;
  profileImageUrl?: string;
  department?: string;
  jobTitle?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  updateUserRoles: (roles: UserRole[]) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  error: null,
  logout: async () => {},
  updateUserRoles: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check for user in localStorage first (for demo/offline purposes)
    const storedUser = localStorage.getItem('gooseops-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    
    // Then try to get from Supabase auth
    const fetchUser = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }
        
        if (session?.user) {
          // Fetch user profile from database
          const { data, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          if (data) {
            const userData: User = {
              id: session.user.id,
              name: data.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              roles: data.roles || [UserRole.TECHNICIAN], // Default role
              businessAccount: data.business_account || false,
              profileImageUrl: data.profile_image_url,
              department: data.department,
              jobTitle: data.job_title
            };
            
            setUser(userData);
            localStorage.setItem('gooseops-user', JSON.stringify(userData));
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('gooseops-user');
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('gooseops-user');
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err instanceof Error ? err : new Error('Failed to log out'));
    }
  };
  
  const updateUserRoles = (roles: UserRole[]) => {
    if (!user) return;
    
    const updatedUser = { ...user, roles };
    setUser(updatedUser);
    localStorage.setItem('gooseops-user', JSON.stringify(updatedUser));
    
    // In a real app, also update in the database
    supabase
      .from('user_profiles')
      .update({ roles })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Failed to update user roles in database:', error);
        }
      });
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, loading, error, logout, updateUserRoles }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the user context
export const useUser = () => useContext(UserContext);
