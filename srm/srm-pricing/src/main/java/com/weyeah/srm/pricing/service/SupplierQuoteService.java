package com.weyeah.srm.pricing.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.pricing.dto.QuoteQueryDTO;
import com.weyeah.srm.pricing.dto.SupplierQuoteCreateDTO;
import com.weyeah.srm.pricing.entity.SupplierQuote;
import com.weyeah.srm.pricing.vo.SupplierQuoteDetailVO;

import java.util.List;

public interface SupplierQuoteService {

    PageResult<SupplierQuote> queryPage(QuoteQueryDTO queryDTO);

    SupplierQuoteDetailVO getById(Long id);

    SupplierQuote getByQuoteNumber(String quoteNumber);

    List<SupplierQuote> listBySupplier(Long supplierId);

    List<SupplierQuote> listByMaterial(Long materialId);

    Long create(SupplierQuoteCreateDTO createDTO);

    void submit(Long id);

    void quote(Long id, java.math.BigDecimal price);

    void accept(Long id);

    void reject(Long id);

    void delete(Long id);

    int countPending();
}
