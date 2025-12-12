import { useNotes } from '@/components/notes-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Note, NoteCategory } from '@/types/note';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const { notes, updateNote, deleteNote } = useNotes();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoteCategory>('personal');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchNote = () => {
      if (id) {
        setIsLoading(true);
        try {
          const foundNote = notes.find(n => n.id === String(id));
          if (foundNote) {
            setNote(foundNote);
            setTitle(foundNote.title || '');
            setCategory(foundNote.category);
            setContent(foundNote.content);
          } else {
            Alert.alert("Error", "Note not found.");
            router.back();
          }
        } catch (error) {
          console.error("Error fetching note:", error);
          Alert.alert("Error", "Failed to load note.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchNote();
  }, [id, notes]);

  const handleSaveNote = async () => {
    if (!note || !content.trim()) {
      Alert.alert("Error", "Note content cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await updateNote(note.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        category
      });
      Alert.alert("Success", "Note updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to update note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (note) {
      setIsDeleting(true);
      try {
        await deleteNote(note.id);
        setShowDeleteModal(false);
        Alert.alert("Success", "Note deleted successfully!");
        router.back();
      } catch (error) {
        console.error("Error deleting note:", error);
        Alert.alert("Error", "Failed to delete note.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </ThemedView>
    );
  }

  if (!note) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center' }]}>
        <ThemedText style={{ color: themeColors.text }}>Note not found.</ThemedText>
      </ThemedView>
    );
  }

  const categories: NoteCategory[] = ['work', 'study', 'personal'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: title || "Note Detail",
          headerStyle: { backgroundColor: themeColors.primary },
          headerTintColor: '#FFFFFF',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 15 }} disabled={isDeleting}>
              {isDeleting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons name="delete" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.text }}>
          {title || "No Title"}
        </ThemedText>
        <ThemedText style={[styles.dateText, { color: themeColors.secondaryText }]}>
          Created: {new Date(note.createdAt).toLocaleDateString()}
        </ThemedText>
        {note.updatedAt !== note.createdAt && (
          <ThemedText style={[styles.dateText, { color: themeColors.secondaryText }]}>
            Updated: {new Date(note.updatedAt).toLocaleDateString()}
          </ThemedText>
        )}
      </View>

      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Title (Optional)"
        placeholderTextColor={themeColors.secondaryText}
        value={title}
        onChangeText={setTitle}
      />

      <ThemedText style={[styles.label, { color: themeColors.text }]}>Category</ThemedText>
      <View style={styles.categoryContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: category === cat ? themeColors.primary : themeColors.cardBackground,
                borderColor: themeColors.border
              }
            ]}
            onPress={() => setCategory(cat)}
          >
            <ThemedText style={{
              color: category === cat ? '#FFFFFF' : themeColors.text,
              textTransform: 'capitalize'
            }}>
              {cat}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.contentInput, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Note Content"
        placeholderTextColor={themeColors.secondaryText}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleSaveNote}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
        )}
      </TouchableOpacity>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        icon="delete"
        confirmButtonStyle="destructive"
      />
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
    marginBottom: 20,
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  contentInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 150,
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});