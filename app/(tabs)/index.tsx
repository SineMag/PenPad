import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="note-multiple" size={60} color={themeColors.primary} />
        <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>
          PenPad
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={[styles.description, { color: themeColors.secondaryText }]}>
          Welcome to your personal note-taking space.
        </ThemedText>
        
        <View style={[styles.featureCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MaterialCommunityIcons name="pencil" size={32} color={themeColors.primary} />
          <ThemedText style={[styles.featureTitle, { color: themeColors.text }]}>Quick Notes</ThemedText>
          <ThemedText style={[styles.featureDescription, { color: themeColors.secondaryText }]}>
            Capture your thoughts instantly with our intuitive note editor.
          </ThemedText>
        </View>

        <View style={[styles.featureCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
          <MaterialCommunityIcons name="folder-multiple" size={32} color={themeColors.primary} />
          <ThemedText style={[styles.featureTitle, { color: themeColors.text }]}>Organized</ThemedText>
          <ThemedText style={[styles.featureDescription, { color: themeColors.secondaryText }]}>
            Keep your notes organized with categories and tags.
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
