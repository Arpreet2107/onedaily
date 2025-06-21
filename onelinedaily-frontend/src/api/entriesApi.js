import axiosClient from "./axiosClient";

// ✅ Fetch all entries
export const fetchEntries = async () => {
  const response = await axiosClient.get("/entries");
  return response.data;
};

// ✅ Add a new entry
export const addEntry = async (entry) => {
  const response = await axiosClient.post("/entries", entry);
  return response.data;
};

// ✅ Delete an entry by ID
export const deleteEntry = async (id) => {
  const response = await axiosClient.delete(`/entries/${id}`);
  return response.data; // optional; or just return id
};

// ✅ Update an entry by ID
export const updateEntry = async ({ id, content }) => {
  const response = await axiosClient.put(`/entries/${id}`, { content });
  return response.data;
};
