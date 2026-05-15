package com.weyeah.srm.contract.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.contract.dto.ContractCreateDTO;
import com.weyeah.srm.contract.dto.ContractQueryDTO;
import com.weyeah.srm.contract.dto.ContractUpdateDTO;
import com.weyeah.srm.contract.entity.Contract;
import com.weyeah.srm.contract.service.ContractService;
import com.weyeah.srm.contract.vo.ContractDetailVO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "合同管理", description = "合同相关接口")
@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class ContractController {

    private final ContractService contractService;

    @Operation(summary = "分页查询合同")
    @GetMapping
    public Result<PageResult<Contract>> queryPage(ContractQueryDTO queryDTO) {
        PageResult<Contract> page = contractService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取合同详情")
    @GetMapping("/{id}")
    public Result<ContractDetailVO> getById(@PathVariable Long id) {
        ContractDetailVO vo = contractService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据合同编号获取合同")
    @GetMapping("/number/{contractNo}")
    public Result<Contract> getByContractNo(@PathVariable String contractNo) {
        Contract contract = contractService.getByContractNo(contractNo);
        return Result.success(contract);
    }

    @Operation(summary = "获取所有生效合同")
    @GetMapping("/active")
    public Result<List<Contract>> listActive() {
        List<Contract> contracts = contractService.listActive();
        return Result.success(contracts);
    }

    @Operation(summary = "根据供应商获取合同")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<Contract>> listBySupplier(@PathVariable Long supplierId) {
        List<Contract> contracts = contractService.listBySupplier(supplierId);
        return Result.success(contracts);
    }

    @Operation(summary = "创建合同")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ContractCreateDTO createDTO) {
        Long id = contractService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新合同")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody ContractUpdateDTO updateDTO) {
        contractService.update(updateDTO);
        return Result.success();
    }

    @Operation(summary = "更新合同状态")
    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        contractService.updateStatus(id, status);
        return Result.success();
    }

    @Operation(summary = "提交审核")
    @PostMapping("/{id}/submit-review")
    public Result<Void> submitForReview(@PathVariable Long id) {
        contractService.submitForReview(id);
        return Result.success();
    }

    @Operation(summary = "审核通过")
    @PostMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id, @RequestParam(required = false) String remark) {
        contractService.approve(id, remark);
        return Result.success();
    }

    @Operation(summary = "审核拒绝")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id, @RequestParam String reason) {
        contractService.reject(id, reason);
        return Result.success();
    }

    @Operation(summary = "签署合同")
    @PostMapping("/{id}/sign")
    public Result<Void> sign(@PathVariable Long id) {
        contractService.sign(id);
        return Result.success();
    }

    @Operation(summary = "终止合同")
    @PostMapping("/{id}/terminate")
    public Result<Void> terminate(@PathVariable Long id, @RequestParam String reason) {
        contractService.terminate(id, reason);
        return Result.success();
    }

    @Operation(summary = "删除合同")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contractService.delete(id);
        return Result.success();
    }

    @Operation(summary = "获取生效合同数量")
    @GetMapping("/count/active")
    public Result<Integer> countActive() {
        int count = contractService.countActive();
        return Result.success(count);
    }

}
