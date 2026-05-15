package com.weyeah.srm.organization;

import com.weyeah.srm.organization.dto.DepartmentCreateDTO;
import com.weyeah.srm.organization.dto.DepartmentQueryDTO;
import com.weyeah.srm.organization.entity.OrgDepartment;
import com.weyeah.srm.organization.service.DepartmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class DepartmentServiceTest {

    @Autowired
    private DepartmentService departmentService;

    @Test
    void testCreateDepartment() {
        DepartmentCreateDTO createDTO = new DepartmentCreateDTO();
        createDTO.setCode("IT");
        createDTO.setName("信息技术部");
        createDTO.setType("DEPARTMENT");
        createDTO.setSortOrder(1);

        Long id = departmentService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByCode() {
        DepartmentCreateDTO createDTO = new DepartmentCreateDTO();
        createDTO.setCode("FINANCE");
        createDTO.setName("财务部");
        createDTO.setType("DEPARTMENT");

        Long id = departmentService.create(createDTO);

        OrgDepartment byCode = departmentService.getByCode("FINANCE");

        assertNotNull(byCode);
        assertEquals(id, byCode.getId());
    }

    @Test
    void testQueryPage() {
        DepartmentQueryDTO queryDTO = new DepartmentQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = departmentService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testListChildren() {
        DepartmentCreateDTO parentDTO = new DepartmentCreateDTO();
        parentDTO.setCode("COMPANY");
        parentDTO.setName("公司");
        parentDTO.setType("COMPANY");

        Long parentId = departmentService.create(parentDTO);

        DepartmentCreateDTO childDTO = new DepartmentCreateDTO();
        childDTO.setCode("IT2");
        childDTO.setName("信息技术部2");
        childDTO.setType("DEPARTMENT");
        childDTO.setParentId(parentId);

        departmentService.create(childDTO);

        var children = departmentService.listChildren(parentId);

        assertNotNull(children);
        assertEquals(1, children.size());
    }

    @Test
    void testDeleteDepartment() {
        DepartmentCreateDTO createDTO = new DepartmentCreateDTO();
        createDTO.setCode("MARKETING");
        createDTO.setName("市场部");
        createDTO.setType("DEPARTMENT");

        Long id = departmentService.create(createDTO);

        departmentService.delete(id);

        assertThrows(Exception.class, () -> {
            departmentService.getById(id);
        });
    }
}
