package com.weyeah.srm.contract.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.contract.dto.ContractCreateDTO;
import com.weyeah.srm.contract.dto.ContractQueryDTO;
import com.weyeah.srm.contract.dto.ContractUpdateDTO;
import com.weyeah.srm.contract.entity.Contract;
import com.weyeah.srm.contract.mapper.ContractMapper;
import com.weyeah.srm.contract.service.ContractService;
import com.weyeah.srm.contract.vo.ContractDetailVO;
import com.weyeah.srm.types.enums.EContractStatus;
import com.weyeah.srm.types.enums.EContractType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {

    private final ContractMapper contractMapper;

    @Override
    public PageResult<Contract> queryPage(ContractQueryDTO queryDTO) {
        Page<Contract> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<Contract> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("name", queryDTO.getKeyword())
                    .or().like("contract_no", queryDTO.getKeyword()));
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

        Page<Contract> result = contractMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public ContractDetailVO getById(Long id) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }
        return convertToDetailVO(contract);
    }

    @Override
    public Contract getByContractNo(String contractNo) {
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("contract_no", contractNo);
        return contractMapper.selectOne(wrapper);
    }

    @Override
    public List<Contract> listActive() {
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EContractStatus.SIGNED.getCode());
        wrapper.gt("expiry_date", LocalDateTime.now().toLocalDate());
        wrapper.orderByDesc("create_time");
        return contractMapper.selectList(wrapper);
    }

    @Override
    public List<Contract> listBySupplier(Long supplierId) {
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId);
        wrapper.orderByDesc("create_time");
        return contractMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ContractCreateDTO createDTO) {
        Contract contract = new Contract();
        BeanUtils.copyProperties(createDTO, contract);

        contract.setContractNo(generateContractNo());
        contract.setType(EContractType.fromCode(createDTO.getType()));
        contract.setStatus(EContractStatus.DRAFT);

        if (!StringUtils.hasText(createDTO.getCurrency())) {
            contract.setCurrency("CNY");
        }

        contract.setCreateTime(LocalDateTime.now());

        contractMapper.insert(contract);

        return contract.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(ContractUpdateDTO updateDTO) {
        Contract contract = contractMapper.selectById(updateDTO.getId());
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的合同可以修改");
        }

        BeanUtils.copyProperties(updateDTO, contract);

        if (StringUtils.hasText(updateDTO.getStatus())) {
            contract.setStatus(EContractStatus.fromCode(updateDTO.getStatus()));
        }

        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        contract.setStatus(EContractStatus.fromCode(status));
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitForReview(Long id) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的合同可以提交审核");
        }

        contract.setStatus(EContractStatus.PENDING_REVIEW);
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(Long id, String remark) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.PENDING_REVIEW) {
            throw new BizException(400, "只有待审核状态的合同可以批准");
        }

        contract.setStatus(EContractStatus.APPROVED);
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reject(Long id, String reason) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.PENDING_REVIEW) {
            throw new BizException(400, "只有待审核状态的合同可以拒绝");
        }

        contract.setStatus(EContractStatus.DRAFT);
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void sign(Long id) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.APPROVED) {
            throw new BizException(400, "只有已审核状态的合同可以签署");
        }

        contract.setStatus(EContractStatus.SIGNED);
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void terminate(Long id, String reason) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.SIGNED) {
            throw new BizException(400, "只有已签署状态的合同可以终止");
        }

        contract.setStatus(EContractStatus.TERMINATED);
        contract.setUpdateTime(LocalDateTime.now());

        contractMapper.updateById(contract);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Contract contract = contractMapper.selectById(id);
        if (contract == null) {
            throw new BizException(404, "合同不存在");
        }

        if (contract.getStatus() != EContractStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的合同可以删除");
        }

        contractMapper.deleteById(id);
    }

    @Override
    public int countActive() {
        QueryWrapper<Contract> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EContractStatus.SIGNED.getCode());
        return contractMapper.selectCount(wrapper).intValue();
    }

    private String generateContractNo() {
        return "CT" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private ContractDetailVO convertToDetailVO(Contract contract) {
        ContractDetailVO vo = new ContractDetailVO();
        BeanUtils.copyProperties(contract, vo);

        if (contract.getType() != null) {
            vo.setType(contract.getType().getCode());
            vo.setTypeDesc(contract.getType().getDesc());
        }

        if (contract.getStatus() != null) {
            vo.setStatus(contract.getStatus().getCode());
            vo.setStatusDesc(contract.getStatus().getDesc());
        }

        if (contract.getCreateTime() != null) {
            vo.setCreateTime(contract.getCreateTime().toString());
        }

        if (contract.getUpdateTime() != null) {
            vo.setUpdateTime(contract.getUpdateTime().toString());
        }

        return vo;
    }

}
