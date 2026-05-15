-- =============================================
-- 合同管理模块数据库脚本
-- 模块: srm-contract
-- =============================================

-- ---------------------------------------------
-- 1. 合同模板表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS contract_template (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '模板编码',
    name VARCHAR(200) NOT NULL COMMENT '模板名称',
    type VARCHAR(20) NOT NULL COMMENT '模板类型',
    html_content TEXT NOT NULL COMMENT 'HTML内容',
    variable_schema TEXT COMMENT '变量定义(JSON)',
    description VARCHAR(500) COMMENT '描述',
    is_default BOOLEAN DEFAULT FALSE COMMENT '是否默认',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同模板表';

-- ---------------------------------------------
-- 2. 合同表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS contract (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    contract_no VARCHAR(50) NOT NULL COMMENT '合同编号',
    name VARCHAR(200) NOT NULL COMMENT '合同名称',
    type VARCHAR(20) NOT NULL COMMENT '合同类型',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    total_amount DECIMAL(20, 4) NOT NULL COMMENT '总金额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种',
    effective_date DATE NOT NULL COMMENT '生效日期',
    expiry_date DATE NOT NULL COMMENT '失效日期',
    party_a VARCHAR(200) NOT NULL COMMENT '甲方',
    party_b VARCHAR(200) NOT NULL COMMENT '乙方',
    contract_file_url VARCHAR(500) COMMENT '合同文件URL',
    template_code VARCHAR(50) COMMENT '关联模板编码',
    variables TEXT COMMENT '变量值(JSON)',
    description VARCHAR(500) COMMENT '描述',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_contract_no (contract_no),
    KEY idx_supplier_id (supplier_id),
    KEY idx_type (type),
    KEY idx_status (status),
    KEY idx_effective_date (effective_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同表';
