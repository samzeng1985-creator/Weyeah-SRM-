package com.weyeah.srm.pricing.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.pricing.dto.QuoteQueryDTO;
import com.weyeah.srm.pricing.dto.SupplierQuoteCreateDTO;
import com.weyeah.srm.pricing.entity.SupplierQuote;
import com.weyeah.srm.pricing.mapper.SupplierQuoteMapper;
import com.weyeah.srm.pricing.service.SupplierQuoteService;
import com.weyeah.srm.pricing.vo.SupplierQuoteDetailVO;
import com.weyeah.srm.types.enums.EQuoteStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierQuoteServiceImpl implements SupplierQuoteService {

    private final SupplierQuoteMapper supplierQuoteMapper;

    @Override
    public PageResult<SupplierQuote> queryPage(QuoteQueryDTO queryDTO) {
        Page<SupplierQuote> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<SupplierQuote> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("quote_number", queryDTO.getKeyword())
                    .or().like("remark", queryDTO.getKeyword()));
        }

        if (StringUtils.hasText(queryDTO.getSupplierId())) {
            wrapper.eq("supplier_id", queryDTO.getSupplierId());
        }

        if (StringUtils.hasText(queryDTO.getMaterialId())) {
            wrapper.eq("material_id", queryDTO.getMaterialId());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<SupplierQuote> result = supplierQuoteMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public SupplierQuoteDetailVO getById(Long id) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }
        return convertToDetailVO(quote);
    }

    @Override
    public SupplierQuote getByQuoteNumber(String quoteNumber) {
        QueryWrapper<SupplierQuote> wrapper = new QueryWrapper<>();
        wrapper.eq("quote_number", quoteNumber);
        return supplierQuoteMapper.selectOne(wrapper);
    }

    @Override
    public List<SupplierQuote> listBySupplier(Long supplierId) {
        QueryWrapper<SupplierQuote> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId);
        wrapper.orderByDesc("create_time");
        return supplierQuoteMapper.selectList(wrapper);
    }

    @Override
    public List<SupplierQuote> listByMaterial(Long materialId) {
        QueryWrapper<SupplierQuote> wrapper = new QueryWrapper<>();
        wrapper.eq("material_id", materialId);
        wrapper.orderByDesc("create_time");
        return supplierQuoteMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(SupplierQuoteCreateDTO createDTO) {
        SupplierQuote quote = new SupplierQuote();
        BeanUtils.copyProperties(createDTO, quote);

        quote.setQuoteNumber(generateQuoteNumber());
        quote.setStatus(EQuoteStatus.DRAFT);
        quote.setQuoteDate(LocalDateTime.now());
        quote.setValidUntil(LocalDateTime.parse(createDTO.getValidUntil(),
                DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        quote.setCreateTime(LocalDateTime.now());

        if (quote.getUnitPrice() != null && quote.getMinOrderQuantity() != null) {
            quote.setTotalAmount(quote.getUnitPrice().multiply(quote.getMinOrderQuantity()));
        }

        supplierQuoteMapper.insert(quote);

        return quote.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submit(Long id) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }

        if (quote.getStatus() != EQuoteStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的报价可以提交");
        }

        quote.setStatus(EQuoteStatus.SUBMITTED);
        quote.setUpdateTime(LocalDateTime.now());

        supplierQuoteMapper.updateById(quote);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void quote(Long id, BigDecimal price) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }

        if (quote.getStatus() != EQuoteStatus.SUBMITTED) {
            throw new BizException(400, "只有已提交的报价可以报价");
        }

        quote.setUnitPrice(price);
        quote.setStatus(EQuoteStatus.QUOTED);
        quote.setUpdateTime(LocalDateTime.now());

        if (quote.getMinOrderQuantity() != null) {
            quote.setTotalAmount(price.multiply(quote.getMinOrderQuantity()));
        }

        supplierQuoteMapper.updateById(quote);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void accept(Long id) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }

        if (quote.getStatus() != EQuoteStatus.QUOTED) {
            throw new BizException(400, "只有已报价的可以接受");
        }

        quote.setStatus(EQuoteStatus.ACCEPTED);
        quote.setUpdateTime(LocalDateTime.now());

        supplierQuoteMapper.updateById(quote);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reject(Long id) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }

        if (quote.getStatus() != EQuoteStatus.QUOTED) {
            throw new BizException(400, "只有已报价的可以拒绝");
        }

        quote.setStatus(EQuoteStatus.REJECTED);
        quote.setUpdateTime(LocalDateTime.now());

        supplierQuoteMapper.updateById(quote);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        SupplierQuote quote = supplierQuoteMapper.selectById(id);
        if (quote == null) {
            throw new BizException(404, "供应商报价不存在");
        }

        if (quote.getStatus() != EQuoteStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的报价可以删除");
        }

        supplierQuoteMapper.deleteById(id);
    }

    @Override
    public int countPending() {
        QueryWrapper<SupplierQuote> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EQuoteStatus.SUBMITTED.getCode());
        return supplierQuoteMapper.selectCount(wrapper).intValue();
    }

    private String generateQuoteNumber() {
        return "QT" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private SupplierQuoteDetailVO convertToDetailVO(SupplierQuote quote) {
        SupplierQuoteDetailVO vo = new SupplierQuoteDetailVO();
        BeanUtils.copyProperties(quote, vo);

        if (quote.getStatus() != null) {
            vo.setStatus(quote.getStatus().getCode());
            vo.setStatusDesc(quote.getStatus().getDesc());
        }

        if (quote.getCreateTime() != null) {
            vo.setCreateTime(quote.getCreateTime().toString());
        }

        if (quote.getUpdateTime() != null) {
            vo.setUpdateTime(quote.getUpdateTime().toString());
        }

        if (quote.getQuoteDate() != null) {
            vo.setQuoteDate(quote.getQuoteDate().toString());
        }

        if (quote.getValidUntil() != null) {
            vo.setValidUntil(quote.getValidUntil().toString());
        }

        return vo;
    }
}
