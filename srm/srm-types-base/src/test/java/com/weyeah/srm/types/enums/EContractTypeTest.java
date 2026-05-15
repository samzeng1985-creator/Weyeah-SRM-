package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EContractTypeTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(EContractType.NDA, EContractType.fromCode("NDA"));
        assertEquals(EContractType.PURCHASE, EContractType.fromCode("PURCHASE"));
        assertEquals(EContractType.PROCESSING, EContractType.fromCode("PROCESSING"));
    }

    @Test
    void fromCode_shouldThrowException_whenCodeDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> EContractType.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("NDA", EContractType.NDA.getCode());
        assertEquals("PURCHASE", EContractType.PURCHASE.getCode());
        assertEquals("PROCESSING", EContractType.PROCESSING.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("保密协议", EContractType.NDA.getDesc());
        assertEquals("采购合同", EContractType.PURCHASE.getDesc());
        assertEquals("委托加工合同", EContractType.PROCESSING.getDesc());
    }

}
