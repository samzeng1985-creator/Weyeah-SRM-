package com.weyeah.srm.pricing;

import com.weyeah.srm.pricing.dto.PricingQueryDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyCreateDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyUpdateDTO;
import com.weyeah.srm.pricing.entity.PricingStrategy;
import com.weyeah.srm.pricing.service.PricingStrategyService;
import com.weyeah.srm.pricing.vo.PricingStrategyDetailVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class PricingStrategyServiceTest {

    @Autowired
    private PricingStrategyService pricingStrategyService;

    @Test
    void testCreatePricingStrategy() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS001");
        createDTO.setName("测试定价策略");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setSupplierId(1L);
        createDTO.setUnitPrice(new BigDecimal("100.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        Long id = pricingStrategyService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByCode() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS002");
        createDTO.setName("测试策略2");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("200.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        pricingStrategyService.create(createDTO);

        PricingStrategy strategy = pricingStrategyService.getByCode("PS002");

        assertNotNull(strategy);
        assertEquals("测试策略2", strategy.getName());
        assertNotNull(strategy.getStatus());
    }

    @Test
    void testQueryPage() {
        PricingQueryDTO queryDTO = new PricingQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = pricingStrategyService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testUpdatePricingStrategy() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS003");
        createDTO.setName("原名称");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("300.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        Long id = pricingStrategyService.create(createDTO);

        PricingStrategyUpdateDTO updateDTO = new PricingStrategyUpdateDTO();
        updateDTO.setId(id);
        updateDTO.setName("新名称");
        updateDTO.setUnitPrice(new BigDecimal("350.00"));

        pricingStrategyService.update(updateDTO);

        PricingStrategyDetailVO vo = pricingStrategyService.getById(id);

        assertEquals("新名称", vo.getName());
        assertEquals("350.00", vo.getUnitPrice().toString());
    }

    @Test
    void testDeletePricingStrategy() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS004");
        createDTO.setName("待删除策略");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("400.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        Long id = pricingStrategyService.create(createDTO);

        pricingStrategyService.delete(id);

        assertThrows(Exception.class, () -> {
            pricingStrategyService.getById(id);
        });
    }

    @Test
    void testListActive() {
        List<PricingStrategy> activeStrategies = pricingStrategyService.listActive();

        assertNotNull(activeStrategies);
    }

    @Test
    void testCountActive() {
        int count = pricingStrategyService.countActive();

        assertTrue(count >= 0);
    }

    @Test
    void testActivateStrategy() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS005");
        createDTO.setName("待激活策略");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("500.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        Long id = pricingStrategyService.create(createDTO);

        pricingStrategyService.activate(id);

        PricingStrategyDetailVO vo = pricingStrategyService.getById(id);

        assertEquals("ACTIVE", vo.getStatus());
    }

    @Test
    void testExpireStrategy() {
        PricingStrategyCreateDTO createDTO = new PricingStrategyCreateDTO();
        createDTO.setCode("PS006");
        createDTO.setName("待过期策略");
        createDTO.setType("STANDARD");
        createDTO.setMaterialId(1L);
        createDTO.setUnitPrice(new BigDecimal("600.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));

        Long id = pricingStrategyService.create(createDTO);

        pricingStrategyService.activate(id);
        pricingStrategyService.expire(id);

        PricingStrategyDetailVO vo = pricingStrategyService.getById(id);

        assertEquals("EXPIRED", vo.getStatus());
    }
}
