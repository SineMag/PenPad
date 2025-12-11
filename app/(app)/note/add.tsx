import { useAuth } from '@/components/auth-context';
import { useNotes } from '@/components/notes-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NoteCategory } from '@/types/note';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddNoteScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const { addNote } = useNotes();
  const { user } = useAuth();
  const { category: categoryParam } = useLocalSearchParams<{ category?: string }>();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoteCategory>('personal');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (categoryParam && ['work', 'study', 'personal'].includes(categoryParam)) {
      setCategory(categoryParam as NoteCategory);
    }
  }, [categoryParam]);

  const handleSaveNote = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Note content cannot be empty.");
      return;
    }
    
    if (!user) {
      Alert.alert("Error", "You must be logged in to create notes.");
      return;
    }

    setIsSaving(true);
    try {
      await addNote({
        title: title.trim() || undefined,
        content: content.trim(),
        category,
        userId: user.id
      });
      Alert.alert("Success", "Note saved successfully!");
      router.back();
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  const categories: NoteCategory[] = ['work', 'study', 'personal'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Add New Note',
          headerStyle: { backgroundColor: themeColors.primary },
          headerTintColor: '#FFFFFF',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 15 }}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <ThemedText type="title" style={{ color: themeColors.text }}>Add New Note</ThemedText>
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
          <ThemedText style={styles.buttonText}>Save Note</ThemedText>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
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