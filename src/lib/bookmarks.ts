import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'wingfuel_saved_bookmarks';

export function getSavedBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load bookmarks from localStorage:', err);
    return [];
  }
}

export function saveBookmarksToStorage(ids: string[]) {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn('Failed to save bookmarks to localStorage:', err);
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => getSavedBookmarks());

  useEffect(() => {
    saveBookmarksToStorage(bookmarks);
  }, [bookmarks]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  return { bookmarks, toggleBookmark, isBookmarked };
}
