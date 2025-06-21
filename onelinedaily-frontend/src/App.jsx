import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

function EntryForm({ addEntry }) {
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
    } catch {
      toast.error('Failed to add entry');
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
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-indigo-600 text-white px-5 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Entry'}
      </button>
    </form>
  );
}

function EntryList({ entries, onDelete }) {
  if (entries.length === 0) return <p className="text-center text-gray-500 mt-10">No entries found.</p>;

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
            className="bg-indigo-50 p-4 rounded-md shadow flex justify-between items-center"
          >
            <div>
              <p className="text-gray-800">{content}</p>
              <p className="text-sm text-indigo-400 mt-1">{new Date(date).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => onDelete(id)}
              className="text-red-600 hover:text-red-800 font-semibold transition"
              aria-label="Delete Entry"
            >
              &times;
            </button>
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

  // Fetch entries on load
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch('/api/entries');
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(data.sort((a,b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      toast.error('Could not load entries.');
    }
    setLoading(false);
  }

  async function addEntry(content) {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to add entry');
    const newEntry = await res.json();
    setEntries(prev => [newEntry, ...prev]);
    toast.success('Entry added!');
  }

  async function deleteEntry(id) {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Failed to delete entry.');
      return;
    }
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Entry deleted!');
  }

  // Filter entries for search
  const filteredEntries = useMemo(() => {
    return entries.filter(e => e.content.toLowerCase().includes(search.toLowerCase()));
  }, [entries, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-10 text-center drop-shadow-md select-none">
          One Daily Journal
        </h1>

        <EntryForm addEntry={addEntry} />

        <input
          type="search"
          placeholder="Search your entries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-6 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search entries"
        />

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading entries...</p>
        ) : (
          <EntryList entries={filteredEntries} onDelete={deleteEntry} />
        )}
      </div>
    </div>
  );
}
