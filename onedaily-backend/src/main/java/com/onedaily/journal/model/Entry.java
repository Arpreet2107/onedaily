package com.onedaily.journal.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entry {
    @Id
    private String id;

    private String content;

    private LocalDate date;
}
