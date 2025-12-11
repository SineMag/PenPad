import { useNotes } from '@/components/notes-context';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function SearchBar() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const { filters, setFilters } = useNotes();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ ...filters, searchQuery });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
      <MaterialCommunityIcons name="magnify" size={20} color={themeColors.secondaryText} />
      <TextInput
        style={[styles.input, { color: themeColors.text }]}
        placeholder="Search notes..."
        placeholderTextColor={themeColors.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
});
