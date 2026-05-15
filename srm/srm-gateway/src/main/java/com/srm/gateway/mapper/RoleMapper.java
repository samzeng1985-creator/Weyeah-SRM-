package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface RoleMapper extends BaseMapper<Role> {
    
    @Select("SELECT * FROM role WHERE del_flag = 0 ORDER BY sort_order ASC")
    java.util.List<Role> selectAllActive();
}
