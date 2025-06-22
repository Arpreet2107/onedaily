package com.onedaily.journal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EntryController.class)
class EntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EntryRepository entryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllEntries() throws Exception {
        Entry entry1 = new Entry("1", "Content 1", LocalDate.now());
        Entry entry2 = new Entry("2", "Content 2", LocalDate.now());

        when(entryRepository.findAll()).thenReturn(Arrays.asList(entry1, entry2));

        mockMvc.perform(get("/api/entries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    void testCreateEntry() throws Exception {
        Entry entry = new Entry(null, "New Content", null);
        Entry savedEntry = new Entry("1", "New Content", LocalDate.now());

        when(entryRepository.save(any(Entry.class))).thenReturn(savedEntry);

        mockMvc.perform(post("/api/entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(entry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.content").value("New Content"));
    }

    @Test
    void testUpdateEntry() throws Exception {
        Entry existingEntry = new Entry("123", "Old Content", LocalDate.now());
        Entry updatedEntry = new Entry("123", "Updated Content", LocalDate.now());

        when(entryRepository.findById("123")).thenReturn(Optional.of(existingEntry));
        when(entryRepository.save(any(Entry.class))).thenReturn(updatedEntry);

        mockMvc.perform(put("/api/entries/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedEntry)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }

    @Test
    void testDeleteEntry() throws Exception {
        when(entryRepository.existsById("123")).thenReturn(true);

        mockMvc.perform(delete("/api/entries/123"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetEntriesByDate() throws Exception {
        LocalDate today = LocalDate.now();
        Entry entry = new Entry("1", "By Date", today);

        when(entryRepository.findByDate(today)).thenReturn(Arrays.asList(entry));

        mockMvc.perform(get("/api/entries/date/" + today.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(1));
    }
}
