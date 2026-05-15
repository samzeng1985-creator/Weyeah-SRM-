package com.weyeah.srm.types.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ESupplierTypeTest {

    @Test
    void fromCode_shouldReturnCorrectEnum_whenCodeExists() {
        assertEquals(ESupplierType.DOMESTIC, ESupplierType.fromCode("DOMESTIC"));
        assertEquals(ESupplierType.OVERSEAS, ESupplierType.fromCode("OVERSEAS"));
        assertEquals(ESupplierType.PROCESSOR, ESupplierType.fromCode("PROCESSOR"));
    }

    @Test
    void fromCode_shouldThrowException_whenCodeDoesNotExist() {
        assertThrows(IllegalArgumentException.class, () -> ESupplierType.fromCode("INVALID"));
    }

    @Test
    void getCode_shouldReturnCorrectCode() {
        assertEquals("DOMESTIC", ESupplierType.DOMESTIC.getCode());
        assertEquals("OVERSEAS", ESupplierType.OVERSEAS.getCode());
        assertEquals("PROCESSOR", ESupplierType.PROCESSOR.getCode());
    }

    @Test
    void getDesc_shouldReturnCorrectDescription() {
        assertEquals("国内供应商", ESupplierType.DOMESTIC.getDesc());
        assertEquals("海外供应商", ESupplierType.OVERSEAS.getDesc());
        assertEquals("代工厂", ESupplierType.PROCESSOR.getDesc());
    }

}
