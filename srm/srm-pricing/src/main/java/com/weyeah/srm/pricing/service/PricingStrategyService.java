package com.weyeah.srm.pricing.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.pricing.dto.PricingQueryDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyCreateDTO;
import com.weyeah.srm.pricing.dto.PricingStrategyUpdateDTO;
import com.weyeah.srm.pricing.entity.PricingStrategy;
import com.weyeah.srm.pricing.vo.PricingStrategyDetailVO;

import java.util.List;

public interface PricingStrategyService {

    PageResult<PricingStrategy> queryPage(PricingQueryDTO queryDTO);

    PricingStrategyDetailVO getById(Long id);

    PricingStrategy getByCode(String code);

    List<PricingStrategy> listActive();

    List<PricingStrategy> listByMaterial(Long materialId);

    List<PricingStrategy> listBySupplier(Long supplierId);

    Long create(PricingStrategyCreateDTO createDTO);

    void update(PricingStrategyUpdateDTO updateDTO);

    void updateStatus(Long id, String status);

    void delete(Long id);

    void activate(Long id);

    void expire(Long id);

    int countActive();
}
