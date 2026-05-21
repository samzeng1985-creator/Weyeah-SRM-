package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Contract;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ContractMapper extends BaseMapper<Contract> {
    
    @Select("SELECT MAX(code) FROM contract WHERE code LIKE #{prefix} AND del_flag = 0")
    String selectMaxCode(String prefix);
}
