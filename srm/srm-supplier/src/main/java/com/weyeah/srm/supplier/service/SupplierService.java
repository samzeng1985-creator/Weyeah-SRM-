package com.weyeah.srm.supplier.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.supplier.dto.SupplierCreateDTO;
import com.weyeah.srm.supplier.dto.SupplierQueryDTO;
import com.weyeah.srm.supplier.dto.SupplierUpdateDTO;
import com.weyeah.srm.supplier.entity.Supplier;
import com.weyeah.srm.supplier.vo.SupplierDetailVO;

import java.util.List;

public interface SupplierService {

    PageResult<Supplier> queryPage(SupplierQueryDTO queryDTO);

    SupplierDetailVO getById(Long id);

    Supplier getByCode(String code);

    List<Supplier> listActive();

    Long create(SupplierCreateDTO createDTO);

    void update(SupplierUpdateDTO updateDTO);

    void updateStatus(Long id, String status);

    void delete(Long id);

    void review(Long id, String pass);

    int countActive();
}
