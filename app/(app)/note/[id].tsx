import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNoteById, saveNote, deleteNote, Note } from '@/utils/storage'; // Import storage functions

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const fetchedNote = await getNoteById(String(id));
          if (fetchedNote) {
            setNote(fetchedNote);
            setTitle(fetchedNote.title);
            setCategory(fetchedNote.category);
            setContent(fetchedNote.content);
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
  }, [id]);

  const handleSaveNote = async () => {
    if (!note || !content) {
      Alert.alert("Error", "Note content cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      const updatedNote = {
        ...note,
        title,
        category,
        content,
        updatedAt: new Date().toISOString(),
      };
      await saveNote(updatedNote);
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
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Delete", onPress: async () => {
            if (note) {
                setIsDeleting(true);
                try {
                    await deleteNote(note.id);
                    Alert.alert("Success", "Note deleted successfully!");
                    router.back();
                } catch (error) {
                    console.error("Error deleting note:", error);
                    Alert.alert("Error", "Failed to delete note.");
                } finally {
                    setIsDeleting(false);
                }
            }
          },
          style: 'destructive'
        }
      ]
    );
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
      <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>{title || "No Title"}</ThemedText>
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Title"
        placeholderTextColor={themeColors.secondaryText}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Category"
        placeholderTextColor={themeColors.secondaryText}
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={[styles.contentInput, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Note Content"
        placeholderTextColor={themeColors.secondaryText}
        multiline
        numberOfLines={6}
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  contentInput: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 120,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text on primary button
    fontWeight: 'bold',
  },
});