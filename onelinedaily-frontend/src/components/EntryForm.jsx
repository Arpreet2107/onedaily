import React, { useState } from 'react';

export default function EntryForm({ addEntry }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry(content);
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
      />
      <button
        type="submit"
        className="mt-3 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200"
      >
        Add Entry
      </button>
    </form>
  );
}
