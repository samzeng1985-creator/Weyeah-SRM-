package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.srm.gateway.entity.Supplier;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface SupplierMapper extends BaseMapper<Supplier> {
    
    @Select("SELECT * FROM supplier WHERE del_flag = 0 AND (name LIKE CONCAT('%', #{keyword}, '%') OR code LIKE CONCAT('%', #{keyword}, '%')) ORDER BY created_at DESC")
    IPage<Supplier> selectByKeyword(Page<Supplier> page, @Param("keyword") String keyword);
    
    @Select("SELECT * FROM supplier WHERE del_flag = 0 AND status = #{status} AND (name LIKE CONCAT('%', #{keyword}, '%') OR code LIKE CONCAT('%', #{keyword}, '%')) ORDER BY created_at DESC")
    IPage<Supplier> selectByKeywordAndStatus(Page<Supplier> page, @Param("keyword") String keyword, @Param("status") String status);
}
