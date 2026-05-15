package com.srm.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtils {

    private static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    private DateUtils() {
    }

    public static String format(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return DateTimeFormatter.ofPattern(DEFAULT_PATTERN).format(dateTime);
    }

    public static String format(LocalDateTime dateTime, String pattern) {
        if (dateTime == null || pattern == null) {
            return "";
        }
        return DateTimeFormatter.ofPattern(pattern).format(dateTime);
    }

    public static LocalDateTime now() {
        return LocalDateTime.now();
    }
}
