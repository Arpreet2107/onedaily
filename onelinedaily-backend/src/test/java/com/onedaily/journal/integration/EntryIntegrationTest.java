package com.onedaily.journal.integration;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EntryIntegrationTest {

    @Autowired
    private EntryRepository entryRepository;

    private static String entryId;

    @Test
    @Order(1)
    void testCreateEntry() {
        Entry entry = new Entry(null, "Integration Test Entry", LocalDate.now());
        Entry saved = entryRepository.save(entry);
        entryId = saved.getId();
        assertNotNull(saved.getId());
        assertEquals("Integration Test Entry", saved.getContent());
    }

    @Test
    @Order(2)
    void testFindEntryById() {
        Optional<Entry> found = entryRepository.findById(entryId);
        assertTrue(found.isPresent());
        assertEquals("Integration Test Entry", found.get().getContent());
    }
//    @BeforeEach
//    void cleanBefore() {
//        entryRepository.deleteAll();
//    }


    @Test
    @Order(3)
    void testUpdateEntry() {
        Optional<Entry> optional = entryRepository.findById(entryId);
        assertTrue(optional.isPresent());

        Entry entry = optional.get();
        entry.setContent("Updated Integration Content");
        Entry updated = entryRepository.save(entry);

        assertEquals("Updated Integration Content", updated.getContent());
    }

    @Test
    @Order(4)
    void testDeleteEntry() {
        entryRepository.deleteById(entryId);
        Optional<Entry> deleted = entryRepository.findById(entryId);
        assertFalse(deleted.isPresent());
    }
}
