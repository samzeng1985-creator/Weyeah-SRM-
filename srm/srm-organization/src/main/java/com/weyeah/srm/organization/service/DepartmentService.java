package com.weyeah.srm.organization.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.organization.dto.DepartmentCreateDTO;
import com.weyeah.srm.organization.dto.DepartmentQueryDTO;
import com.weyeah.srm.organization.dto.DepartmentUpdateDTO;
import com.weyeah.srm.organization.entity.OrgDepartment;
import com.weyeah.srm.organization.vo.DepartmentDetailVO;

import java.util.List;

public interface DepartmentService {

    PageResult<OrgDepartment> queryPage(DepartmentQueryDTO queryDTO);

    List<OrgDepartment> listAll();

    List<OrgDepartment> listChildren(Long parentId);

    DepartmentDetailVO getById(Long id);

    OrgDepartment getByCode(String code);

    Long create(DepartmentCreateDTO createDTO);

    void update(DepartmentUpdateDTO updateDTO);

    void delete(Long id);
}
