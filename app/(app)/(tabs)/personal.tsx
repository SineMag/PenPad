import { useNotes } from '@/components/notes-context';
import { NotesList } from '@/components/NotesList';
import { SearchBar } from '@/components/SearchBar';
import { SortOptions } from '@/components/SortOptions';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PersonalScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const { getNotesByCategory } = useNotes();
  
  const personalNotes = getNotesByCategory('personal');

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.primary }}>
          Personal Notes
        </ThemedText>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: themeColors.primary }]}
          onPress={() => router.push('/note/add?category=personal')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <SearchBar />
      <SortOptions />
      
      <NotesList notes={personalNotes} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
