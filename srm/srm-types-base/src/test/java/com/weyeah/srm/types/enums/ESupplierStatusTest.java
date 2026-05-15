package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ESupplierStatusTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(ESupplierStatus.DRAFT, ESupplierStatus.fromCode("DRAFT"));
        assertEquals(ESupplierStatus.PENDING_REVIEW, ESupplierStatus.fromCode("PENDING_REVIEW"));
        assertEquals(ESupplierStatus.ACTIVE, ESupplierStatus.fromCode("ACTIVE"));
        assertEquals(ESupplierStatus.FROZEN, ESupplierStatus.fromCode("FROZEN"));
        assertEquals(ESupplierStatus.TERMINATED, ESupplierStatus.fromCode("TERMINATED"));
    }

    @Test
    void fromCode_shouldThrowException_whenCodeDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> ESupplierStatus.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("DRAFT", ESupplierStatus.DRAFT.getCode());
        assertEquals("PENDING_REVIEW", ESupplierStatus.PENDING_REVIEW.getCode());
        assertEquals("ACTIVE", ESupplierStatus.ACTIVE.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("草稿", ESupplierStatus.DRAFT.getDesc());
        assertEquals("待审核", ESupplierStatus.PENDING_REVIEW.getDesc());
        assertEquals("已生效", ESupplierStatus.ACTIVE.getDesc());
    }

}
