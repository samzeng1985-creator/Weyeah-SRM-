package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.OrgUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface OrgUserMapper extends BaseMapper<OrgUser> {
    
    @Select("SELECT * FROM org_user WHERE username = #{username} LIMIT 1")
    OrgUser selectByUsername(String username);
}
