package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.Employee;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmployeeMapper extends BaseMapper<Employee> {
}
