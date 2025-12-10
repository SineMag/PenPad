import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const NOTES_STORAGE_KEY = '@notes_key';

export const getNotes = async (): Promise<Note[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error getting notes: ", e);
    return [];
  }
};

export const saveNote = async (note: Note): Promise<void> => {
  try {
    const currentNotes = await getNotes();
    const existingIndex = currentNotes.findIndex(n => n.id === note.id);

    let updatedNotes;
    if (existingIndex > -1) {
      // Update existing note
      updatedNotes = currentNotes.map(n => n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n);
    } else {
      // Add new note
      const newNote = { ...note, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      updatedNotes = [...currentNotes, newNote];
    }

    const jsonValue = JSON.stringify(updatedNotes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving note: ", e);
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    const currentNotes = await getNotes();
    const updatedNotes = currentNotes.filter(note => note.id !== id);
    const jsonValue = JSON.stringify(updatedNotes);
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error deleting note: ", e);
  }
};

export const getNoteById = async (id: string): Promise<Note | undefined> => {
    try {
        const notes = await getNotes();
        return notes.find(note => note.id === id);
    } catch (e) {
        console.error("Error getting note by id: ", e);
        return undefined;
    }
};

export const clearAllNotes = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(NOTES_STORAGE_KEY);
    } catch (e) {
        console.error("Error clearing all notes: ", e);
    }
}
