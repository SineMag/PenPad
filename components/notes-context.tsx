import { Note, NoteCategory, NoteFilters } from '@/types/note';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth-context';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesByCategory: (category: NoteCategory) => Note[];
  filteredNotes: Note[];
  filters: NoteFilters;
  setFilters: (filters: NoteFilters) => void;
  isLoading: boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<NoteFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Load notes when user changes
  useEffect(() => {
    const loadNotes = async () => {
      if (!user) {
        setNotes([]);
        setIsLoading(false);
        return;
      }

      try {
        const notesJson = await AsyncStorage.getItem('notes');
        const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
        
        // Filter notes by current user
        const userNotes = allNotes.filter(note => note.userId === user.id);
        setNotes(userNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
        setNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [user]);

  // Save notes to storage whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      if (!user) return;

      try {
        // Get all existing notes
        const notesJson = await AsyncStorage.getItem('notes');
        const allNotes: Note[] = notesJson ? JSON.parse(notesJson) : [];
        
        // Remove current user's notes
        const otherUsersNotes = allNotes.filter(note => note.userId !== user.id);
        
        // Combine with current user's notes
        const updatedNotes = [...otherUsersNotes, ...notes];
        
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    };

    if (notes.length > 0 || !isLoading) {
      saveNotes();
    }
  }, [notes, user, isLoading]);

  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNotesByCategory = (category: NoteCategory): Note[] => {
    return notes.filter(note => note.category === category);
  };

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = [...notes];

    // Apply search filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(note => 
        note.title?.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(note => note.category === filters.category);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [notes, filters]);

  const contextValue = useMemo(() => ({
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByCategory,
    filteredNotes,
    filters,
    setFilters,
    isLoading
  }), [notes, filteredNotes, filters, isLoading]);

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}
