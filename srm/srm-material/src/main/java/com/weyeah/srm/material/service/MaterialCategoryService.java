package com.weyeah.srm.material.service;

import com.weyeah.srm.material.dto.MaterialCategoryCreateDTO;
import com.weyeah.srm.material.entity.MaterialCategory;

import java.util.List;

public interface MaterialCategoryService {

    List<MaterialCategory> getTree();

    MaterialCategory getById(Long id);

    MaterialCategory getByCode(String code);

    Long create(MaterialCategoryCreateDTO createDTO);

    void update(Long id, MaterialCategoryCreateDTO updateDTO);

    void delete(Long id);

    void updateStatus(Long id, String status);
}
