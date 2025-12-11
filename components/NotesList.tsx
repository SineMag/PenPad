import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Note } from '@/types/note';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface NotesListProps {
  notes: Note[];
}

export function NotesList({ notes }: NotesListProps) {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work':
        return '#FF6B6B';
      case 'study':
        return '#4ECDC4';
      case 'personal':
        return '#45B7D1';
      default:
        return themeColors.primary;
    }
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[styles.noteCard, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
      onPress={() => router.push(`/note/${item.id}`)}
    >
      <View style={styles.noteHeader}>
        {item.title && (
          <ThemedText style={styles.noteTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
        )}
        <View style={styles.noteMeta}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <ThemedText style={styles.dateText}>{formatDate(item.createdAt)}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.noteContent} numberOfLines={3}>
        {item.content}
      </ThemedText>
      {item.updatedAt !== item.createdAt && (
        <ThemedText style={styles.updatedText}>
          Updated {formatDate(item.updatedAt)}
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={notes}
      renderItem={renderNote}
      keyExtractor={(item) => item.id}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="note-text-outline" size={64} color={themeColors.secondaryText} />
          <ThemedText style={[styles.emptyText, { color: themeColors.secondaryText }]}>
            No notes yet
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: themeColors.secondaryText }]}>
            Tap the + button to create your first note
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noteHeader: {
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  noteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  updatedText: {
    fontSize: 11,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
