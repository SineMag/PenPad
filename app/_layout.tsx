import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/components/auth-context'; // Import AuthProvider

// Removed unstable_settings

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider> {/* Wrap the entire application with AuthProvider */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} /> {/* Main app flow */}
          <Stack.Screen name="(auth)" options={{ headerShown: false }} /> {/* Authentication flow */}
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
