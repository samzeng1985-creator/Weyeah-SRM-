-- 物料管理模块数据库脚本

-- 物料分类表
CREATE TABLE IF NOT EXISTS `material_category` (
    `id` BIGINT NOT NULL COMMENT '主键ID',
    `code` VARCHAR(50) NOT NULL COMMENT '分类编码',
    `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
    `parent_id` BIGINT DEFAULT NULL COMMENT '父分类ID',
    `level` INT NOT NULL DEFAULT 1 COMMENT '层级',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, INACTIVE-禁用',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
    `create_by` VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料分类表';

-- 物料表
CREATE TABLE IF NOT EXISTS `material` (
    `id` BIGINT NOT NULL COMMENT '主键ID',
    `code` VARCHAR(50) NOT NULL COMMENT '物料编码',
    `name` VARCHAR(200) NOT NULL COMMENT '物料名称',
    `specification` VARCHAR(200) DEFAULT NULL COMMENT '规格',
    `model` VARCHAR(200) DEFAULT NULL COMMENT '型号',
    `brand` VARCHAR(100) DEFAULT NULL COMMENT '品牌',
    `unit` VARCHAR(20) NOT NULL COMMENT '单位',
    `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE-启用, INACTIVE-禁用, OBSOLETE-淘汰',
    `standard_price` DECIMAL(15,2) DEFAULT NULL COMMENT '标准单价',
    `min_order_quantity` DECIMAL(15,4) DEFAULT NULL COMMENT '最小订购量',
    `safety_stock` DECIMAL(15,4) DEFAULT NULL COMMENT '安全库存',
    `shelf_life` INT DEFAULT NULL COMMENT '保质期(天)',
    `origin` VARCHAR(100) DEFAULT NULL COMMENT '产地',
    `hs_code` VARCHAR(20) DEFAULT NULL COMMENT '海关编码',
    `material_type` VARCHAR(50) DEFAULT NULL COMMENT '物料类型',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
    `technical_parameter` TEXT DEFAULT NULL COMMENT '技术参数',
    `create_by` VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_code` (`code`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料表';

-- 物料供应商关联表
CREATE TABLE IF NOT EXISTS `material_supplier_rel` (
    `id` BIGINT NOT NULL COMMENT '主键ID',
    `material_id` BIGINT NOT NULL COMMENT '物料ID',
    `supplier_id` BIGINT NOT NULL COMMENT '供应商ID',
    `supplier_price` DECIMAL(15,4) DEFAULT NULL COMMENT '供应商报价',
    `min_order_quantity` DECIMAL(15,4) DEFAULT NULL COMMENT '最小订购量',
    `lead_time` INT DEFAULT NULL COMMENT '交货周期(天)',
    `supplier_material_code` VARCHAR(100) DEFAULT NULL COMMENT '供应商物料编码',
    `is_preferred` TINYINT(1) DEFAULT 0 COMMENT '是否首选供应商',
    `create_by` VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_by` VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    `update_time` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (`id`),
    KEY `idx_material_id` (`material_id`),
    KEY `idx_supplier_id` (`supplier_id`),
    UNIQUE KEY `uk_material_supplier` (`material_id`, `supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料供应商关联表';
