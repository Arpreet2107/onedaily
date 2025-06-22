package com.onedaily.journal.service;

import com.onedaily.journal.model.Entry;
import com.onedaily.journal.repository.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EntryService {

    @Autowired
    private EntryRepository entryRepository;

    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    public Optional<Entry> getEntryById(String id) {
        return entryRepository.findById(id);
    }

    public List<Entry> getEntriesByDate(LocalDate date) {
        return entryRepository.findByDate(date);
    }

    public Entry createEntry(Entry entry) {
        entry.setDate(LocalDate.now());
        return entryRepository.save(entry);
    }

    public Optional<Entry> updateEntry(String id, String newContent) {
        Optional<Entry> entryOptional = entryRepository.findById(id);
        if (entryOptional.isPresent()) {
            Entry entry = entryOptional.get();
            entry.setContent(newContent);
            return Optional.of(entryRepository.save(entry));
        }
        return Optional.empty();
    }

    public boolean deleteEntry(String id) {
        if (entryRepository.existsById(id)) {
            entryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
