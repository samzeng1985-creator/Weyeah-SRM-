package com.weyeah.srm.contract.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.contract.dto.ContractTemplateCreateDTO;
import com.weyeah.srm.contract.entity.ContractTemplate;
import com.weyeah.srm.contract.mapper.ContractTemplateMapper;
import com.weyeah.srm.contract.service.ContractTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractTemplateServiceImpl implements ContractTemplateService {

    private final ContractTemplateMapper contractTemplateMapper;

    @Override
    public List<ContractTemplate> listAll() {
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("create_time");
        return contractTemplateMapper.selectList(wrapper);
    }

    @Override
    public ContractTemplate getById(Long id) {
        ContractTemplate template = contractTemplateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "合同模板不存在");
        }
        return template;
    }

    @Override
    public ContractTemplate getByCode(String code) {
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return contractTemplateMapper.selectOne(wrapper);
    }

    @Override
    public ContractTemplate getDefault() {
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("is_default", true);
        return contractTemplateMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ContractTemplateCreateDTO createDTO) {
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (contractTemplateMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "模板编码已存在");
        }

        ContractTemplate template = new ContractTemplate();
        BeanUtils.copyProperties(createDTO, template);

        if (template.getIsDefault() == null) {
            template.setIsDefault(false);
        }

        template.setCreateTime(LocalDateTime.now());

        if (template.getIsDefault()) {
            removeDefaultMark();
        }

        contractTemplateMapper.insert(template);

        return template.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ContractTemplate template) {
        ContractTemplate exist = contractTemplateMapper.selectById(template.getId());
        if (exist == null) {
            throw new BizException(404, "合同模板不存在");
        }

        template.setUpdateTime(LocalDateTime.now());

        if (template.getIsDefault() != null && template.getIsDefault()) {
            removeDefaultMark();
        }

        contractTemplateMapper.updateById(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void setDefault(Long id) {
        ContractTemplate template = contractTemplateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "合同模板不存在");
        }

        removeDefaultMark();

        template.setIsDefault(true);
        template.setUpdateTime(LocalDateTime.now());
        contractTemplateMapper.updateById(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        ContractTemplate template = contractTemplateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "合同模板不存在");
        }

        if (template.getIsDefault() != null && template.getIsDefault()) {
            throw new BizException(400, "默认模板不能删除");
        }

        contractTemplateMapper.deleteById(id);
    }

    private void removeDefaultMark() {
        QueryWrapper<ContractTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("is_default", true);
        List<ContractTemplate> templates = contractTemplateMapper.selectList(wrapper);
        for (ContractTemplate t : templates) {
            t.setIsDefault(false);
            t.setUpdateTime(LocalDateTime.now());
            contractTemplateMapper.updateById(t);
        }
    }

}
