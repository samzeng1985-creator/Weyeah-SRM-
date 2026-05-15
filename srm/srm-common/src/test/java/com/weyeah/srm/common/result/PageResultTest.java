package com.weyeah.srm.common.result;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PageResultTest {

    @Test
    void of_shouldCreatePageResultCorrectly_whenNormalData() {
        List<String> records = Arrays.asList("record1", "record2", "record3");
        long total = 100;
        long size = 10;
        long current = 1;

        PageResult<String> pageResult = PageResult.of(records, total, size, current);

        assertEquals(records, pageResult.getRecords());
        assertEquals(total, pageResult.getTotal());
        assertEquals(size, pageResult.getSize());
        assertEquals(current, pageResult.getCurrent());
        assertEquals(10, pageResult.getPages());
    }

    @Test
    void of_shouldCalculatePagesCorrectly_whenTotalDivisibleBySize() {
        List<String> records = Arrays.asList("record1");
        PageResult<String> pageResult = PageResult.of(records, 20, 10, 1);
        assertEquals(2, pageResult.getPages());
    }

    @Test
    void of_shouldCalculatePagesCorrectly_whenTotalNotDivisibleBySize() {
        List<String> records = Arrays.asList("record1");
        PageResult<String> pageResult = PageResult.of(records, 21, 10, 1);
        assertEquals(3, pageResult.getPages());
    }

    @Test
    void of_shouldSetPagesToZero_whenSizeIsZero() {
        List<String> records = Arrays.asList("record1");
        PageResult<String> pageResult = PageResult.of(records, 10, 0, 1);
        assertEquals(0, pageResult.getPages());
    }

    @Test
    void of_shouldHandleEmptyRecords() {
        List<String> records = Arrays.asList();
        PageResult<String> pageResult = PageResult.of(records, 0, 10, 1);
        assertEquals(0, pageResult.getTotal());
        assertEquals(0, pageResult.getPages());
    }

}
