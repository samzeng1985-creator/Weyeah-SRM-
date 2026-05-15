package com.srm.gateway.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@TableName("material")
public class Material {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String code;
    private String name;
    private String model;
    private String specification;
    
    @TableField("category_id")
    private Long categoryId;
    
    private String category;
    private String materialType;
    
    @TableField("applicable_models")
    private String applicableModels;
    
    private String brand;
    private String manufacturer;
    
    @TableField("origin_country")
    private String originCountry;
    
    private String unit;
    
    @TableField("auxiliary_unit")
    private String auxiliaryUnit;
    
    @TableField("conversion_ratio")
    private BigDecimal conversionRatio;
    
    @TableField("min_order_quantity")
    private BigDecimal minOrderQuantity;
    
    @TableField("safety_stock")
    private BigDecimal safetyStock;
    
    @TableField("warranty_period")
    private Integer warrantyPeriod;
    
    private String description;
    private String status;
    
    @TableField("image_url")
    private String imageUrl;
    
    @TableField("created_at")
    private LocalDateTime createdAt;
    
    @TableField("updated_at")
    private LocalDateTime updatedAt;
    
    @TableField("created_by")
    private Long createdBy;
    
    @TableField("updated_by")
    private Long updatedBy;
    
    @TableField("del_flag")
    private Integer delFlag;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSpecification() { return specification; }
    public void setSpecification(String specification) { this.specification = specification; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMaterialType() { return materialType; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }

    public String getApplicableModels() { return applicableModels; }
    public void setApplicableModels(String applicableModels) { this.applicableModels = applicableModels; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getAuxiliaryUnit() { return auxiliaryUnit; }
    public void setAuxiliaryUnit(String auxiliaryUnit) { this.auxiliaryUnit = auxiliaryUnit; }

    public BigDecimal getConversionRatio() { return conversionRatio; }
    public void setConversionRatio(BigDecimal conversionRatio) { this.conversionRatio = conversionRatio; }

    public BigDecimal getMinOrderQuantity() { return minOrderQuantity; }
    public void setMinOrderQuantity(BigDecimal minOrderQuantity) { this.minOrderQuantity = minOrderQuantity; }

    public BigDecimal getSafetyStock() { return safetyStock; }
    public void setSafetyStock(BigDecimal safetyStock) { this.safetyStock = safetyStock; }

    public Integer getWarrantyPeriod() { return warrantyPeriod; }
    public void setWarrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public Long getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Long updatedBy) { this.updatedBy = updatedBy; }

    public Integer getDelFlag() { return delFlag; }
    public void setDelFlag(Integer delFlag) { this.delFlag = delFlag; }
}
