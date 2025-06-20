package com.onedaily.journal.controller;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "*") // Allow frontend to access API
public class EntryController {

    @Autowired
    private EntryRepository entryRepository;

    @GetMapping
    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    @GetMapping("/today")
    public Optional<Entry> getTodayEntry() {
        return entryRepository.findByDate(LocalDate.now());
    }

    @PostMapping
    public Entry createEntry(@RequestBody Entry entry) {
        entry.setDate(LocalDate.now());
        return entryRepository.save(entry);
    }

    @PutMapping("/{id}")
    public Entry updateEntry(@PathVariable String id, @RequestBody Entry updated) {
        Entry entry = entryRepository.findById(id).orElseThrow();
        entry.setContent(updated.getContent());
        return entryRepository.save(entry);
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable String id) {
        entryRepository.deleteById(id);
    }
}
