package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EContractStatusTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(EContractStatus.DRAFT, EContractStatus.fromCode("DRAFT"));
        assertEquals(EContractStatus.PENDING_REVIEW, EContractStatus.fromCode("PENDING_REVIEW"));
        assertEquals(EContractStatus.APPROVED, EContractStatus.fromCode("APPROVED"));
        assertEquals(EContractStatus.PENDING_SIGN, EContractStatus.fromCode("PENDING_SIGN"));
        assertEquals(EContractStatus.SIGNED, EContractStatus.fromCode("SIGNED"));
        assertEquals(EContractStatus.EXPIRED, EContractStatus.fromCode("EXPIRED"));
        assertEquals(EContractStatus.TERMINATED, EContractStatus.fromCode("TERMINATED"));
    }

    @Test
    void fromCode_shouldThrowException_whenCodeDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> EContractStatus.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("DRAFT", EContractStatus.DRAFT.getCode());
        assertEquals("SIGNED", EContractStatus.SIGNED.getCode());
        assertEquals("EXPIRED", EContractStatus.EXPIRED.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("草稿", EContractStatus.DRAFT.getDesc());
        assertEquals("已签署", EContractStatus.SIGNED.getDesc());
        assertEquals("已过期", EContractStatus.EXPIRED.getDesc());
    }

}
