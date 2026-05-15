package com.weyeah.srm.workflow;

import com.weyeah.srm.workflow.dto.WorkflowDefinitionCreateDTO;
import com.weyeah.srm.workflow.dto.WorkflowStartDTO;
import com.weyeah.srm.workflow.entity.WorkflowDefinition;
import com.weyeah.srm.workflow.entity.WorkflowInstance;
import com.weyeah.srm.workflow.service.WorkflowService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class WorkflowServiceTest {

    @Autowired
    private WorkflowService workflowService;

    @Test
    void testCreateDefinition() {
        WorkflowDefinitionCreateDTO createDTO = new WorkflowDefinitionCreateDTO();
        createDTO.setCode("PO_APPROVAL");
        createDTO.setName("采购订单审批流程");
        createDTO.setType("PURCHASE_ORDER");
        createDTO.setIsActive(false);

        Long id = workflowService.createDefinition(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testEnableDefinition() {
        WorkflowDefinitionCreateDTO createDTO = new WorkflowDefinitionCreateDTO();
        createDTO.setCode("CONTRACT_APPROVAL");
        createDTO.setName("合同审批流程");
        createDTO.setType("CONTRACT");
        createDTO.setIsActive(false);

        Long id = workflowService.createDefinition(createDTO);

        workflowService.enableDefinition(id);

        WorkflowDefinition definition = workflowService.getInstanceById(id);
        assertNotNull(definition);
    }

    @Test
    void testStartWorkflow() {
        WorkflowDefinitionCreateDTO defDTO = new WorkflowDefinitionCreateDTO();
        defDTO.setCode("TEST_WF");
        defDTO.setName("测试流程");
        defDTO.setType("CUSTOM");
        defDTO.setIsActive(true);

        Long defId = workflowService.createDefinition(defDTO);

        WorkflowStartDTO startDTO = new WorkflowStartDTO();
        startDTO.setDefinitionId(defId);
        startDTO.setBusinessType("PURCHASE_ORDER");
        startDTO.setBusinessId(1001L);
        startDTO.setApplicantId(1L);
        startDTO.setApplicantName("测试用户");

        WorkflowInstance instance = workflowService.startWorkflow(startDTO);

        assertNotNull(instance);
        assertNotNull(instance.getInstanceNo());
        assertEquals("PENDING", instance.getStatus().getCode());
    }

    @Test
    void testGetInstanceByBusiness() {
        WorkflowDefinitionCreateDTO defDTO = new WorkflowDefinitionCreateDTO();
        defDTO.setCode("PO_WF");
        defDTO.setName("采购流程");
        defDTO.setType("PURCHASE_ORDER");
        defDTO.setIsActive(true);

        Long defId = workflowService.createDefinition(defDTO);

        WorkflowStartDTO startDTO = new WorkflowStartDTO();
        startDTO.setDefinitionId(defId);
        startDTO.setBusinessType("PURCHASE_ORDER");
        startDTO.setBusinessId(2001L);
        startDTO.setApplicantId(1L);
        startDTO.setApplicantName("张三");

        WorkflowInstance instance = workflowService.startWorkflow(startDTO);

        WorkflowInstance found = workflowService.getInstanceByBusiness("PURCHASE_ORDER", 2001L);

        assertNotNull(found);
        assertEquals(instance.getId(), found.getId());
    }
}
