package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("cooperation_record")
public class CooperationRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long supplierId;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String cooperationType;
    
    private String contractNo;
    
    private BigDecimal amount;
    
    private String currency;
    
    private String status;
    
    private String description;
    
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private String createdBy;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer delFlag;
}
