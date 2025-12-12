import { useAuth } from '@/components/auth-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen() {
  const { user, signOut, updateProfile, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert("Error", "Username and email are required.");
      return;
    }

    if (!currentPassword.trim()) {
      Alert.alert("Error", "Current password is required to update your profile.");
      return;
    }

    setIsUpdating(true);
    try {
      const success = await updateProfile(
        username.trim(),
        email.trim(),
        newPassword.trim() || currentPassword.trim()
      );
      
      if (success) {
        Alert.alert("Success", "Profile updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert("Error", "Failed to update profile. Please check your current password.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: async () => {
            setIsSigningOut(true);
            await signOut();
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-circle" size={80} color={themeColors.primary} />
        <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>
          Profile
        </ThemedText>
      </View>

      <View style={styles.form}>
        <ThemedText style={[styles.label, { color: themeColors.text }]}>Username</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
          placeholder="Your Username"
          placeholderTextColor={themeColors.secondaryText}
          value={username}
          onChangeText={setUsername}
        />

        <ThemedText style={[styles.label, { color: themeColors.text }]}>Email</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
          placeholder="Your Email"
          placeholderTextColor={themeColors.secondaryText}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <ThemedText style={[styles.label, { color: themeColors.text }]}>Current Password</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
          placeholder="Enter current password"
          placeholderTextColor={themeColors.secondaryText}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <ThemedText style={[styles.label, { color: themeColors.text }]}>New Password (Optional)</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
          placeholder="Leave blank to keep current password"
          placeholderTextColor={themeColors.secondaryText}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeColors.primary }]}
          onPress={handleUpdateProfile}
          disabled={isUpdating || isLoading}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.buttonText}>Update Profile</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: themeColors.border }]}
          onPress={handleSignOut}
          disabled={isLoading || isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color={themeColors.primary} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="logout" size={20} color={themeColors.primary} />
              <ThemedText style={[styles.linkText, { color: themeColors.primary }]}>Sign Out</ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
  },
  linkText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});