package com.onedaily.journal.repository;

import com.onedaily.journal.model.Entry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface EntryRepository extends MongoRepository<Entry, String> {
    Optional<Entry> findByDate(LocalDate date);
}
