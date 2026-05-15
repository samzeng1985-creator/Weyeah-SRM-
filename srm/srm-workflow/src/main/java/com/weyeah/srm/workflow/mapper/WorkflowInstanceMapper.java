package com.weyeah.srm.workflow.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.weyeah.srm.workflow.entity.WorkflowInstance;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WorkflowInstanceMapper extends BaseMapper<WorkflowInstance> {

}
