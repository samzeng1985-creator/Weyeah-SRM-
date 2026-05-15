package com.srm.common.utils;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.*;

public class DateUtilsTest {

    @Test
    void testFormatDefaultPattern() {
        LocalDateTime dateTime = LocalDateTime.of(2024, 1, 15, 10, 30, 0);
        String result = DateUtils.format(dateTime);
        assertEquals("2024-01-15 10:30:00", result);
    }

    @Test
    void testFormatCustomPattern() {
        LocalDateTime dateTime = LocalDateTime.of(2024, 1, 15, 10, 30, 0);
        String result = DateUtils.format(dateTime, "yyyy-MM-dd");
        assertEquals("2024-01-15", result);
    }

    @Test
    void testFormatNull() {
        assertEquals("", DateUtils.format(null));
        assertEquals("", DateUtils.format(null, null));
    }

    @Test
    void testNow() {
        LocalDateTime before = LocalDateTime.now();
        LocalDateTime now = DateUtils.now();
        LocalDateTime after = LocalDateTime.now();
        assertTrue(now.isAfter(before) || now.isEqual(before));
        assertTrue(now.isBefore(after) || now.isEqual(after));
    }
}
