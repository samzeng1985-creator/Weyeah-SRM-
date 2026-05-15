package com.weyeah.srm.contract.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.contract.dto.ContractCreateDTO;
import com.weyeah.srm.contract.dto.ContractQueryDTO;
import com.weyeah.srm.contract.dto.ContractUpdateDTO;
import com.weyeah.srm.contract.entity.Contract;
import com.weyeah.srm.contract.vo.ContractDetailVO;

import java.util.List;

public interface ContractService {

    PageResult<Contract> queryPage(ContractQueryDTO queryDTO);

    ContractDetailVO getById(Long id);

    Contract getByContractNo(String contractNo);

    List<Contract> listActive();

    List<Contract> listBySupplier(Long supplierId);

    Long create(ContractCreateDTO createDTO);

    void update(ContractUpdateDTO updateDTO);

    void updateStatus(Long id, String status);

    void submitForReview(Long id);

    void approve(Long id, String remark);

    void reject(Long id, String reason);

    void sign(Long id);

    void terminate(Long id, String reason);

    void delete(Long id);

    int countActive();

}
