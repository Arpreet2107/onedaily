import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Debounce hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function EntryForm({ addEntry, disabled }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Entry cannot be empty!');
      return;
    }
    setSubmitting(true);
    try {
      await addEntry(content.trim());
      setContent('');
    } catch (err) {
      toast.error('Failed to add entry.');
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
      <input
        type="text"
        placeholder="Write your daily entry..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={submitting || disabled}
      />
      <button
        type="submit"
        disabled={submitting || disabled || !content.trim()}
        className="bg-indigo-600 text-white px-5 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
      >
        {submitting ? 'Adding...' : 'Add Entry'}
      </button>
    </form>
  );
}

function EntryList({ entries, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (id, currentContent) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Entry cannot be empty!');
      return;
    }
    setSaving(true);
    try {
      await onUpdate({ id: editingId, content: editContent.trim() });
      toast.success('Entry updated!');
      cancelEdit();
    } catch (error) {
      toast.error('Failed to update entry.');
      console.error(error);
    }
    setSaving(false);
  };

  if (!entries || entries.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No entries found.</p>;
  }

  return (
    <ul className="space-y-4">
      <AnimatePresence>
        {entries.map(({ id, content, date }) => (
          <motion.li
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            layout
            className="bg-indigo-50 p-4 rounded-md shadow flex justify-between items-start gap-4"
          >
            <div className="flex-grow">
              {editingId === id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    disabled={saving}
                  />
                  <p className="text-sm text-indigo-400 mt-1">
                    {date ? new Date(date).toLocaleDateString() : 'No date'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
                  <p className="text-sm text-indigo-400 mt-1">
                    {date ? new Date(date).toLocaleDateString() : 'No date'}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {editingId === id ? (
                <>
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50"
                    type="button"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400"
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(id, content)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                    type="button"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/entries');
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(Array.isArray(data) ? data.sort((a, b) => new Date(b.date) - new Date(a.date)) : []);
    } catch (error) {
      toast.error('Could not load entries.');
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (content) => {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to add entry');
    const newEntry = await res.json();
    setEntries((prev) => [newEntry, ...prev]);
    toast.success('Entry added!');
  };

  const updateEntry = async ({ id, content }) => {
    const res = await fetch(`/api/entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to update entry');
    const updated = await res.json();
    setEntries((prev) => prev.map((entry) => (entry.id === id ? updated : entry)));
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete entry');
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast.success('Entry deleted!');
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((e) =>
      e.content.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [entries, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-10 text-center">
          One Daily Journal
        </h1>

        <EntryForm addEntry={addEntry} disabled={loading} />

        <input
          type="search"
          placeholder="Search your entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading entries...</p>
        ) : (
          <EntryList entries={filteredEntries} onDelete={deleteEntry} onUpdate={updateEntry} />
        )}
      </div>
    </div>
  );
}
