import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchEntries, addEntry, deleteEntry, updateEntry } from "../api/entriesApi";

export const useEntries = () => {
  const queryClient = useQueryClient();

  // Fetch all entries
  const entriesQuery = useQuery("entries", fetchEntries, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Mutation: Add entry
  const addEntryMutation = useMutation(addEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("entries");
    },
    onError: (error) => {
      console.error("Add entry failed:", error);
    },
  });

  // Mutation: Delete entry
  const deleteEntryMutation = useMutation(deleteEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("entries");
    },
    onError: (error) => {
      console.error("Delete entry failed:", error);
    },
  });

  // Optional: Update entry mutation
  const updateEntryMutation = useMutation(updateEntry, {
    onSuccess: () => {
      queryClient.invalidateQueries("entries");
    },
    onError: (error) => {
      console.error("Update entry failed:", error);
    },
  });

  return {
    entriesQuery,
    addEntryMutation,
    deleteEntryMutation,
    updateEntryMutation,
  };
};
