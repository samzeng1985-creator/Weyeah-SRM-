package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EAnnualReviewStatusTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(EAnnualReviewStatus.PENDING, EAnnualReviewStatus.fromCode("PENDING"));
        assertEquals(EAnnualReviewStatus.IN_PROGRESS, EAnnualReviewStatus.fromCode("IN_PROGRESS"));
        assertEquals(EAnnualReviewStatus.PASSED, EAnnualReviewStatus.fromCode("PASSED"));
        assertEquals(EAnnualReviewStatus.FAILED, EAnnualReviewStatus.fromCode("FAILED"));
    }

    @Test
    void fromCode_shouldThrowException_whenCodeDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> EAnnualReviewStatus.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("PENDING", EAnnualReviewStatus.PENDING.getCode());
        assertEquals("PASSED", EAnnualReviewStatus.PASSED.getCode());
        assertEquals("FAILED", EAnnualReviewStatus.FAILED.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("待年审", EAnnualReviewStatus.PENDING.getDesc());
        assertEquals("年审通过", EAnnualReviewStatus.PASSED.getDesc());
        assertEquals("年审未通过", EAnnualReviewStatus.FAILED.getDesc());
    }

}
