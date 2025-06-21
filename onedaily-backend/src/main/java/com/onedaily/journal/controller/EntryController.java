package com.onedaily.journal.controller;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class EntryController {

    @Autowired
    private EntryRepository entryRepository;

    // Get all entries
    @GetMapping
    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    // Get entries by date
    @GetMapping("/date/{date}")
    public List<Entry> getEntriesByDate(@PathVariable String date) {
        return entryRepository.findByDate(LocalDate.parse(date));
    }

    // Create a new entry
    @PostMapping
    public Entry createEntry(@RequestBody Entry entry) {
        entry.setDate(LocalDate.now());
        return entryRepository.save(entry);
    }

    // Delete an entry by id
    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable String id) {
        entryRepository.deleteById(id);
    }
}
