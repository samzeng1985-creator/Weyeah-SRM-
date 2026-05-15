package com.weyeah.srm.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.material.dto.MaterialCategoryCreateDTO;
import com.weyeah.srm.material.entity.MaterialCategory;
import com.weyeah.srm.material.mapper.MaterialCategoryMapper;
import com.weyeah.srm.material.service.MaterialCategoryService;
import com.weyeah.srm.types.enums.ECategoryStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialCategoryServiceImpl implements MaterialCategoryService {

    private final MaterialCategoryMapper categoryMapper;

    @Override
    public List<MaterialCategory> getTree() {
        QueryWrapper<MaterialCategory> wrapper = new QueryWrapper<>();
        wrapper.orderByAsc("level", "sort_order");
        List<MaterialCategory> allCategories = categoryMapper.selectList(wrapper);

        return buildTree(allCategories, null);
    }

    private List<MaterialCategory> buildTree(List<MaterialCategory> allCategories, Long parentId) {
        return allCategories.stream()
                .filter(c -> (parentId == null && c.getParentId() == null)
                        || (parentId != null && parentId.equals(c.getParentId())))
                .collect(Collectors.toList());
    }

    @Override
    public MaterialCategory getById(Long id) {
        MaterialCategory category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BizException(404, "分类不存在");
        }
        return category;
    }

    @Override
    public MaterialCategory getByCode(String code) {
        QueryWrapper<MaterialCategory> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return categoryMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(MaterialCategoryCreateDTO createDTO) {
        QueryWrapper<MaterialCategory> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "分类编码已存在");
        }

        MaterialCategory category = new MaterialCategory();
        BeanUtils.copyProperties(createDTO, category);

        category.setStatus(ECategoryStatus.ACTIVE);
        category.setCreateTime(LocalDateTime.now());

        if (createDTO.getParentId() != null) {
            MaterialCategory parent = getById(createDTO.getParentId());
            category.setLevel(parent.getLevel() + 1);
        } else {
            category.setLevel(1);
        }

        categoryMapper.insert(category);
        return category.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Long id, MaterialCategoryCreateDTO updateDTO) {
        MaterialCategory category = getById(id);

        if (StringUtils.hasText(updateDTO.getCode()) && !updateDTO.getCode().equals(category.getCode())) {
            QueryWrapper<MaterialCategory> wrapper = new QueryWrapper<>();
            wrapper.eq("code", updateDTO.getCode());
            if (categoryMapper.selectCount(wrapper) > 0) {
                throw new BizException(400, "分类编码已存在");
            }
            category.setCode(updateDTO.getCode());
        }

        if (StringUtils.hasText(updateDTO.getName())) {
            category.setName(updateDTO.getName());
        }

        if (updateDTO.getSortOrder() != null) {
            category.setSortOrder(updateDTO.getSortOrder());
        }

        if (updateDTO.getDescription() != null) {
            category.setDescription(updateDTO.getDescription());
        }

        category.setUpdateTime(LocalDateTime.now());
        categoryMapper.updateById(category);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        getById(id);

        QueryWrapper<MaterialCategory> wrapper = new QueryWrapper<>();
        wrapper.eq("parent_id", id);
        if (categoryMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "该分类下存在子分类，无法删除");
        }

        categoryMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        MaterialCategory category = getById(id);
        category.setStatus(ECategoryStatus.fromCode(status));
        category.setUpdateTime(LocalDateTime.now());
        categoryMapper.updateById(category);
    }
}
