-- =============================================
-- 定价管理模块数据库脚本
-- 模块: srm-pricing
-- =============================================

-- ---------------------------------------------
-- 1. 定价策略表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS pricing_strategy (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '策略编码',
    name VARCHAR(200) NOT NULL COMMENT '策略名称',
    type VARCHAR(20) NOT NULL COMMENT '定价类型: STANDARD-标准定价, CONTRACT-合同定价, PROMOTION-促销定价, VOLUME-批量定价, CUSTOM-自定义',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态: DRAFT-草稿, PENDING_APPROVAL-待审批, ACTIVE-已生效, EXPIRED-已过期, CANCELLED-已取消',
    material_id BIGINT COMMENT '关联物料ID',
    supplier_id BIGINT COMMENT '关联供应商ID',
    category_id BIGINT COMMENT '关联物料分类ID',
    unit_price DECIMAL(20, 4) NOT NULL COMMENT '单价',
    min_quantity DECIMAL(20, 4) COMMENT '最小数量',
    max_quantity DECIMAL(20, 4) COMMENT '最大数量',
    discount_rate DECIMAL(10, 4) COMMENT '折扣率',
    effective_date DATE NOT NULL COMMENT '生效日期',
    expiry_date DATE NOT NULL COMMENT '失效日期',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种',
    description VARCHAR(500) COMMENT '描述',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code),
    KEY idx_material_id (material_id),
    KEY idx_supplier_id (supplier_id),
    KEY idx_category_id (category_id),
    KEY idx_status (status),
    KEY idx_effective_date (effective_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定价策略表';

-- ---------------------------------------------
-- 2. 供应商报价表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS supplier_quote (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    quote_number VARCHAR(50) NOT NULL COMMENT '报价单号',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    pricing_strategy_id BIGINT COMMENT '关联定价策略ID',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态: DRAFT-草稿, SUBMITTED-已提交, QUOTED-已报价, ACCEPTED-已接受, REJECTED-已拒绝, EXPIRED-已过期',
    unit_price DECIMAL(20, 4) COMMENT '单价',
    min_order_quantity DECIMAL(20, 4) COMMENT '最小订购数量',
    discount_rate DECIMAL(10, 4) COMMENT '折扣率',
    total_amount DECIMAL(20, 4) COMMENT '总金额',
    quote_date DATETIME COMMENT '报价日期',
    valid_until DATETIME COMMENT '有效期至',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种',
    payment_terms VARCHAR(100) COMMENT '付款条款',
    lead_time INT COMMENT '交货周期(天)',
    quote_file_url VARCHAR(500) COMMENT '报价文件URL',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_quote_number (quote_number),
    KEY idx_supplier_id (supplier_id),
    KEY idx_material_id (material_id),
    KEY idx_status (status),
    KEY idx_valid_until (valid_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商报价表';

-- ---------------------------------------------
-- 3. 价格历史记录表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS price_history (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    material_id BIGINT COMMENT '物料ID',
    supplier_id BIGINT COMMENT '供应商ID',
    pricing_strategy_id BIGINT COMMENT '关联定价策略ID',
    quote_id BIGINT COMMENT '关联报价ID',
    old_price DECIMAL(20, 4) COMMENT '原价',
    new_price DECIMAL(20, 4) COMMENT '新价格',
    change_rate DECIMAL(10, 4) COMMENT '变化率',
    change_type VARCHAR(20) NOT NULL COMMENT '变更类型: CREATE-创建, UPDATE-更新, APPROVE-审批, ACTIVATE-激活, EXPIRE-过期',
    change_reason VARCHAR(500) COMMENT '变更原因',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    KEY idx_material_id (material_id),
    KEY idx_supplier_id (supplier_id),
    KEY idx_strategy_id (pricing_strategy_id),
    KEY idx_quote_id (quote_id),
    KEY idx_change_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='价格历史记录表';
