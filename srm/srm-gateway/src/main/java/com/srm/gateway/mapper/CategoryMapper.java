package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
    @Select("SELECT * FROM category WHERE parent_id = #{parentId} ORDER BY code DESC")
    List<Category> selectAllByParentId(@Param("parentId") Long parentId);
}
