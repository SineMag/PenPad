import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="compass" size={60} color={themeColors.primary} />
        <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>
          Explore
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={[styles.description, { color: themeColors.secondaryText }]}>
          Discover new features and possibilities in your note-taking journey.
        </ThemedText>
        
        <View style={[styles.featureCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MaterialCommunityIcons name="lightbulb" size={32} color={themeColors.primary} />
          <ThemedText style={[styles.featureTitle, { color: themeColors.text }]}>Smart Organization</ThemedText>
          <ThemedText style={[styles.featureDescription, { color: themeColors.secondaryText }]}>
            Categorize your notes with Work, Study, and Personal tags for better organization.
          </ThemedText>
        </View>

        <View style={[styles.featureCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MaterialCommunityIcons name="palette" size={32} color={themeColors.primary} />
          <ThemedText style={[styles.featureTitle, { color: themeColors.text }]}>Dark & Light Mode</ThemedText>
          <ThemedText style={[styles.featureDescription, { color: themeColors.secondaryText }]}>
            Enjoy seamless theme switching that follows your system preferences.
          </ThemedText>
        </View>

        <View style={[styles.featureCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MaterialCommunityIcons name="shield-lock" size={32} color={themeColors.primary} />
          <ThemedText style={[styles.featureTitle, { color: themeColors.text }]}>Secure & Private</ThemedText>
          <ThemedText style={[styles.featureDescription, { color: themeColors.secondaryText }]}>
            Your notes are stored locally and protected by your personal account.
          </ThemedText>
        </View>
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
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
