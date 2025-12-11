import { useNotes } from '@/components/notes-context';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function SortOptions() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const { filters, setFilters } = useNotes();

  const toggleSortOrder = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ ...filters, sortOrder: newOrder });
  };

  const getSortIcon = () => {
    return filters.sortOrder === 'desc' ? 'sort-descending' : 'sort-ascending';
  };

  const getSortLabel = () => {
    const sortBy = filters.sortBy || 'createdAt';
    const order = filters.sortOrder === 'desc' ? 'Newest first' : 'Oldest first';
    return sortBy === 'createdAt' ? `Date: ${order}` : `Updated: ${order}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
        onPress={toggleSortOrder}
      >
        <MaterialCommunityIcons name={getSortIcon()} size={20} color={themeColors.primary} />
        <ThemedText style={styles.sortText}>{getSortLabel()}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sortText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});
