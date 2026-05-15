package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("supplier_evaluation")
public class SupplierEvaluation {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long supplierId;
    
    private LocalDate evaluationDate;
    
    private String periodType;
    
    private BigDecimal qualityScore;
    
    private BigDecimal deliveryScore;
    
    private BigDecimal priceScore;
    
    private BigDecimal serviceScore;
    
    private BigDecimal comprehensiveScore;
    
    private String rating;
    
    private String evaluator;
    
    private String evaluationOpinion;
    
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
