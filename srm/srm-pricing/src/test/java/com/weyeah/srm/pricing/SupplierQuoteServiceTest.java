package com.weyeah.srm.pricing;

import com.weyeah.srm.pricing.dto.QuoteQueryDTO;
import com.weyeah.srm.pricing.dto.SupplierQuoteCreateDTO;
import com.weyeah.srm.pricing.entity.SupplierQuote;
import com.weyeah.srm.pricing.service.SupplierQuoteService;
import com.weyeah.srm.pricing.vo.SupplierQuoteDetailVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SupplierQuoteServiceTest {

    @Autowired
    private SupplierQuoteService supplierQuoteService;

    @Test
    void testCreateQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("150.00"));
        createDTO.setMinOrderQuantity(new BigDecimal("10"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");
        createDTO.setPaymentTerms("T/T 30天");
        createDTO.setLeadTime(7);
        createDTO.setRemark("测试报价");

        Long id = supplierQuoteService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByQuoteNumber() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("200.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);

        SupplierQuote created = supplierQuoteService.getById(id);
        SupplierQuote byNumber = supplierQuoteService.getByQuoteNumber(created.getQuoteNumber());

        assertNotNull(byNumber);
        assertEquals(created.getId(), byNumber.getId());
    }

    @Test
    void testQueryPage() {
        QuoteQueryDTO queryDTO = new QuoteQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = supplierQuoteService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testSubmitQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("250.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);

        supplierQuoteService.submit(id);

        SupplierQuoteDetailVO vo = supplierQuoteService.getById(id);

        assertEquals("SUBMITTED", vo.getStatus());
    }

    @Test
    void testQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("300.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);
        supplierQuoteService.submit(id);

        supplierQuoteService.quote(id, new BigDecimal("280.00"));

        SupplierQuoteDetailVO vo = supplierQuoteService.getById(id);

        assertEquals("QUOTED", vo.getStatus());
        assertEquals("280.00", vo.getUnitPrice().toString());
    }

    @Test
    void testAcceptQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("350.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);
        supplierQuoteService.submit(id);
        supplierQuoteService.quote(id, new BigDecimal("330.00"));

        supplierQuoteService.accept(id);

        SupplierQuoteDetailVO vo = supplierQuoteService.getById(id);

        assertEquals("ACCEPTED", vo.getStatus());
    }

    @Test
    void testRejectQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("400.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);
        supplierQuoteService.submit(id);
        supplierQuoteService.quote(id, new BigDecimal("380.00"));

        supplierQuoteService.reject(id);

        SupplierQuoteDetailVO vo = supplierQuoteService.getById(id);

        assertEquals("REJECTED", vo.getStatus());
    }

    @Test
    void testDeleteDraftQuote() {
        SupplierQuoteCreateDTO createDTO = new SupplierQuoteCreateDTO();
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("450.00"));
        createDTO.setValidUntil(LocalDateTime.now().plusDays(30).toString());
        createDTO.setCurrency("CNY");

        Long id = supplierQuoteService.create(createDTO);

        supplierQuoteService.delete(id);

        assertThrows(Exception.class, () -> {
            supplierQuoteService.getById(id);
        });
    }

    @Test
    void testListBySupplier() {
        List<SupplierQuote> quotes = supplierQuoteService.listBySupplier(1L);

        assertNotNull(quotes);
    }

    @Test
    void testListByMaterial() {
        List<SupplierQuote> quotes = supplierQuoteService.listByMaterial(1L);

        assertNotNull(quotes);
    }

    @Test
    void testCountPending() {
        int count = supplierQuoteService.countPending();

        assertTrue(count >= 0);
    }
}
