import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (username: string, email: string, password: string) => Promise<boolean>;
  user: User | null;
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

function useProtectedRoute(user: User | null, isLoading: boolean) {
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on startup
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
      try {
        // Get stored users
        const usersJson = await AsyncStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];
        
        // Find user with matching email and password
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          await AsyncStorage.setItem('user', JSON.stringify(foundUser));
          setUser(foundUser);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    signOut: async () => {
      setIsLoading(true);
      try {
        await AsyncStorage.removeItem('user');
        setUser(null);
        // Explicitly navigate to login
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Sign out error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    signUp: async (username, email, password) => {
      setIsLoading(true);
      try {
        // Get existing users
        const usersJson = await AsyncStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
          return false;
        }
        
        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          username,
          email,
          password,
          createdAt: new Date().toISOString()
        };
        
        // Save user to users array
        users.push(newUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
        
        // Log in the new user
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        return true;
      } catch (error) {
        console.error('Sign up error:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    updateProfile: async (username, email, password) => {
      setIsLoading(true);
      try {
        if (!user) return false;
        
        // Get existing users
        const usersJson = await AsyncStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];
        
        // Find and update user
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex === -1) return false;
        
        // Check if email is being changed and if it already exists
        if (email !== user.email && users.find(u => u.email === email)) {
          return false;
        }
        
        // Update user data
        const updatedUser: User = {
          ...users[userIndex],
          username,
          email,
          password
        };
        
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return true;
      } catch (error) {
        console.error('Update profile error:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
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
