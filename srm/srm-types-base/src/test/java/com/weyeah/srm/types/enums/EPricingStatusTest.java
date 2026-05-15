package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EPricingStatusTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(EPricingStatus.DRAFT, EPricingStatus.fromCode("DRAFT"));
        assertEquals(EPricingStatus.PENDING_APPROVAL, EPricingStatus.fromCode("PENDING_APPROVAL"));
        assertEquals(EPricingStatus.ACTIVE, EPricingStatus.fromCode("ACTIVE"));
        assertEquals(EPricingStatus.EXPIRED, EPricingStatus.fromCode("EXPIRED"));
        assertEquals(EPricingStatus.CANCELLED, EPricingStatus.fromCode("CANCELLED"));
    }

    @Test
    void fromCode_shouldReturnNull_whenCodeDoesNotExist() {
        assertNull(EPricingStatus.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("DRAFT", EPricingStatus.DRAFT.getCode());
        assertEquals("ACTIVE", EPricingStatus.ACTIVE.getCode());
        assertEquals("EXPIRED", EPricingStatus.EXPIRED.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("草稿", EPricingStatus.DRAFT.getDesc());
        assertEquals("已生效", EPricingStatus.ACTIVE.getDesc());
        assertEquals("已过期", EPricingStatus.EXPIRED.getDesc());
    }

}
