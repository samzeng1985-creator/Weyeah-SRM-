package com.weyeah.srm.contract.service;

import com.weyeah.srm.contract.dto.ContractTemplateCreateDTO;
import com.weyeah.srm.contract.entity.ContractTemplate;

import java.util.List;

public interface ContractTemplateService {

    List<ContractTemplate> listAll();

    ContractTemplate getById(Long id);

    ContractTemplate getByCode(String code);

    ContractTemplate getDefault();

    Long create(ContractTemplateCreateDTO createDTO);

    void update(ContractTemplate template);

    void setDefault(Long id);

    void delete(Long id);

}
