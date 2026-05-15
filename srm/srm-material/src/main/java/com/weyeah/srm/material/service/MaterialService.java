package com.weyeah.srm.material.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.material.dto.MaterialCreateDTO;
import com.weyeah.srm.material.dto.MaterialQueryDTO;
import com.weyeah.srm.material.dto.MaterialUpdateDTO;
import com.weyeah.srm.material.entity.Material;

import java.util.List;

public interface MaterialService {

    PageResult<Material> queryPage(MaterialQueryDTO queryDTO);

    Material getById(Long id);

    Material getByCode(String code);

    List<Material> listActive();

    Long create(MaterialCreateDTO createDTO);

    void update(MaterialUpdateDTO updateDTO);

    void delete(Long id);

    void updateStatus(Long id, String status);
}
