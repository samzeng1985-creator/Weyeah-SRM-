package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.ContactPerson;
import com.srm.gateway.mapper.ContactPersonMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/contact-persons")
@RequiredArgsConstructor
@Tag(name = "联系人管理")
@CrossOrigin(origins = "*")
public class ContactPersonController {
    
    @Autowired
    private ContactPersonMapper contactPersonMapper;
    
    @Operation(summary = "获取供应商的所有联系人")
    @GetMapping("/supplier/{supplierId}")
    public Result<List<ContactPerson>> getBySupplierId(@PathVariable("supplierId") Long supplierId) {
        log.info("获取供应商联系人: supplierId={}", supplierId);
        QueryWrapper<ContactPerson> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId)
               .eq("del_flag", 0)
               .orderByDesc("is_primary")
               .orderByAsc("created_at");
        List<ContactPerson> list = contactPersonMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }
    
    @Operation(summary = "获取联系人详情")
    @GetMapping("/{id}")
    public Result<ContactPerson> getById(@PathVariable("id") Long id) {
        log.info("获取联系人详情: id={}", id);
        ContactPerson contact = contactPersonMapper.selectById(id);
        return Result.success("查询成功", contact);
    }
    
    @Operation(summary = "创建联系人")
    @PostMapping
    public Result<Long> create(@RequestBody ContactPerson contact) {
        log.info("创建联系人: {}", contact);
        contact.setDelFlag(0);
        contactPersonMapper.insert(contact);
        return Result.success("创建成功", contact.getId());
    }
    
    @Operation(summary = "更新联系人")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody ContactPerson contact) {
        log.info("更新联系人: id={}, data={}", id, contact);
        contact.setId(id);
        contactPersonMapper.updateById(contact);
        return Result.success("更新成功", null);
    }
    
    @Operation(summary = "删除联系人")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除联系人: id={}", id);
        ContactPerson contact = new ContactPerson();
        contact.setId(id);
        contact.setDelFlag(2);
        contactPersonMapper.updateById(contact);
        return Result.success("删除成功", null);
    }
}
