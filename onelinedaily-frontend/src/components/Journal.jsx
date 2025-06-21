import React, { useState, useEffect } from "react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all entries on load
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/entries");
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Entry content cannot be empty");
      return;
    }
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to add entry");
      const newEntry = await res.json();
      setEntries([newEntry, ...entries]);
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">One Daily Journal</h1>

      <form onSubmit={addEntry} className="mb-4">
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-300 rounded mb-2"
          placeholder="Write your entry here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
        >
          Add Entry
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading entries...</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="p-4 mb-2 border rounded bg-indigo-50 shadow-sm"
            >
              <p>{entry.content}</p>
              <small className="text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
