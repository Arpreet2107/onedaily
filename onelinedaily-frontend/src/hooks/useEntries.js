import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchEntries, addEntry, deleteEntry } from "../api/entriesApi";

export const useEntries = () => {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery("entries", fetchEntries);

  const addEntryMutation = useMutation(addEntry, {
    onSuccess: () => queryClient.invalidateQueries("entries"),
  });

  const deleteEntryMutation = useMutation(deleteEntry, {
    onSuccess: () => queryClient.invalidateQueries("entries"),
  });

  return {
    entriesQuery,
    addEntryMutation,
    deleteEntryMutation,
  };
};
