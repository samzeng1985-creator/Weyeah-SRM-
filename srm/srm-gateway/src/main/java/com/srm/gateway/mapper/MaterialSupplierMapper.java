package com.srm.gateway.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.srm.gateway.entity.MaterialSupplier;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface MaterialSupplierMapper extends BaseMapper<MaterialSupplier> {
    
    @Select("SELECT * FROM material_supplier WHERE material_id = #{materialId} AND del_flag = 0 ORDER BY is_primary DESC, created_at DESC")
    List<MaterialSupplier> selectByMaterialId(@Param("materialId") Long materialId);
    
    @Select("SELECT * FROM material_supplier WHERE supplier_id = #{supplierId} AND del_flag = 0 ORDER BY created_at DESC")
    List<MaterialSupplier> selectBySupplierId(@Param("supplierId") Long supplierId);
    
    @Select("SELECT COUNT(*) FROM material_supplier WHERE material_id = #{materialId} AND is_primary = TRUE AND del_flag = 0")
    int countPrimaryByMaterialId(@Param("materialId") Long materialId);
}
