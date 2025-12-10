import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { router, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  user: any | null; // Replace 'any' with a proper User type later
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useProtectedRoute(user: any | null, isLoading: boolean) {
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    if (!isLoading) {
      if (user && inAuthGroup) {
        // Redirect authenticated users from auth group to app
        router.replace('/(app)/(tabs)');
      } else if (!user && !inAuthGroup) {
        // Redirect unauthenticated users from app to auth group
        router.replace('/(auth)/login');
      }
    }
  }, [user, inAuthGroup, isLoading]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from async storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  useProtectedRoute(user, isLoading);

  const authContextValue = useMemo(() => ({
    signIn: async (email, password) => {
      setIsLoading(true);
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(async () => {
          if (email === 'test@example.com' && password === 'password') {
            const tempUser = { email, username: 'testuser' };
            await AsyncStorage.setItem('user', JSON.stringify(tempUser));
            setUser(tempUser);
            resolve(true);
          } else {
            console.warn('Invalid credentials');
            resolve(false);
          }
          setIsLoading(false);
        }, 1000);
      });
    },
    signOut: async () => {
      setIsLoading(true);
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    },
    signUp: async (username, email, password) => {
      setIsLoading(true);
      // Simulate API call
      return new Promise(resolve => {
        setTimeout(async () => {
          // For now, any signup is successful and logs in the user
          const tempUser = { email, username };
          await AsyncStorage.setItem('user', JSON.stringify(tempUser));
          setUser(tempUser);
          resolve(true);
          setIsLoading(false);
        }, 1000);
      });
    },
    user,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
