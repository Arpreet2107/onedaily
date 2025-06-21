import React, { useState, useEffect } from 'react';

export default function EntryForm({ addEntry, editEntry, onSave, onCancelEdit, isLoading }) {
  const [content, setContent] = useState('');

  // Populate textarea when editing
  useEffect(() => {
    setContent(editEntry?.content || '');
  }, [editEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    if (editEntry) {
      // Call parent's save function with updated entry
      onSave({ ...editEntry, content: trimmed });
    } else {
      // Call parent's add function
      addEntry(trimmed);
    }

    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your journal entry here..."
        className="w-full p-4 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows={4}
        required
        disabled={isLoading}
      />
      <div className="mt-3 flex items-center space-x-4">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className={`px-6 py-3 font-semibold rounded-md transition-colors duration-200 ${
            isLoading
              ? 'bg-indigo-300 cursor-not-allowed text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {editEntry ? 'Save Changes' : 'Add Entry'}
        </button>

        {editEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={isLoading}
            className="px-4 py-3 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-700 font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
