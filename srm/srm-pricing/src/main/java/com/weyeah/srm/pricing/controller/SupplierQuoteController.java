package com.weyeah.srm.pricing.controller;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.common.result.Result;
import com.weyeah.srm.pricing.dto.QuoteQueryDTO;
import com.weyeah.srm.pricing.dto.SupplierQuoteCreateDTO;
import com.weyeah.srm.pricing.entity.SupplierQuote;
import com.weyeah.srm.pricing.service.SupplierQuoteService;
import com.weyeah.srm.pricing.vo.SupplierQuoteDetailVO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "供应商报价管理", description = "供应商报价相关接口")
@RestController
@RequestMapping("/api/pricing/quotes")
@RequiredArgsConstructor
@SuppressFBWarnings("EI_EXPOSE_REP2")
public class SupplierQuoteController {

    private final SupplierQuoteService supplierQuoteService;

    @Operation(summary = "分页查询供应商报价")
    @GetMapping
    public Result<PageResult<SupplierQuote>> queryPage(QuoteQueryDTO queryDTO) {
        PageResult<SupplierQuote> page = supplierQuoteService.queryPage(queryDTO);
        return Result.success(page);
    }

    @Operation(summary = "获取供应商报价详情")
    @GetMapping("/{id}")
    public Result<SupplierQuoteDetailVO> getById(@PathVariable Long id) {
        SupplierQuoteDetailVO vo = supplierQuoteService.getById(id);
        return Result.success(vo);
    }

    @Operation(summary = "根据报价单号获取报价")
    @GetMapping("/number/{quoteNumber}")
    public Result<SupplierQuote> getByQuoteNumber(@PathVariable String quoteNumber) {
        SupplierQuote quote = supplierQuoteService.getByQuoteNumber(quoteNumber);
        return Result.success(quote);
    }

    @Operation(summary = "根据供应商获取报价列表")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<SupplierQuote>> listBySupplier(@PathVariable Long supplierId) {
        List<SupplierQuote> quotes = supplierQuoteService.listBySupplier(supplierId);
        return Result.success(quotes);
    }

    @Operation(summary = "根据物料获取报价列表")
    @GetMapping("/material/{materialId}")
    public Result<List<SupplierQuote>> listByMaterial(@PathVariable Long materialId) {
        List<SupplierQuote> quotes = supplierQuoteService.listByMaterial(materialId);
        return Result.success(quotes);
    }

    @Operation(summary = "创建供应商报价")
    @PostMapping
    public Result<Long> create(@Valid @RequestBody SupplierQuoteCreateDTO createDTO) {
        Long id = supplierQuoteService.create(createDTO);
        return Result.success(id);
    }

    @Operation(summary = "提交报价")
    @PostMapping("/{id}/submit")
    public Result<Void> submit(@PathVariable Long id) {
        supplierQuoteService.submit(id);
        return Result.success();
    }

    @Operation(summary = "报价")
    @PostMapping("/{id}/quote")
    public Result<Void> quote(@PathVariable Long id, @RequestParam BigDecimal price) {
        supplierQuoteService.quote(id, price);
        return Result.success();
    }

    @Operation(summary = "接受报价")
    @PostMapping("/{id}/accept")
    public Result<Void> accept(@PathVariable Long id) {
        supplierQuoteService.accept(id);
        return Result.success();
    }

    @Operation(summary = "拒绝报价")
    @PostMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id) {
        supplierQuoteService.reject(id);
        return Result.success();
    }

    @Operation(summary = "删除报价")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        supplierQuoteService.delete(id);
        return Result.success();
    }

    @Operation(summary = "获取待处理报价数量")
    @GetMapping("/count/pending")
    public Result<Integer> countPending() {
        int count = supplierQuoteService.countPending();
        return Result.success(count);
    }
}
