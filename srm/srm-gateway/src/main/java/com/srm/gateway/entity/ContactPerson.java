package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("contact_person")
public class ContactPerson {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long supplierId;
    
    private String name;
    
    private String position;
    
    private String phone;
    
    private String email;
    
    private String department;
    
    private Boolean isPrimary;
    
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
