package com.weyeah.srm.contract;

import com.weyeah.srm.contract.dto.ContractCreateDTO;
import com.weyeah.srm.contract.dto.ContractQueryDTO;
import com.weyeah.srm.contract.entity.Contract;
import com.weyeah.srm.contract.service.ContractService;
import com.weyeah.srm.contract.vo.ContractDetailVO;
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
class ContractServiceTest {

    @Autowired
    private ContractService contractService;

    @Test
    void testCreateContract() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("测试采购合同");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("100000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商A");

        Long id = contractService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByContractNo() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("测试合同2");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("200000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商B");

        Long id = contractService.create(createDTO);
        Contract created = contractService.getById(id);

        Contract byNo = contractService.getByContractNo(created.getContractNo());

        assertNotNull(byNo);
        assertEquals(created.getId(), byNo.getId());
    }

    @Test
    void testQueryPage() {
        ContractQueryDTO queryDTO = new ContractQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = contractService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testSubmitForReview() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("待审核合同");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("300000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商C");

        Long id = contractService.create(createDTO);

        contractService.submitForReview(id);

        ContractDetailVO vo = contractService.getById(id);

        assertEquals("PENDING_REVIEW", vo.getStatus());
    }

    @Test
    void testApproveAndSign() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("审批流程合同");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("400000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商D");

        Long id = contractService.create(createDTO);

        contractService.submitForReview(id);
        contractService.approve(id, null);
        contractService.sign(id);

        ContractDetailVO vo = contractService.getById(id);

        assertEquals("SIGNED", vo.getStatus());
    }

    @Test
    void testDeleteDraft() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("待删除合同");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("500000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商E");

        Long id = contractService.create(createDTO);

        contractService.delete(id);

        assertThrows(Exception.class, () -> {
            contractService.getById(id);
        });
    }

    @Test
    void testListActive() {
        List<Contract> active = contractService.listActive();

        assertNotNull(active);
    }

    @Test
    void testCountActive() {
        int count = contractService.countActive();

        assertTrue(count >= 0);
    }

    @Test
    void testTerminate() {
        ContractCreateDTO createDTO = new ContractCreateDTO();
        createDTO.setName("可终止合同");
        createDTO.setType("PURCHASE");
        createDTO.setSupplierId(1L);
        createDTO.setTotalAmount(new BigDecimal("600000.00"));
        createDTO.setEffectiveDate(LocalDate.now());
        createDTO.setExpiryDate(LocalDate.now().plusYears(1));
        createDTO.setPartyA("伟耀机械");
        createDTO.setPartyB("供应商F");

        Long id = contractService.create(createDTO);

        contractService.submitForReview(id);
        contractService.approve(id, null);
        contractService.sign(id);
        contractService.terminate(id, "业务调整");

        ContractDetailVO vo = contractService.getById(id);

        assertEquals("TERMINATED", vo.getStatus());
    }

}
