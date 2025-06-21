import React, { useState, useEffect } from "react";

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

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
    const trimmed = content.trim();
    if (!trimmed) {
      alert("Entry content cannot be empty");
      return;
    }
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to add entry");
      const newEntry = await res.json();
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (id, currentContent) => {
    setEditEntryId(id);
    setEditContent(currentContent);
  };

  const cancelEdit = () => {
    setEditEntryId(null);
    setEditContent("");
  };

  const saveEdit = async (id) => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      alert("Entry content cannot be empty");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to update entry");
      const updatedEntry = await res.json();
      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/entries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete entry");
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">One Daily Journal</h1>

      <form onSubmit={addEntry} className="mb-4" aria-label="Add journal entry form">
        <label htmlFor="entryContent" className="sr-only">
          Journal Entry Content
        </label>
        <textarea
          id="entryContent"
          rows={4}
          className="w-full p-3 border border-gray-300 rounded mb-2 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write your entry here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading || saving}
          required
        />
        <button
          type="submit"
          disabled={loading || saving || !content.trim()}
          className={`bg-indigo-600 text-white py-2 px-6 rounded transition ${
            loading || saving || !content.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-indigo-700"
          }`}
        >
          {loading ? "Adding..." : "Add Entry"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 mb-4" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      {loading && entries.length === 0 ? (
        <p>Loading entries...</p>
      ) : (
        <ul>
          {entries.map((entry) => {
            const dateString = entry.date
              ? new Date(entry.date).toLocaleDateString()
              : "No date";
            return (
              <li
                key={entry.id}
                className="p-4 mb-2 border rounded bg-indigo-50 shadow-sm flex flex-col gap-2"
              >
                {editEntryId === entry.id ? (
                  <>
                    <textarea
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      disabled={saving}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(entry.id)}
                        disabled={saving}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        type="button"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{entry.content}</p>
                    <small className="text-gray-500">{dateString}</small>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(entry.id, entry.content)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
