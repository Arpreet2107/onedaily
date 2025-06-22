package com.onedaily.journal.repository;

import com.onedaily.journal.model.Entry;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class EntryRepositoryTest {

    @Autowired
    private EntryRepository entryRepository;

    @Test
    @DisplayName("Should save and retrieve an entry by date")
    public void testFindByDate() {
        // Arrange
        LocalDate today = LocalDate.now();
        Entry entry = Entry.builder()
                .content("Testing entry")
                .date(today)
                .build();
        entryRepository.save(entry);

        // Act
        List<Entry> entries = entryRepository.findByDate(today);

        // Assert
        assertThat(entries).isNotEmpty();
        assertThat(entries.get(0).getContent()).isEqualTo("Testing entry");
    }

    @Test
    @DisplayName("Should return empty list for non-existent date")
    public void testFindByNonExistentDate() {
        // Act
        List<Entry> entries = entryRepository.findByDate(LocalDate.of(1999, 1, 1));

        // Assert
        assertThat(entries).isEmpty();
    }
}
