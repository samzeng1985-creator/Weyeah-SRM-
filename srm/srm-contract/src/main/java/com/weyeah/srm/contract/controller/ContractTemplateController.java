package com.weyeah.srm.contract.controller;

import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.contract.dto.ContractTemplateCreateDTO;
import com.weyeah.srm.contract.entity.ContractTemplate;
import com.weyeah.srm.contract.service.ContractTemplateService;
import com.weyeah.srm.contract.vo.ContractTemplateDetailVO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "合同模板管理", description = "合同模板相关接口")
@RestController
@RequestMapping("/api/contract-templates")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class ContractTemplateController {

    private final ContractTemplateService contractTemplateService;

    @Operation(summary = "获取所有模板")
    @GetMapping
    public Result<List<ContractTemplate>> listAll() {
        List<ContractTemplate> templates = contractTemplateService.listAll();
        return Result.success(templates);
    }

    @Operation(summary = "获取模板详情")
    @GetMapping("/{id}")
    public Result<ContractTemplateDetailVO> getById(@PathVariable Long id) {
        ContractTemplate template = contractTemplateService.getById(id);
        ContractTemplateDetailVO vo = new ContractTemplateDetailVO();
        BeanUtils.copyProperties(template, vo);
        if (template.getCreateTime() != null) {
            vo.setCreateTime(template.getCreateTime().toString());
        }
        if (template.getUpdateTime() != null) {
            vo.setUpdateTime(template.getUpdateTime().toString());
        }
        return Result.success(vo);
    }

    @Operation(summary = "根据编码获取模板")
    @GetMapping("/code/{code}")
    public Result<ContractTemplate> getByCode(@PathVariable String code) {
        ContractTemplate template = contractTemplateService.getByCode(code);
        return Result.success(template);
    }

    @Operation(summary = "获取默认模板")
    @GetMapping("/default")
    public Result<ContractTemplate> getDefault() {
        ContractTemplate template = contractTemplateService.getDefault();
        return Result.success(template);
    }

    @Operation(summary = "创建模板")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody ContractTemplateCreateDTO createDTO) {
        Long id = contractTemplateService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "更新模板")
    @PutMapping
    public Result<Void> update(@Valid @RequestBody ContractTemplate template) {
        contractTemplateService.update(template);
        return Result.success();
    }

    @Operation(summary = "设置默认模板")
    @PostMapping("/{id}/set-default")
    public Result<Void> setDefault(@PathVariable Long id) {
        contractTemplateService.setDefault(id);
        return Result.success();
    }

    @Operation(summary = "删除模板")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        contractTemplateService.delete(id);
        return Result.success();
    }

}
