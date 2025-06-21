package com.onedaily.journal.controller;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/entries")
public class EntryController {

    @Autowired
    private EntryRepository entryRepository;

    // Get all entries
    @GetMapping
    public ResponseEntity<List<Entry>> getAllEntries() {
        List<Entry> entries = entryRepository.findAll();
        return ResponseEntity.ok(entries);
    }

    // Get entries by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Entry>> getEntriesByDate(@PathVariable String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);
            List<Entry> entries = entryRepository.findByDate(parsedDate);
            return ResponseEntity.ok(entries);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request for invalid date format
        }
    }

    // Create a new entry
    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry entry) {
        if (entry == null || entry.getContent() == null || entry.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request for empty content
        }
        entry.setDate(LocalDate.now());
        Entry savedEntry = entryRepository.save(entry);
        return ResponseEntity.ok(savedEntry);
    }

    // Update an entry by ID
    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(@PathVariable String id, @RequestBody Entry updatedEntry) {
        if (updatedEntry == null || updatedEntry.getContent() == null || updatedEntry.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build(); // Prevent empty updates
        }

        Optional<Entry> optionalEntry = entryRepository.findById(id);
        if (optionalEntry.isPresent()) {
            Entry entry = optionalEntry.get();
            entry.setContent(updatedEntry.getContent());
            Entry savedEntry = entryRepository.save(entry);
            return ResponseEntity.ok(savedEntry);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete an entry by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable String id) {
        if (!entryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        entryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
