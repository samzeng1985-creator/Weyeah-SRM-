package com.weyeah.srm.purchase;

import com.weyeah.srm.purchase.dto.PurchaseOrderCreateDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderQueryDTO;
import com.weyeah.srm.purchase.entity.PurchaseOrder;
import com.weyeah.srm.purchase.service.PurchaseOrderService;
import com.weyeah.srm.purchase.vo.PurchaseOrderDetailVO;
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
class PurchaseOrderServiceTest {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Test
    void testCreatePurchaseOrder() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("测试采购订单");
        createDTO.setType("STANDARD");
        createDTO.setSupplierId(1L);
        createDTO.setMaterialId(1L);
        createDTO.setQuantity(new BigDecimal("100"));
        createDTO.setUnitPrice(new BigDecimal("50.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(30));
        createDTO.setDeliveryAddress("上海市浦东新区");
        createDTO.setContactPerson("张三");
        createDTO.setContactPhone("13800138000");

        Long id = purchaseOrderService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByOrderNo() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("测试订单2");
        createDTO.setType("URGENT");
        createDTO.setSupplierId(1L);
        createDTO.setQuantity(new BigDecimal("50"));
        createDTO.setUnitPrice(new BigDecimal("100.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(7));

        Long id = purchaseOrderService.create(createDTO);
        PurchaseOrder created = purchaseOrderService.getById(id);

        PurchaseOrder byNo = purchaseOrderService.getByOrderNo(created.getOrderNo());

        assertNotNull(byNo);
        assertEquals(created.getId(), byNo.getId());
    }

    @Test
    void testQueryPage() {
        PurchaseOrderQueryDTO queryDTO = new PurchaseOrderQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = purchaseOrderService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testSubmitForApproval() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("待审批订单");
        createDTO.setType("STANDARD");
        createDTO.setSupplierId(1L);
        createDTO.setQuantity(new BigDecimal("200"));
        createDTO.setUnitPrice(new BigDecimal("30.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(14));

        Long id = purchaseOrderService.create(createDTO);

        purchaseOrderService.submitForApproval(id);

        PurchaseOrderDetailVO vo = purchaseOrderService.getById(id);

        assertEquals("PENDING_APPROVAL", vo.getStatus());
    }

    @Test
    void testApproveAndSendToSupplier() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("完整流程订单");
        createDTO.setType("STANDARD");
        createDTO.setSupplierId(1L);
        createDTO.setQuantity(new BigDecimal("300"));
        createDTO.setUnitPrice(new BigDecimal("25.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(21));

        Long id = purchaseOrderService.create(createDTO);

        purchaseOrderService.submitForApproval(id);
        purchaseOrderService.approve(id, "AP20240101001");
        purchaseOrderService.sendToSupplier(id);

        PurchaseOrderDetailVO vo = purchaseOrderService.getById(id);

        assertEquals("PENDING_SUPPLIER_CONFIRM", vo.getStatus());
    }

    @Test
    void testDeleteDraftOrder() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("待删除订单");
        createDTO.setType("SPOT");
        createDTO.setSupplierId(1L);
        createDTO.setQuantity(new BigDecimal("150"));
        createDTO.setUnitPrice(new BigDecimal("80.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(5));

        Long id = purchaseOrderService.create(createDTO);

        purchaseOrderService.delete(id);

        assertThrows(Exception.class, () -> {
            purchaseOrderService.getById(id);
        });
    }

    @Test
    void testListBySupplier() {
        List<PurchaseOrder> orders = purchaseOrderService.listBySupplier(1L);

        assertNotNull(orders);
    }

    @Test
    void testCountPending() {
        int count = purchaseOrderService.countPending();

        assertTrue(count >= 0);
    }

    @Test
    void testReceiveAndComplete() {
        PurchaseOrderCreateDTO createDTO = new PurchaseOrderCreateDTO();
        createDTO.setTitle("收货测试订单");
        createDTO.setType("STANDARD");
        createDTO.setSupplierId(1L);
        createDTO.setQuantity(new BigDecimal("100"));
        createDTO.setUnitPrice(new BigDecimal("40.00"));
        createDTO.setRequiredDate(LocalDate.now().plusDays(10));

        Long id = purchaseOrderService.create(createDTO);

        purchaseOrderService.submitForApproval(id);
        purchaseOrderService.approve(id, null);
        purchaseOrderService.sendToSupplier(id);
        purchaseOrderService.confirmBySupplier(id);
        purchaseOrderService.updateDeliveryInfo(id, LocalDate.now().plusDays(8).toString());
        purchaseOrderService.markAsDelivered(id);
        purchaseOrderService.receive(id, new BigDecimal("100"));
        purchaseOrderService.complete(id);

        PurchaseOrderDetailVO vo = purchaseOrderService.getById(id);

        assertEquals("COMPLETED", vo.getStatus());
    }
}
