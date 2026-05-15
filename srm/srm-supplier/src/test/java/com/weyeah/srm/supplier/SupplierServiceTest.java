package com.weyeah.srm.supplier;

import com.weyeah.srm.supplier.dto.SupplierCreateDTO;
import com.weyeah.srm.supplier.dto.SupplierQueryDTO;
import com.weyeah.srm.supplier.dto.SupplierUpdateDTO;
import com.weyeah.srm.supplier.entity.Supplier;
import com.weyeah.srm.supplier.service.SupplierService;
import com.weyeah.srm.supplier.vo.SupplierDetailVO;
import com.weyeah.srm.types.enums.ESupplierStatus;
import com.weyeah.srm.types.enums.ESupplierType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class SupplierServiceTest {

    @Autowired
    private SupplierService supplierService;

    @Test
    void testCreateSupplier() {
        SupplierCreateDTO createDTO = new SupplierCreateDTO();
        createDTO.setCode("SUP001");
        createDTO.setName("测试供应商");
        createDTO.setShortName("测试");
        createDTO.setType("DOMESTIC");
        createDTO.setCountry("中国");
        createDTO.setCity("上海");
        createDTO.setContactPerson("张三");
        createDTO.setContactPhone("13800138000");
        createDTO.setContactEmail("test@example.com");
        createDTO.setAnnualCapacity(new BigDecimal("1000000"));
        createDTO.setMainProducts("发电机零件");
        createDTO.setRemark("测试供应商备注");

        Long id = supplierService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByCode() {
        SupplierCreateDTO createDTO = new SupplierCreateDTO();
        createDTO.setCode("SUP002");
        createDTO.setName("测试供应商2");
        createDTO.setType("DOMESTIC");

        supplierService.create(createDTO);

        Supplier supplier = supplierService.getByCode("SUP002");

        assertNotNull(supplier);
        assertEquals("测试供应商2", supplier.getName());
        assertEquals(ESupplierStatus.DRAFT, supplier.getStatus());
    }

    @Test
    void testQueryPage() {
        SupplierQueryDTO queryDTO = new SupplierQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = supplierService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testUpdateSupplier() {
        SupplierCreateDTO createDTO = new SupplierCreateDTO();
        createDTO.setCode("SUP003");
        createDTO.setName("原名称");
        createDTO.setType("DOMESTIC");

        Long id = supplierService.create(createDTO);

        SupplierUpdateDTO updateDTO = new SupplierUpdateDTO();
        updateDTO.setId(id);
        updateDTO.setName("新名称");
        updateDTO.setStatus("ACTIVE");

        supplierService.update(updateDTO);

        SupplierDetailVO vo = supplierService.getById(id);

        assertEquals("新名称", vo.getName());
        assertEquals("ACTIVE", vo.getStatus());
    }

    @Test
    void testDeleteSupplier() {
        SupplierCreateDTO createDTO = new SupplierCreateDTO();
        createDTO.setCode("SUP004");
        createDTO.setName("待删除供应商");
        createDTO.setType("DOMESTIC");

        Long id = supplierService.create(createDTO);

        supplierService.delete(id);

        assertThrows(Exception.class, () -> {
            supplierService.getById(id);
        });
    }

    @Test
    void testListActive() {
        List<Supplier> activeSuppliers = supplierService.listActive();

        assertNotNull(activeSuppliers);
    }

    @Test
    void testCountActive() {
        int count = supplierService.countActive();

        assertTrue(count >= 0);
    }

    @Test
    void testReviewPass() {
        SupplierCreateDTO createDTO = new SupplierCreateDTO();
        createDTO.setCode("SUP005");
        createDTO.setName("待审核供应商");
        createDTO.setType("DOMESTIC");

        Long id = supplierService.create(createDTO);

        SupplierUpdateDTO updateDTO = new SupplierUpdateDTO();
        updateDTO.setId(id);
        updateDTO.setStatus("PENDING_REVIEW");
        supplierService.update(updateDTO);

        supplierService.review(id, "true");

        SupplierDetailVO vo = supplierService.getById(id);

        assertEquals("ACTIVE", vo.getStatus());
    }
}
