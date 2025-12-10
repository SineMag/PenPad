import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/components/auth-context'; // Import useAuth
import { router } from 'expo-router';

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth(); // Get signUp and isLoading from context
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const success = await signUp(username, email, password);
    if (!success) {
      Alert.alert("Registration Failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedText type="title" style={{ color: themeColors.primary }}>Register</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Username"
        placeholderTextColor={themeColors.secondaryText}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
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
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
        <ThemedText style={[styles.linkText, { color: themeColors.primary }]}>
          Already have an account? Log In
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