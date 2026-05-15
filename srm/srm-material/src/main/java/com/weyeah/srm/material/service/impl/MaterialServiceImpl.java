package com.weyeah.srm.material.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.material.dto.MaterialCreateDTO;
import com.weyeah.srm.material.dto.MaterialQueryDTO;
import com.weyeah.srm.material.dto.MaterialUpdateDTO;
import com.weyeah.srm.material.entity.Material;
import com.weyeah.srm.material.mapper.MaterialMapper;
import com.weyeah.srm.material.service.MaterialService;
import com.weyeah.srm.types.enums.EMaterialStatus;
import com.weyeah.srm.types.enums.EMaterialUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialServiceImpl implements MaterialService {

    private final MaterialMapper materialMapper;

    @Override
    public PageResult<Material> queryPage(MaterialQueryDTO queryDTO) {
        Page<Material> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<Material> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("name", queryDTO.getKeyword())
                    .or().like("code", queryDTO.getKeyword())
                    .or().like("specification", queryDTO.getKeyword()));
        }

        if (StringUtils.hasText(queryDTO.getCategoryId())) {
            wrapper.eq("category_id", queryDTO.getCategoryId());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<Material> result = materialMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public Material getById(Long id) {
        Material material = materialMapper.selectById(id);
        if (material == null) {
            throw new BizException(404, "物料不存在");
        }
        return material;
    }

    @Override
    public Material getByCode(String code) {
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return materialMapper.selectOne(wrapper);
    }

    @Override
    public List<Material> listActive() {
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EMaterialStatus.ACTIVE.getCode());
        return materialMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(MaterialCreateDTO createDTO) {
        QueryWrapper<Material> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (materialMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "物料编码已存在");
        }

        Material material = new Material();
        BeanUtils.copyProperties(createDTO, material);

        material.setStatus(EMaterialStatus.ACTIVE);
        material.setUnit(EMaterialUnit.fromCode(createDTO.getUnit()));
        material.setCreateTime(LocalDateTime.now());

        materialMapper.insert(material);
        return material.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(MaterialUpdateDTO updateDTO) {
        Material material = getById(updateDTO.getId());

        BeanUtils.copyProperties(updateDTO, material);

        if (StringUtils.hasText(updateDTO.getUnit())) {
            material.setUnit(EMaterialUnit.fromCode(updateDTO.getUnit()));
        }

        if (StringUtils.hasText(updateDTO.getStatus())) {
            material.setStatus(EMaterialStatus.fromCode(updateDTO.getStatus()));
        }

        material.setUpdateTime(LocalDateTime.now());
        materialMapper.updateById(material);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        getById(id);
        materialMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        Material material = getById(id);
        material.setStatus(EMaterialStatus.fromCode(status));
        material.setUpdateTime(LocalDateTime.now());
        materialMapper.updateById(material);
    }
}
