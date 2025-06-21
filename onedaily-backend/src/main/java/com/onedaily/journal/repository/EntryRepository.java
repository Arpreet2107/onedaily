package com.onedaily.journal.repository;

import com.onedaily.journal.model.Entry;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface EntryRepository extends MongoRepository<Entry, String> {
    List<Entry> findByDate(LocalDate date);
}
