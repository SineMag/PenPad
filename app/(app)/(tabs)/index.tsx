import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack, router, useFocusEffect } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Note, getNotes } from '@/utils/storage'; // Import Note and getNotes

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // 'asc' for ascending, 'desc' for descending

  const fetchNotes = async () => {
    setRefreshing(true);
    try {
      const allNotes = await getNotes();
      setNotes(allNotes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      Alert.alert("Error", "Failed to load notes.");
    } finally {
      setRefreshing(false);
    }
  };

  // Fetch notes when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Notes',
          headerStyle: { backgroundColor: themeColors.primary },
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <TouchableOpacity onPress={toggleSortOrder} style={{ marginRight: 15 }}>
              <MaterialCommunityIcons
                name={sortOrder === 'asc' ? "sort-calendar-ascending" : "sort-calendar-descending"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <TextInput
        style={[styles.searchInput, { borderColor: themeColors.border, color: themeColors.text }]}
        placeholder="Search notes..."
        placeholderTextColor={themeColors.secondaryText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.noteItem, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}
            onPress={() => router.push(`/note/${item.id}`)}
          >
            <ThemedText type="subtitle" style={{ color: themeColors.primary }}>{item.title || "No Title"}</ThemedText>
            <ThemedText style={{ color: themeColors.secondaryText }} numberOfLines={2}>{item.content}</ThemedText>
            <ThemedText style={{ fontSize: 12, color: themeColors.secondaryText }}>
              {item.category} - {new Date(item.createdAt).toLocaleDateString()}
              {item.createdAt !== item.updatedAt && ` (Edited: ${new Date(item.updatedAt).toLocaleDateString()})`}
            </ThemedText>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchNotes} tintColor={themeColors.primary} />
        }
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 20, color: themeColors.secondaryText }}>
            No notes found.
          </ThemedText>
        }
      />
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: themeColors.primary }]}
        onPress={() => router.push('/note/add')}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0, // Adjust for header
  },
  searchInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  noteItem: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});