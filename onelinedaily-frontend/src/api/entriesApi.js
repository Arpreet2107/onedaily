import axiosClient from "./axiosClient";

export const fetchEntries = () => axiosClient.get("/entries").then(res => res.data);

export const addEntry = (entry) => axiosClient.post("/entries", entry).then(res => res.data);

export const deleteEntry = (id) => axiosClient.delete(`/entries/${id}`);
