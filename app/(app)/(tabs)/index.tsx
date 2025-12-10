import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Placeholder for note data
const MOCK_NOTES = [
  { id: '1', title: 'Meeting Notes', content: 'Discussed project deadlines and new features.', category: 'Work', date: '2023-11-20' },
  { id: '2', title: 'Study Session', content: 'Reviewed React Native navigation concepts.', category: 'Study', date: '2023-11-19' },
  { id: '3', title: 'Grocery List', content: 'Milk, Eggs, Bread, Apples.', category: 'Personal', date: '2023-11-18' },
];

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];

  return (
    <ThemedView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedText type="title" style={[styles.title, { color: themeColors.text }]}>All Notes</ThemedText>
      <FlatList
        data={MOCK_NOTES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.noteItem, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
            <ThemedText type="subtitle" style={{ color: themeColors.primary }}>{item.title}</ThemedText>
            <ThemedText style={{ color: themeColors.secondaryText }}>{item.content}</ThemedText>
            <ThemedText style={{ fontSize: 12, color: themeColors.secondaryText }}>{item.category} - {item.date}</ThemedText>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={[styles.addButton, { backgroundColor: themeColors.primary }]}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
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
