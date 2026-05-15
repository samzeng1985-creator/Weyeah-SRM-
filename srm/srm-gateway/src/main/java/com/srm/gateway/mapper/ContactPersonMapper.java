package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.ContactPerson;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ContactPersonMapper extends BaseMapper<ContactPerson> {
}
