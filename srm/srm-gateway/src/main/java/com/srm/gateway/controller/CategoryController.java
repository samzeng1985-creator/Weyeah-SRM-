package com.srm.gateway.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.srm.gateway.entity.Category;
import com.srm.gateway.mapper.CategoryMapper;
import com.srm.gateway.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "物料品类管理", description = "物料品类相关接口")
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Operation(summary = "获取所有品类列表")
    @GetMapping
    public Result<List<Category>> getAll() {
        log.info("获取所有品类列表");
        QueryWrapper<Category> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .orderByAsc("sort_order");
        List<Category> list = categoryMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取品类树形结构")
    @GetMapping("/tree")
    public Result<List<Map<String, Object>>> getCategoryTree() {
        log.info("获取品类树形结构");
        QueryWrapper<Category> wrapper = new QueryWrapper<>();
        wrapper.eq("del_flag", 0)
               .eq("status", "ACTIVE")
               .orderByAsc("sort_order");
        List<Category> allCategories = categoryMapper.selectList(wrapper);
        
        List<Map<String, Object>> tree = buildTree(allCategories, 0L);
        return Result.success("查询成功", tree);
    }

    @Operation(summary = "获取品类详情")
    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable("id") Long id) {
        log.info("获取品类详情，ID: {}", id);
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            return Result.error(404, "品类不存在");
        }
        return Result.success("查询成功", category);
    }

    @Operation(summary = "获取子品类列表")
    @GetMapping("/children/{parentId}")
    public Result<List<Category>> getChildren(@PathVariable("parentId") Long parentId) {
        log.info("获取子品类列表，父级ID: {}", parentId);
        QueryWrapper<Category> wrapper = new QueryWrapper<>();
        wrapper.eq("parent_id", parentId)
               .eq("del_flag", 0)
               .eq("status", "ACTIVE")
               .orderByAsc("sort_order");
        List<Category> list = categoryMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "获取末级品类列表（可关联物料）")
    @GetMapping("/leaf")
    public Result<List<Category>> getLeafCategories() {
        log.info("获取末级品类列表");
        QueryWrapper<Category> wrapper = new QueryWrapper<>();
        wrapper.eq("is_leaf", true)
               .eq("del_flag", 0)
               .eq("status", "ACTIVE")
               .orderByAsc("sort_order");
        List<Category> list = categoryMapper.selectList(wrapper);
        return Result.success("查询成功", list);
    }

    @Operation(summary = "新增品类")
    @PostMapping
    public Result<Long> create(@RequestBody Category category) {
        log.info("新增品类，名称: {}, 父级ID: {}", category.getName(), category.getParentId());
        
        // 校验层级
        if (category.getParentId() != null && category.getParentId() > 0) {
            Category parent = categoryMapper.selectById(category.getParentId());
            if (parent == null) {
                return Result.error(400, "父级品类不存在");
            }
            category.setLevel(parent.getLevel() + 1);
            
            // 更新父级为非末级
            if (parent.getIsLeaf()) {
                parent.setIsLeaf(false);
                parent.setUpdatedAt(LocalDateTime.now());
                categoryMapper.updateById(parent);
            }
        } else {
            category.setParentId(0L);
            category.setLevel(1);
        }
        
        category.setStatus("ACTIVE");
        category.setIsLeaf(true);
        category.setDelFlag(0);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        
        if (category.getSortOrder() == null) {
            category.setSortOrder(0);
        }
        
        // 自动生成品类编码
        String code = generateCategoryCode(category.getLevel(), category.getParentId());
        category.setCode(code);
        
        categoryMapper.insert(category);
        return Result.success("创建成功", category.getId());
    }

    @Operation(summary = "更新品类")
    @PutMapping("/{id}")
    public Result<Void> update(@PathVariable("id") Long id, @RequestBody Category category) {
        log.info("更新品类，ID: {}", id);
        
        Category existing = categoryMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "品类不存在");
        }
        
        category.setId(id);
        category.setUpdatedAt(LocalDateTime.now());
        categoryMapper.updateById(category);
        return Result.success("更新成功", null);
    }

    @Operation(summary = "删除品类")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable("id") Long id) {
        log.info("删除品类，ID: {}", id);
        
        Category existing = categoryMapper.selectById(id);
        if (existing == null) {
            return Result.error(404, "品类不存在");
        }
        
        QueryWrapper<Category> childWrapper = new QueryWrapper<>();
        childWrapper.eq("parent_id", id)
                   .eq("del_flag", 0);
        Long childCount = categoryMapper.selectCount(childWrapper);
        if (childCount > 0) {
            return Result.error(400, "该品类下存在子品类，无法删除");
        }
        
        if (existing.getParentId() != null && existing.getParentId() > 0) {
            QueryWrapper<Category> checkWrapper = new QueryWrapper<>();
            checkWrapper.eq("parent_id", existing.getParentId())
                       .eq("del_flag", 0);
            Long remainingChildren = categoryMapper.selectCount(checkWrapper);
            if (remainingChildren <= 1) {
                Category parent = categoryMapper.selectById(existing.getParentId());
                if (parent != null) {
                    parent.setIsLeaf(true);
                    parent.setUpdatedAt(LocalDateTime.now());
                    categoryMapper.updateById(parent);
                }
            }
        }
        
        categoryMapper.deleteById(id);
        
        return Result.success("删除成功", null);
    }

    private List<Map<String, Object>> buildTree(List<Category> categories, Long parentId) {
        List<Map<String, Object>> tree = new ArrayList<>();
        
        for (Category category : categories) {
            if ((parentId == 0L && (category.getParentId() == null || category.getParentId() == 0L)) ||
                (parentId != 0L && parentId.equals(category.getParentId()))) {
                
                Map<String, Object> node = new HashMap<>();
                node.put("id", category.getId());
                node.put("code", category.getCode());
                node.put("name", category.getName());
                node.put("level", category.getLevel());
                node.put("isLeaf", category.getIsLeaf());
                node.put("children", buildTree(categories, category.getId()));
                tree.add(node);
            }
        }
        
        return tree;
    }
    
    private String generateCategoryCode(Integer level, Long parentId) {
        String prefix = "CAT";
        
        if (parentId != null && parentId > 0) {
            Category parent = categoryMapper.selectById(parentId);
            if (parent != null) {
                prefix = parent.getCode();
            }
        }
        
        // 查询所有同级品类（包括已删除的）找到最大编码
        List<Category> siblings = categoryMapper.selectAllByParentId(parentId != null && parentId > 0 ? parentId : 0L);
        
        int nextNum = 1;
        if (!siblings.isEmpty()) {
            String lastCode = siblings.get(0).getCode();
            // 提取最后3位数字
            String numPart = lastCode.substring(lastCode.length() - 3);
            try {
                nextNum = Integer.parseInt(numPart) + 1;
            } catch (NumberFormatException e) {
                nextNum = 1;
            }
        }
        
        String code = String.format("%03d", nextNum);
        return prefix + code;
    }
}
