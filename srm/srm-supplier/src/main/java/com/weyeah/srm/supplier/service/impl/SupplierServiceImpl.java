package com.weyeah.srm.supplier.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.supplier.dto.SupplierCreateDTO;
import com.weyeah.srm.supplier.dto.SupplierQueryDTO;
import com.weyeah.srm.supplier.dto.SupplierUpdateDTO;
import com.weyeah.srm.supplier.entity.Supplier;
import com.weyeah.srm.supplier.mapper.SupplierMapper;
import com.weyeah.srm.supplier.service.SupplierService;
import com.weyeah.srm.supplier.vo.SupplierDetailVO;
import com.weyeah.srm.types.enums.ESupplierStatus;
import com.weyeah.srm.types.enums.ESupplierType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierMapper supplierMapper;

    @Override
    public PageResult<Supplier> queryPage(SupplierQueryDTO queryDTO) {
        Page<Supplier> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("name", queryDTO.getKeyword())
                    .or().like("code", queryDTO.getKeyword())
                    .or().like("contact_person", queryDTO.getKeyword()));
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            wrapper.eq("type", queryDTO.getType());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        if (StringUtils.hasText(queryDTO.getCountry())) {
            wrapper.eq("country", queryDTO.getCountry());
        }

        wrapper.orderByDesc("create_time");

        Page<Supplier> result = supplierMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public SupplierDetailVO getById(Long id) {
        Supplier supplier = supplierMapper.selectById(id);
        if (supplier == null) {
            throw new BizException(404, "供应商不存在");
        }
        return convertToDetailVO(supplier);
    }

    @Override
    public Supplier getByCode(String code) {
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return supplierMapper.selectOne(wrapper);
    }

    @Override
    public List<Supplier> listActive() {
        return supplierMapper.selectActiveSuppliers();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(SupplierCreateDTO createDTO) {
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (supplierMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "供应商编码已存在");
        }

        Supplier supplier = new Supplier();
        BeanUtils.copyProperties(createDTO, supplier);

        supplier.setStatus(ESupplierStatus.DRAFT);
        supplier.setType(ESupplierType.fromCode(createDTO.getType()));

        supplier.setCreateTime(LocalDateTime.now());

        supplierMapper.insert(supplier);

        return supplier.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(SupplierUpdateDTO updateDTO) {
        Supplier supplier = supplierMapper.selectById(updateDTO.getId());
        if (supplier == null) {
            throw new BizException(404, "供应商不存在");
        }

        BeanUtils.copyProperties(updateDTO, supplier);

        if (StringUtils.hasText(updateDTO.getType())) {
            supplier.setType(ESupplierType.fromCode(updateDTO.getType()));
        }

        if (StringUtils.hasText(updateDTO.getStatus())) {
            supplier.setStatus(ESupplierStatus.fromCode(updateDTO.getStatus()));
        }

        supplier.setUpdateTime(LocalDateTime.now());

        supplierMapper.updateById(supplier);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        Supplier supplier = supplierMapper.selectById(id);
        if (supplier == null) {
            throw new BizException(404, "供应商不存在");
        }

        supplier.setStatus(ESupplierStatus.fromCode(status));
        supplier.setUpdateTime(LocalDateTime.now());

        supplierMapper.updateById(supplier);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Supplier supplier = supplierMapper.selectById(id);
        if (supplier == null) {
            throw new BizException(404, "供应商不存在");
        }

        if (supplier.getStatus() == ESupplierStatus.ACTIVE) {
            throw new BizException(400, "已生效的供应商不能删除，请先冻结");
        }

        supplierMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void review(Long id, String pass) {
        Supplier supplier = supplierMapper.selectById(id);
        if (supplier == null) {
            throw new BizException(404, "供应商不存在");
        }

        if (supplier.getStatus() != ESupplierStatus.PENDING_REVIEW) {
            throw new BizException(400, "供应商当前状态不允许审核");
        }

        if ("true".equals(pass)) {
            supplier.setStatus(ESupplierStatus.ACTIVE);
        } else {
            supplier.setStatus(ESupplierStatus.FROZEN);
        }

        supplier.setUpdateTime(LocalDateTime.now());

        supplierMapper.updateById(supplier);
    }

    @Override
    public int countActive() {
        return supplierMapper.countByStatus(ESupplierStatus.ACTIVE.getCode());
    }

    private SupplierDetailVO convertToDetailVO(Supplier supplier) {
        SupplierDetailVO vo = new SupplierDetailVO();
        BeanUtils.copyProperties(supplier, vo);

        if (supplier.getType() != null) {
            vo.setType(supplier.getType().getCode());
            vo.setTypeDesc(supplier.getType().getDesc());
        }

        if (supplier.getStatus() != null) {
            vo.setStatus(supplier.getStatus().getCode());
            vo.setStatusDesc(supplier.getStatus().getDesc());
        }

        if (supplier.getCreateTime() != null) {
            vo.setCreateTime(supplier.getCreateTime().toString());
        }

        if (supplier.getUpdateTime() != null) {
            vo.setUpdateTime(supplier.getUpdateTime().toString());
        }

        return vo;
    }
}
