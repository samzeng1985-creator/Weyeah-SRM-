package com.weyeah.srm.supplier.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.weyeah.srm.supplier.entity.Supplier;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SupplierMapper extends BaseMapper<Supplier> {

    List<Supplier> selectActiveSuppliers();

    List<Supplier> selectByType(@Param("type") String type);

    int countByStatus(@Param("status") String status);
}
