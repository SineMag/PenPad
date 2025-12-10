import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { useAuth } from '@/components/auth-context'; // Import useAuth

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth(); // Get user, signOut, isLoading from context
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = () => {
    Alert.alert("Update Profile", "Profile update functionality is not yet implemented.");
    // In a real app, you would implement logic to update user credentials
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>Profile</ThemedText>
      <ThemedText style={[styles.label, { color: themeColors.text }]}>Username:</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Your Username"
        placeholderTextColor={themeColors.secondaryText}
        value={username}
        onChangeText={setUsername}
      />
      <ThemedText style={[styles.label, { color: themeColors.text }]}>Email:</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Your Email"
        placeholderTextColor={themeColors.secondaryText}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <ThemedText style={[styles.label, { color: themeColors.text }]}>New Password:</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="New Password"
        placeholderTextColor={themeColors.secondaryText}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleUpdateProfile}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Update Profile</ThemedText>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: themeColors.border }]}
        onPress={handleSignOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={themeColors.text} />
        ) : (
          <ThemedText style={[styles.linkText, { color: themeColors.text }]}>Log Out</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
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
    marginTop: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text on primary button
    fontWeight: 'bold',
  },
  logoutButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
  },
  linkText: {
    //
  },
});