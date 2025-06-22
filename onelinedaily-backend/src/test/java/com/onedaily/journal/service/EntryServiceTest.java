package com.onedaily.journal.service;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class EntryServiceTest {

    @InjectMocks
    private EntryService entryService;

    @Mock
    private EntryRepository entryRepository;

    private Entry mockEntry;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockEntry = new Entry("1", "Test content", LocalDate.now());
    }

    @Test
    void testCreateEntry() {
        when(entryRepository.save(any(Entry.class))).thenReturn(mockEntry);

        Entry created = entryService.createEntry(mockEntry);
        assertNotNull(created);
        assertEquals("Test content", created.getContent());
        verify(entryRepository, times(1)).save(any(Entry.class));
    }

    @Test
    void testGetAllEntries() {
        List<Entry> entries = List.of(mockEntry);
        when(entryRepository.findAll()).thenReturn(entries);

        List<Entry> result = entryService.getAllEntries();
        assertEquals(1, result.size());
        verify(entryRepository).findAll();
    }

    @Test
    void testUpdateEntry_Success() {
        when(entryRepository.findById("1")).thenReturn(Optional.of(mockEntry));
        when(entryRepository.save(any())).thenReturn(mockEntry);

        Optional<Entry> updated = entryService.updateEntry("1", "Updated content");
        assertTrue(updated.isPresent());
        assertEquals("Updated content", updated.get().getContent());
    }

    @Test
    void testUpdateEntry_NotFound() {
        when(entryRepository.findById("99")).thenReturn(Optional.empty());

        Optional<Entry> updated = entryService.updateEntry("99", "Updated content");
        assertFalse(updated.isPresent());
    }

    @Test
    void testDeleteEntry_Exists() {
        when(entryRepository.existsById("1")).thenReturn(true);
        doNothing().when(entryRepository).deleteById("1");

        boolean result = entryService.deleteEntry("1");
        assertTrue(result);
        verify(entryRepository).deleteById("1");
    }

    @Test
    void testDeleteEntry_NotExists() {
        when(entryRepository.existsById("99")).thenReturn(false);

        boolean result = entryService.deleteEntry("99");
        assertFalse(result);
    }
}
