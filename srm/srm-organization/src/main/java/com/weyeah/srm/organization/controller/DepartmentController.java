package com.weyeah.srm.organization.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.organization.dto.DepartmentCreateDTO;
import com.weyeah.srm.organization.dto.DepartmentQueryDTO;
import com.weyeah.srm.organization.dto.DepartmentUpdateDTO;
import com.weyeah.srm.organization.entity.OrgDepartment;
import com.weyeah.srm.organization.service.DepartmentService;
import com.weyeah.srm.organization.vo.DepartmentDetailVO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "部门管理", description = "部门相关接口")
@RestController
@RequestMapping("/api/organization/departments")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Operation(summary = "分页查询部门")
    @GetMapping
    public Result<PageResult<OrgDepartment>> queryPage(DepartmentQueryDTO queryDTO) {
        PageResult<OrgDepartment> page = departmentService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取所有部门")
    @GetMapping("/all")
    public Result<List<OrgDepartment>> listAll() {
        List<OrgDepartment> departments = departmentService.listAll();
        return Result.success(departments);
    }

    @Operation(summary = "获取子部门列表")
    @GetMapping("/children/{parentId}")
    public Result<List<OrgDepartment>> listChildren(@PathVariable Long parentId) {
        List<OrgDepartment> departments = departmentService.listChildren(parentId);
        return Result.success(departments);
    }

    @Operation(summary = "获取部门详情")
    @GetMapping("/{id}")
    public Result<DepartmentDetailVO> getById(@PathVariable Long id) {
        DepartmentDetailVO vo = departmentService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据编码获取部门")
    @GetMapping("/code/{code}")
    public Result<OrgDepartment> getByCode(@PathVariable String code) {
        OrgDepartment department = departmentService.getByCode(code);
        return Result.success(department);
    }

    @Operation(summary = "创建部门")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody DepartmentCreateDTO createDTO) {
        Long id = departmentService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新部门")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody DepartmentUpdateDTO updateDTO) {
        departmentService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "删除部门")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return Result.success();
    }
}
