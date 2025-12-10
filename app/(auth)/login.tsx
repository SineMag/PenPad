import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedText type="title" style={{ color: themeColors.primary }}>Login</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Email"
        placeholderTextColor={themeColors.secondaryText}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Password"
        placeholderTextColor={themeColors.secondaryText}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]}>
        <ThemedText style={styles.buttonText}>Log In</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity>
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
