export interface Note {
  id: string;
  title?: string;
  content: string;
  category: NoteCategory;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteCategory = 'work' | 'study' | 'personal';

export type SortOrder = 'asc' | 'desc';

export interface NoteFilters {
  searchQuery?: string;
  category?: NoteCategory;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: SortOrder;
}
