import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/components/auth-context'; // Import useAuth
import { router } from 'expo-router';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth(); // Get signIn and isLoading from context
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    const success = await signIn(email, password);
    if (!success) {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedText type="title" style={{ color: themeColors.primary }}>Login</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Email"
        placeholderTextColor={themeColors.secondaryText}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Password"
        placeholderTextColor={themeColors.secondaryText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Log In</ThemedText>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
        <ThemedText style={[styles.linkText, { color: themeColors.primary }]}>
          Don't have an account? Register
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text on primary button
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 10,
  },
});