package ru.practice.kotouslugi.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("postgres")
public class PostgresSequenceSynchronizer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(PostgresSequenceSynchronizer.class);

    private static final String[][] TABLE_SEQUENCES = {
            {"banner", "banner_seq"},
            {"cat", "cat_seq"},
            {"service", "service_seq"},
            {"category", "category_seq"},
            {"manufacturer", "manufacturer_seq"},
            {"drug", "drug_seq"},
            {"drug_batch", "drug_batch_seq"},
    };

    private final JdbcTemplate jdbcTemplate;

    public PostgresSequenceSynchronizer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        for (String[] entry : TABLE_SEQUENCES) {
            syncSequence(entry[0], entry[1]);
        }
    }

    private void syncSequence(String table, String sequence) {
        try {
            Long maxId = jdbcTemplate.queryForObject(
                    "SELECT COALESCE(MAX(id), 0) FROM " + table, Long.class);
            if (maxId == null) {
                return;
            }
            jdbcTemplate.queryForObject(
                    "SELECT setval(?, GREATEST(?, 1), true)",
                    Long.class,
                    sequence,
                    maxId);
            logger.debug("Sequence {} synced to {}", sequence, maxId);
        } catch (Exception e) {
            logger.warn("Could not sync sequence {} for table {}: {}", sequence, table, e.getMessage());
        }
    }
}
