package com.weyeah.srm.pricing.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.pricing.dto.PricingQueryDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyCreateDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyUpdateDTO;
import com.weyeah.srm.pricing.entity.PriceHistory;
import com.weyeah.srm.pricing.entity.PricingStrategy;
import com.weyeah.srm.pricing.mapper.PriceHistoryMapper;
import com.weyeah.srm.pricing.mapper.PricingStrategyMapper;
import com.weyeah.srm.pricing.service.PricingStrategyService;
import com.weyeah.srm.pricing.vo.PricingStrategyDetailVO;
import com.weyeah.srm.types.enums.EPricingStatus;
import com.weyeah.srm.types.enums.EPricingType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PricingStrategyServiceImpl implements PricingStrategyService {

    private final PricingStrategyMapper pricingStrategyMapper;
    private final PriceHistoryMapper priceHistoryMapper;

    @Override
    public PageResult<PricingStrategy> queryPage(PricingQueryDTO queryDTO) {
        Page<PricingStrategy> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("name", queryDTO.getKeyword())
                    .or().like("code", queryDTO.getKeyword()));
        }

        if (StringUtils.hasText(queryDTO.getMaterialId())) {
            wrapper.eq("material_id", queryDTO.getMaterialId());
        }

        if (StringUtils.hasText(queryDTO.getSupplierId())) {
            wrapper.eq("supplier_id", queryDTO.getSupplierId());
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            wrapper.eq("type", queryDTO.getType());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<PricingStrategy> result = pricingStrategyMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public PricingStrategyDetailVO getById(Long id) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }
        return convertToDetailVO(strategy);
    }

    @Override
    public PricingStrategy getByCode(String code) {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return pricingStrategyMapper.selectOne(wrapper);
    }

    @Override
    public java.util.List<PricingStrategy> listActive() {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EPricingStatus.ACTIVE.getCode());
        wrapper.gt("expiry_date", LocalDate.now());
        wrapper.orderByDesc("create_time");
        return pricingStrategyMapper.selectList(wrapper);
    }

    @Override
    public java.util.List<PricingStrategy> listByMaterial(Long materialId) {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("material_id", materialId);
        wrapper.eq("status", EPricingStatus.ACTIVE.getCode());
        wrapper.gt("expiry_date", LocalDate.now());
        return pricingStrategyMapper.selectList(wrapper);
    }

    @Override
    public java.util.List<PricingStrategy> listBySupplier(Long supplierId) {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId);
        wrapper.eq("status", EPricingStatus.ACTIVE.getCode());
        wrapper.gt("expiry_date", LocalDate.now());
        return pricingStrategyMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(PricingStrategyCreateDTO createDTO) {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("code", createDTO.getCode());
        if (pricingStrategyMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "策略编码已存在");
        }

        PricingStrategy strategy = new PricingStrategy();
        BeanUtils.copyProperties(createDTO, strategy);

        strategy.setType(EPricingType.fromCode(createDTO.getType()));
        strategy.setStatus(EPricingStatus.DRAFT);
        strategy.setCreateTime(LocalDateTime.now());

        pricingStrategyMapper.insert(strategy);

        PriceHistory history = new PriceHistory();
        history.setPricingStrategyId(strategy.getId());
        history.setOldPrice(null);
        history.setNewPrice(strategy.getUnitPrice());
        history.setChangeType("CREATE");
        history.setCreateTime(LocalDateTime.now());
        priceHistoryMapper.insert(history);

        return strategy.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(PricingStrategyUpdateDTO updateDTO) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(updateDTO.getId());
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }

        BigDecimal oldPrice = strategy.getUnitPrice();

        BeanUtils.copyProperties(updateDTO, strategy);

        if (StringUtils.hasText(updateDTO.getStatus())) {
            strategy.setStatus(EPricingStatus.fromCode(updateDTO.getStatus()));
        }

        strategy.setUpdateTime(LocalDateTime.now());

        pricingStrategyMapper.updateById(strategy);

        if (updateDTO.getUnitPrice() != null && !updateDTO.getUnitPrice().equals(oldPrice)) {
            PriceHistory history = new PriceHistory();
            history.setPricingStrategyId(strategy.getId());
            history.setOldPrice(oldPrice);
            history.setNewPrice(updateDTO.getUnitPrice());
            history.setChangeType("UPDATE");
            history.setCreateTime(LocalDateTime.now());
            priceHistoryMapper.insert(history);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }

        strategy.setStatus(EPricingStatus.fromCode(status));
        strategy.setUpdateTime(LocalDateTime.now());

        pricingStrategyMapper.updateById(strategy);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }

        if (strategy.getStatus() == EPricingStatus.ACTIVE) {
            throw new BizException(400, "已生效的策略不能删除");
        }

        pricingStrategyMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void activate(Long id) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }

        if (strategy.getStatus() != EPricingStatus.DRAFT
                && strategy.getStatus() != EPricingStatus.PENDING_APPROVAL) {
            throw new BizException(400, "当前状态不允许激活");
        }

        strategy.setStatus(EPricingStatus.ACTIVE);
        strategy.setUpdateTime(LocalDateTime.now());

        pricingStrategyMapper.updateById(strategy);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void expire(Long id) {
        PricingStrategy strategy = pricingStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new BizException(404, "定价策略不存在");
        }

        strategy.setStatus(EPricingStatus.EXPIRED);
        strategy.setUpdateTime(LocalDateTime.now());

        pricingStrategyMapper.updateById(strategy);
    }

    @Override
    public int countActive() {
        QueryWrapper<PricingStrategy> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EPricingStatus.ACTIVE.getCode());
        return pricingStrategyMapper.selectCount(wrapper).intValue();
    }

    private PricingStrategyDetailVO convertToDetailVO(PricingStrategy strategy) {
        PricingStrategyDetailVO vo = new PricingStrategyDetailVO();
        BeanUtils.copyProperties(strategy, vo);

        if (strategy.getType() != null) {
            vo.setType(strategy.getType().getCode());
            vo.setTypeDesc(strategy.getType().getDesc());
        }

        if (strategy.getStatus() != null) {
            vo.setStatus(strategy.getStatus().getCode());
            vo.setStatusDesc(strategy.getStatus().getDesc());
        }

        if (strategy.getCreateTime() != null) {
            vo.setCreateTime(strategy.getCreateTime().toString());
        }

        if (strategy.getUpdateTime() != null) {
            vo.setUpdateTime(strategy.getUpdateTime().toString());
        }

        return vo;
    }
}
