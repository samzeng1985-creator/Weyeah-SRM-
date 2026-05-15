package com.weyeah.srm.organization.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.organization.dto.DepartmentCreateDTO;
import com.weyeah.srm.organization.dto.DepartmentQueryDTO;
import com.weyeah.srm.organization.dto.DepartmentUpdateDTO;
import com.weyeah.srm.organization.entity.OrgDepartment;
import com.weyeah.srm.organization.mapper.OrgDepartmentMapper;
import com.weyeah.srm.organization.service.DepartmentService;
import com.weyeah.srm.organization.vo.DepartmentDetailVO;
import com.weyeah.srm.types.enums.EOrgType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final OrgDepartmentMapper departmentMapper;

    @Override
    public PageResult<OrgDepartment> queryPage(DepartmentQueryDTO queryDTO) {
        Page<OrgDepartment> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<OrgDepartment> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("name", queryDTO.getKeyword())
                    .or().like("code", queryDTO.getKeyword()));
        }

        if (queryDTO.getParentId() != null) {
            wrapper.eq("parent_id", queryDTO.getParentId());
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            wrapper.eq("type", queryDTO.getType());
        }

        wrapper.orderByAsc("sort_order").orderByDesc("create_time");

        Page<OrgDepartment> result = departmentMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public List<OrgDepartment> listAll() {
        QueryWrapper<OrgDepartment> wrapper = new QueryWrapper<>();
        wrapper.orderByAsc("sort_order").orderByDesc("create_time");
        return departmentMapper.selectList(wrapper);
    }

    @Override
    public List<OrgDepartment> listChildren(Long parentId) {
        QueryWrapper<OrgDepartment> wrapper = new QueryWrapper<>();
        wrapper.eq("parent_id", parentId);
        wrapper.orderByAsc("sort_order").orderByDesc("create_time");
        return departmentMapper.selectList(wrapper);
    }

    @Override
    public DepartmentDetailVO getById(Long id) {
        OrgDepartment department = departmentMapper.selectById(id);
        if (department == null) {
            throw new BizException(404, "部门不存在");
        }
        return convertToDetailVO(department);
    }

    @Override
    public OrgDepartment getByCode(String code) {
        QueryWrapper<OrgDepartment> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return departmentMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(DepartmentCreateDTO createDTO) {
        QueryWrapper<OrgDepartment> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (departmentMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "部门编码已存在");
        }

        OrgDepartment department = new OrgDepartment();
        BeanUtils.copyProperties(createDTO, department);

        department.setType(EOrgType.fromCode(createDTO.getType()));
        department.setCreateTime(LocalDateTime.now());

        departmentMapper.insert(department);

        return department.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(DepartmentUpdateDTO updateDTO) {
        OrgDepartment department = departmentMapper.selectById(updateDTO.getId());
        if (department == null) {
            throw new BizException(404, "部门不存在");
        }

        BeanUtils.copyProperties(updateDTO, department);
        department.setUpdateTime(LocalDateTime.now());

        departmentMapper.updateById(department);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        OrgDepartment department = departmentMapper.selectById(id);
        if (department == null) {
            throw new BizException(404, "部门不存在");
        }

        QueryWrapper<OrgDepartment> childWrapper = new QueryWrapper<>();
        childWrapper.eq("parent_id", id);
        if (departmentMapper.selectCount(childWrapper) > 0) {
            throw new BizException(400, "该部门下还有子部门，无法删除");
        }

        departmentMapper.deleteById(id);
    }

    private DepartmentDetailVO convertToDetailVO(OrgDepartment department) {
        DepartmentDetailVO vo = new DepartmentDetailVO();
        BeanUtils.copyProperties(department, vo);

        if (department.getType() != null) {
            vo.setType(department.getType().getCode());
            vo.setTypeDesc(department.getType().getDesc());
        }

        if (department.getCreateTime() != null) {
            vo.setCreateTime(department.getCreateTime().toString());
        }

        if (department.getUpdateTime() != null) {
            vo.setUpdateTime(department.getUpdateTime().toString());
        }

        return vo;
    }
}
