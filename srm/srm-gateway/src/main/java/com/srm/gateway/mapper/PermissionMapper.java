package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Permission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface PermissionMapper extends BaseMapper<Permission> {
    
    @Select("SELECT * FROM permission WHERE del_flag = 0 AND status = 'ACTIVE' ORDER BY sort_order ASC")
    java.util.List<Permission> selectAllActive();
}
