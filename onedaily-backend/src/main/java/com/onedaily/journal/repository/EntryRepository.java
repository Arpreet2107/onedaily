package com.onedaily.journal.repository;

import com.onedaily.journal.model.Entry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

public interface EntryRepository extends MongoRepository<Entry, String> {
    // Finds entries with exact date matching
    List<Entry> findByDate(LocalDate date);
    List<Entry> findByDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);


}

