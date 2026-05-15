-- =============================================
-- 采购订单模块数据库脚本
-- 模块: srm-purchase
-- =============================================

-- ---------------------------------------------
-- 1. 采购订单表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS purchase_order (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
    title VARCHAR(200) NOT NULL COMMENT '订单标题',
    type VARCHAR(20) NOT NULL COMMENT '采购类型: STANDARD-标准采购, URGENT-紧急采购, SPOT-现货采购, BLANKET-框架协议采购',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    contract_id BIGINT COMMENT '关联合同ID',
    material_id BIGINT COMMENT '关联物料ID',
    quantity DECIMAL(20, 4) NOT NULL COMMENT '采购数量',
    unit_price DECIMAL(20, 4) NOT NULL COMMENT '单价',
    total_amount DECIMAL(20, 4) NOT NULL COMMENT '总金额',
    currency VARCHAR(10) DEFAULT 'CNY' COMMENT '币种',
    required_date DATE NOT NULL COMMENT '需求日期',
    delivery_date DATE COMMENT '交货日期',
    delivery_address VARCHAR(500) COMMENT '交货地址',
    contact_person VARCHAR(100) COMMENT '联系人',
    contact_phone VARCHAR(50) COMMENT '联系电话',
    remark VARCHAR(500) COMMENT '备注',
    approval_no VARCHAR(50) COMMENT '审批单号',
    feishu_instance_id VARCHAR(100) COMMENT '飞书审批实例ID',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_order_no (order_no),
    KEY idx_supplier_id (supplier_id),
    KEY idx_material_id (material_id),
    KEY idx_type (type),
    KEY idx_status (status),
    KEY idx_required_date (required_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='采购订单表';

-- ---------------------------------------------
-- 2. 交货单表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS delivery (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    delivery_no VARCHAR(50) NOT NULL COMMENT '交货单号',
    purchase_order_id BIGINT NOT NULL COMMENT '采购订单ID',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态',
    carrier VARCHAR(100) COMMENT '承运商',
    tracking_no VARCHAR(100) COMMENT '物流单号',
    shipped_date DATE COMMENT '发货日期',
    estimated_arrival_date DATE COMMENT '预计到达日期',
    actual_arrival_date DATE COMMENT '实际到达日期',
    shipping_address VARCHAR(500) NOT NULL COMMENT '收货地址',
    receiver_name VARCHAR(100) NOT NULL COMMENT '收货人',
    receiver_phone VARCHAR(50) NOT NULL COMMENT '收货人电话',
    shipping_fee DECIMAL(10, 2) COMMENT '运费',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_delivery_no (delivery_no),
    KEY idx_purchase_order_id (purchase_order_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='交货单表';

-- ---------------------------------------------
-- 3. 收货记录表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS receiving (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    receiving_no VARCHAR(50) NOT NULL COMMENT '收货单号',
    delivery_id BIGINT NOT NULL COMMENT '交货单ID',
    purchase_order_id BIGINT NOT NULL COMMENT '采购订单ID',
    received_quantity DECIMAL(20, 4) NOT NULL COMMENT '收货数量',
    qualified_quantity DECIMAL(20, 4) NOT NULL COMMENT '合格数量',
    defective_quantity DECIMAL(20, 4) DEFAULT 0 COMMENT '不合格数量',
    inspector VARCHAR(100) NOT NULL COMMENT '检验员',
    inspection_time DATETIME NOT NULL COMMENT '检验时间',
    inspection_result VARCHAR(50) COMMENT '检验结果',
    quality_report_url VARCHAR(500) COMMENT '质检报告URL',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_receiving_no (receiving_no),
    KEY idx_delivery_id (delivery_id),
    KEY idx_purchase_order_id (purchase_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货记录表';
