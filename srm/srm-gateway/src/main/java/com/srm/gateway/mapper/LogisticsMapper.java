package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Logistics;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface LogisticsMapper extends BaseMapper<Logistics> {
    @Select("SELECT * FROM logistics WHERE contract_id = #{contractId} ORDER BY created_at DESC")
    List<Logistics> selectByContractId(@Param("contractId") Long contractId);
    
    @Select("SELECT MAX(code) FROM logistics WHERE code LIKE #{prefix}")
    String selectMaxCode(@Param("prefix") String prefix);
}
