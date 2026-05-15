-- =====================================================
-- Weyeah SRM 系统数据库初始化脚本
-- 完整版本 - 包含所有模块表结构
-- 数据库：srm_system
-- 字符集：utf8mb4
-- 排序规则：utf8mb4_unicode_ci
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS srm_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE srm_system;

-- =====================================================
-- 1. 系统管理模块 (srm-common)
-- =====================================================

CREATE TABLE IF NOT EXISTS sys_user (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    dept_id BIGINT COMMENT '部门ID',
    user_name VARCHAR(30) NOT NULL COMMENT '用户账号',
    nick_name VARCHAR(30) NOT NULL COMMENT '用户昵称',
    user_type VARCHAR(2) DEFAULT '00' COMMENT '用户类型',
    email VARCHAR(50) COMMENT '用户邮箱',
    phonenumber VARCHAR(11) COMMENT '手机号码',
    sex CHAR(1) DEFAULT '0' COMMENT '用户性别（0男1女2未知）',
    avatar VARCHAR(100) COMMENT '头像地址',
    password VARCHAR(100) COMMENT '密码',
    status CHAR(1) DEFAULT '0' COMMENT '帐号状态（0正常1停用）',
    del_flag CHAR(1) DEFAULT '0' COMMENT '删除标志（0存在2删除）',
    login_ip VARCHAR(128) COMMENT '最后登录IP',
    login_date DATETIME COMMENT '最后登录时间',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_dept_id (dept_id),
    UNIQUE INDEX idx_user_name (user_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE IF NOT EXISTS sys_dept (
    dept_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '部门ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父部门ID',
    ancestors VARCHAR(500) COMMENT '祖级列表',
    dept_name VARCHAR(30) NOT NULL COMMENT '部门名称',
    order_num INT DEFAULT 0 COMMENT '显示顺序',
    leader VARCHAR(20) COMMENT '负责人',
    phone VARCHAR(11) COMMENT '联系电话',
    email VARCHAR(50) COMMENT '邮箱',
    status CHAR(1) DEFAULT '0' COMMENT '部门状态（0正常1停用）',
    del_flag CHAR(1) DEFAULT '0' COMMENT '删除标志（0存在2删除）',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

CREATE TABLE IF NOT EXISTS sys_role (
    role_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
    role_name VARCHAR(30) NOT NULL COMMENT '角色名称',
    role_key VARCHAR(100) NOT NULL COMMENT '角色权限字符串',
    role_sort INT NOT NULL COMMENT '显示顺序',
    data_scope CHAR(1) DEFAULT '1' COMMENT '数据范围',
    status CHAR(1) NOT NULL COMMENT '角色状态（0正常1停用）',
    del_flag CHAR(1) DEFAULT '0' COMMENT '删除标志',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

CREATE TABLE IF NOT EXISTS sys_menu (
    menu_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '菜单ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    menu_name VARCHAR(50) NOT NULL COMMENT '菜单名称',
    order_num INT DEFAULT 0 COMMENT '显示顺序',
    path VARCHAR(200) COMMENT '路由地址',
    component VARCHAR(255) COMMENT '组件路径',
    query VARCHAR(255) COMMENT '路由参数',
    is_frame INT DEFAULT 1 COMMENT '是否为外链（0是1否）',
    is_cache INT DEFAULT 0 COMMENT '是否缓存（0缓存1不缓存）',
    menu_type CHAR(1) DEFAULT 'M' COMMENT '菜单类型',
    visible CHAR(1) DEFAULT '0' COMMENT '菜单状态（0显示1隐藏）',
    status CHAR(1) DEFAULT '0' COMMENT '菜单状态（0正常1停用）',
    perms VARCHAR(100) COMMENT '权限标识',
    icon VARCHAR(100) DEFAULT '#' COMMENT '菜单图标',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';

CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

CREATE TABLE IF NOT EXISTS sys_role_menu (
    role_id BIGINT NOT NULL COMMENT '角色ID',
    menu_id BIGINT NOT NULL COMMENT '菜单ID',
    PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

CREATE TABLE IF NOT EXISTS sys_dict_type (
    dict_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '字典主键',
    dict_name VARCHAR(100) COMMENT '字典名称',
    dict_type VARCHAR(100) NOT NULL COMMENT '字典类型',
    status CHAR(1) NOT NULL DEFAULT '0' COMMENT '状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_dict_type (dict_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典类型表';

CREATE TABLE IF NOT EXISTS sys_dict_data (
    dict_code BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '字典编码',
    dict_sort INT DEFAULT 0 COMMENT '字典排序',
    dict_label VARCHAR(100) COMMENT '字典标签',
    dict_value VARCHAR(100) COMMENT '字典键值',
    dict_type VARCHAR(100) NOT NULL COMMENT '字典类型',
    css_class VARCHAR(100) COMMENT '样式属性',
    list_class VARCHAR(100) COMMENT '表格回显样式',
    is_default CHAR(1) DEFAULT 'N' COMMENT '是否默认',
    status CHAR(1) DEFAULT '0' COMMENT '状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典数据表';

CREATE TABLE IF NOT EXISTS sys_config (
    config_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '参数主键',
    config_name VARCHAR(100) COMMENT '参数名称',
    config_key VARCHAR(100) NOT NULL COMMENT '参数键名',
    config_value VARCHAR(500) COMMENT '参数键值',
    config_type CHAR(1) DEFAULT 'Y' COMMENT '系统内置',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =====================================================
-- 2. 供应商管理模块 (srm-supplier)
-- =====================================================

CREATE TABLE IF NOT EXISTS supplier (
    id BIGINT NOT NULL COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '供应商编码',
    name VARCHAR(200) NOT NULL COMMENT '供应商名称',
    short_name VARCHAR(100) DEFAULT NULL COMMENT '供应商简称',
    type VARCHAR(20) NOT NULL COMMENT '供应商类型',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
    country VARCHAR(100) DEFAULT NULL COMMENT '国家',
    city VARCHAR(100) DEFAULT NULL COMMENT '城市',
    address VARCHAR(500) DEFAULT NULL COMMENT '详细地址',
    contact_person VARCHAR(100) DEFAULT NULL COMMENT '联系人',
    contact_phone VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
    contact_email VARCHAR(100) DEFAULT NULL COMMENT '联系邮箱',
    tax_number VARCHAR(50) DEFAULT NULL COMMENT '税号',
    business_license VARCHAR(100) DEFAULT NULL COMMENT '营业执照号',
    bank_name VARCHAR(200) DEFAULT NULL COMMENT '开户银行',
    bank_account VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
    annual_capacity DECIMAL(15,2) DEFAULT NULL COMMENT '年产能',
    main_products TEXT DEFAULT NULL COMMENT '主要产品',
    quality_certification VARCHAR(200) DEFAULT NULL COMMENT '质量认证',
    iso_certificate VARCHAR(200) DEFAULT NULL COMMENT 'ISO证书',
    registered_date DATE DEFAULT NULL COMMENT '注册日期',
    annual_review_date DATE DEFAULT NULL COMMENT '年审日期',
    evaluation_level VARCHAR(10) DEFAULT NULL COMMENT '评级',
    delivery_score INT DEFAULT NULL COMMENT '交货评分',
    quality_score INT DEFAULT NULL COMMENT '质量评分',
    service_score INT DEFAULT NULL COMMENT '服务评分',
    comprehensive_score INT DEFAULT NULL COMMENT '综合评分',
    create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code),
    KEY idx_status (status),
    KEY idx_type (type),
    KEY idx_country (country),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- =====================================================
-- 3. 物料管理模块 (srm-material)
-- =====================================================

CREATE TABLE IF NOT EXISTS material_category (
    id BIGINT NOT NULL COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '分类编码',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    parent_id BIGINT DEFAULT NULL COMMENT '父分类ID',
    level INT NOT NULL DEFAULT 1 COMMENT '层级',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    description VARCHAR(500) DEFAULT NULL COMMENT '描述',
    create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code),
    KEY idx_parent_id (parent_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料分类表';

CREATE TABLE IF NOT EXISTS material (
    id BIGINT NOT NULL COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '物料编码',
    name VARCHAR(200) NOT NULL COMMENT '物料名称',
    specification VARCHAR(200) DEFAULT NULL COMMENT '规格',
    model VARCHAR(200) DEFAULT NULL COMMENT '型号',
    brand VARCHAR(100) DEFAULT NULL COMMENT '品牌',
    unit VARCHAR(20) NOT NULL COMMENT '单位',
    category_id BIGINT DEFAULT NULL COMMENT '分类ID',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    standard_price DECIMAL(15,2) DEFAULT NULL COMMENT '标准单价',
    min_order_quantity DECIMAL(15,4) DEFAULT NULL COMMENT '最小订购量',
    safety_stock DECIMAL(15,4) DEFAULT NULL COMMENT '安全库存',
    shelf_life INT DEFAULT NULL COMMENT '保质期(天)',
    origin VARCHAR(100) DEFAULT NULL COMMENT '产地',
    hs_code VARCHAR(20) DEFAULT NULL COMMENT '海关编码',
    material_type VARCHAR(50) DEFAULT NULL COMMENT '物料类型',
    description VARCHAR(500) DEFAULT NULL COMMENT '描述',
    technical_parameter TEXT DEFAULT NULL COMMENT '技术参数',
    create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (id),
    UNIQUE KEY uk_code (code),
    KEY idx_category_id (category_id),
    KEY idx_status (status),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料表';

CREATE TABLE IF NOT EXISTS material_supplier_rel (
    id BIGINT NOT NULL COMMENT '主键ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    supplier_price DECIMAL(15,4) DEFAULT NULL COMMENT '供应商报价',
    min_order_quantity DECIMAL(15,4) DEFAULT NULL COMMENT '最小订购量',
    lead_time INT DEFAULT NULL COMMENT '交货周期(天)',
    supplier_material_code VARCHAR(100) DEFAULT NULL COMMENT '供应商物料编码',
    is_preferred TINYINT(1) DEFAULT 0 COMMENT '是否首选供应商',
    create_by VARCHAR(64) DEFAULT NULL COMMENT '创建者',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_by VARCHAR(64) DEFAULT NULL COMMENT '更新者',
    update_time DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    remark VARCHAR(500) DEFAULT NULL COMMENT '备注',
    PRIMARY KEY (id),
    KEY idx_material_id (material_id),
    KEY idx_supplier_id (supplier_id),
    UNIQUE KEY uk_material_supplier (material_id, supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料供应商关联表';

-- =====================================================
-- 4. 定价管理模块 (srm-pricing)
-- =====================================================

CREATE TABLE IF NOT EXISTS pricing_strategy (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '策略编码',
    name VARCHAR(200) NOT NULL COMMENT '策略名称',
    type VARCHAR(20) NOT NULL COMMENT '定价类型',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
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

CREATE TABLE IF NOT EXISTS supplier_quote (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    quote_number VARCHAR(50) NOT NULL COMMENT '报价单号',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    pricing_strategy_id BIGINT COMMENT '关联定价策略ID',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '状态',
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

CREATE TABLE IF NOT EXISTS price_history (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    material_id BIGINT COMMENT '物料ID',
    supplier_id BIGINT COMMENT '供应商ID',
    pricing_strategy_id BIGINT COMMENT '关联定价策略ID',
    quote_id BIGINT COMMENT '关联报价ID',
    old_price DECIMAL(20, 4) COMMENT '原价',
    new_price DECIMAL(20, 4) COMMENT '新价格',
    change_rate DECIMAL(10, 4) COMMENT '变化率',
    change_type VARCHAR(20) NOT NULL COMMENT '变更类型',
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

-- =====================================================
-- 5. 合同管理模块 (srm-contract)
-- =====================================================

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

-- =====================================================
-- 6. 采购管理模块 (srm-purchase)
-- =====================================================

CREATE TABLE IF NOT EXISTS purchase_order (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    order_no VARCHAR(50) NOT NULL COMMENT '订单编号',
    title VARCHAR(200) NOT NULL COMMENT '订单标题',
    type VARCHAR(20) NOT NULL COMMENT '采购类型',
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

-- =====================================================
-- 7. 组织架构模块 (srm-organization)
-- =====================================================

CREATE TABLE IF NOT EXISTS organization_unit (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '组织编码',
    name VARCHAR(200) NOT NULL COMMENT '组织名称',
    type VARCHAR(20) NOT NULL COMMENT '组织类型',
    parent_id BIGINT COMMENT '父级ID',
    level INT DEFAULT 1 COMMENT '层级',
    path VARCHAR(500) COMMENT '路径',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    description VARCHAR(500) COMMENT '描述',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code),
    KEY idx_parent_id (parent_id),
    KEY idx_type (type),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='组织单元表';

CREATE TABLE IF NOT EXISTS employee (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    employee_no VARCHAR(50) NOT NULL COMMENT '员工编号',
    name VARCHAR(100) NOT NULL COMMENT '姓名',
    gender VARCHAR(10) COMMENT '性别',
    phone VARCHAR(50) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    position VARCHAR(100) COMMENT '职位',
    department VARCHAR(100) COMMENT '部门',
    unit_id BIGINT COMMENT '所属组织ID',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    entry_date DATE COMMENT '入职日期',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_employee_no (employee_no),
    KEY idx_unit_id (unit_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='员工表';

-- =====================================================
-- 8. 工作流模块 (srm-workflow)
-- =====================================================

CREATE TABLE IF NOT EXISTS workflow_definition (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '流程编码',
    name VARCHAR(200) NOT NULL COMMENT '流程名称',
    type VARCHAR(20) NOT NULL COMMENT '流程类型',
    form_schema TEXT COMMENT '表单配置(JSON)',
    flow_config TEXT COMMENT '流程配置(JSON)',
    approver_rules TEXT COMMENT '审批规则配置',
    is_active BOOLEAN DEFAULT FALSE COMMENT '是否启用',
    version INT DEFAULT 1 COMMENT '版本号',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流程定义表';

CREATE TABLE IF NOT EXISTS workflow_instance (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    instance_no VARCHAR(50) NOT NULL COMMENT '实例编号',
    definition_id BIGINT NOT NULL COMMENT '流程定义ID',
    business_type VARCHAR(50) COMMENT '业务类型',
    business_id BIGINT COMMENT '业务ID',
    business_data TEXT COMMENT '业务数据(JSON)',
    status VARCHAR(20) NOT NULL COMMENT '状态',
    current_node VARCHAR(50) COMMENT '当前节点',
    applicant_id BIGINT COMMENT '申请人ID',
    applicant_name VARCHAR(100) COMMENT '申请人姓名',
    submit_time DATETIME COMMENT '提交时间',
    complete_time DATETIME COMMENT '完成时间',
    feishu_instance_id VARCHAR(100) COMMENT '飞书审批实例ID',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_instance_no (instance_no),
    KEY idx_definition_id (definition_id),
    KEY idx_business (business_type, business_id),
    KEY idx_status (status),
    KEY idx_applicant_id (applicant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流程实例表';

CREATE TABLE IF NOT EXISTS workflow_task (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    instance_id BIGINT NOT NULL COMMENT '流程实例ID',
    node_key VARCHAR(50) NOT NULL COMMENT '节点Key',
    node_name VARCHAR(100) COMMENT '节点名称',
    assignee_id BIGINT COMMENT '审批人ID',
    assignee_name VARCHAR(100) COMMENT '审批人姓名',
    status VARCHAR(20) NOT NULL COMMENT '状态',
    assigned_time DATETIME COMMENT '分配时间',
    approved_time DATETIME COMMENT '审批时间',
    action VARCHAR(20) COMMENT '操作',
    comment TEXT COMMENT '审批意见',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    KEY idx_instance_id (instance_id),
    KEY idx_assignee_id (assignee_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流程任务表';

-- =====================================================
-- 9. 消息通知模块 (srm-notification)
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_message (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    message_no VARCHAR(50) NOT NULL COMMENT '消息编号',
    type VARCHAR(20) NOT NULL COMMENT '消息类型',
    channel VARCHAR(20) NOT NULL COMMENT '发送渠道',
    recipient VARCHAR(200) NOT NULL COMMENT '接收者',
    recipient_id VARCHAR(64) COMMENT '接收者ID',
    title VARCHAR(200) NOT NULL COMMENT '标题',
    content TEXT NOT NULL COMMENT '内容',
    template_code VARCHAR(50) COMMENT '模板编码',
    template_params TEXT COMMENT '模板参数(JSON)',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态',
    sent_time DATETIME COMMENT '发送时间',
    read_time DATETIME COMMENT '阅读时间',
    external_id VARCHAR(100) COMMENT '外部系统ID',
    external_response TEXT COMMENT '外部系统响应',
    retry_count INT DEFAULT 0 COMMENT '重试次数',
    error_message VARCHAR(500) COMMENT '错误信息',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_message_no (message_no),
    KEY idx_recipient_id (recipient_id),
    KEY idx_type (type),
    KEY idx_status (status),
    KEY idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知消息表';

CREATE TABLE IF NOT EXISTS notification_template (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '模板编码',
    name VARCHAR(200) NOT NULL COMMENT '模板名称',
    channel VARCHAR(20) NOT NULL COMMENT '发送渠道',
    type VARCHAR(20) NOT NULL COMMENT '模板类型',
    title_template VARCHAR(500) COMMENT '标题模板',
    content_template TEXT NOT NULL COMMENT '内容模板',
    variable_schema TEXT COMMENT '变量定义(JSON)',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code),
    KEY idx_channel (channel),
    KEY idx_type (type),
    KEY idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知模板表';

-- =====================================================
-- 10. ERP同步与集成模块
-- =====================================================

CREATE TABLE IF NOT EXISTS erp_sync_log (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    transaction_id VARCHAR(100) COMMENT '事务ID',
    sync_type VARCHAR(50) NOT NULL COMMENT '同步类型',
    sync_direction VARCHAR(20) NOT NULL COMMENT '同步方向',
    sync_status VARCHAR(20) DEFAULT 'PENDING' COMMENT '同步状态',
    sync_start_time DATETIME COMMENT '同步开始时间',
    sync_end_time DATETIME COMMENT '同步结束时间',
    record_count INT DEFAULT 0 COMMENT '同步记录数',
    success_count INT DEFAULT 0 COMMENT '成功数',
    fail_count INT DEFAULT 0 COMMENT '失败数',
    error_message TEXT COMMENT '错误信息',
    create_time DATETIME COMMENT '创建时间',
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ERP同步日志表';

CREATE TABLE IF NOT EXISTS feishu_config (
    config_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    app_id VARCHAR(100) NOT NULL COMMENT '飞书应用ID',
    app_secret VARCHAR(200) NOT NULL COMMENT '飞书应用密钥',
    tenant_key VARCHAR(100) COMMENT '租户Key',
    approval_code VARCHAR(100) COMMENT '审批流程Code',
    webhook_url VARCHAR(500) COMMENT 'Webhook地址',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='飞书配置表';

CREATE TABLE IF NOT EXISTS wecom_config (
    config_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    corp_id VARCHAR(100) NOT NULL COMMENT '企业ID',
    agent_id INT NOT NULL COMMENT '应用AgentId',
    agent_secret VARCHAR(200) NOT NULL COMMENT '应用密钥',
    token VARCHAR(200) COMMENT 'Token',
    encoding_aes_key VARCHAR(300) COMMENT 'EncodingAESKey',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='企业微信配置表';

CREATE TABLE IF NOT EXISTS supplier_wecom (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    wecom_user_id VARCHAR(100) COMMENT '企业微信用户ID',
    wecom_open_id VARCHAR(100) COMMENT '企业微信OpenID',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否激活',
    bind_time DATETIME COMMENT '绑定时间',
    create_time DATETIME COMMENT '创建时间',
    UNIQUE INDEX uk_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商企业微信关联表';

-- =====================================================
-- 初始化数据
-- =====================================================

INSERT INTO sys_config (config_name, config_key, config_value, config_type, create_time) VALUES
('主框架页-默认皮肤样式名称', 'sys.index.skinName', 'skin-blue', 'Y', NOW()),
('用户管理-账号初始密码', 'sys.user.initPassword', '123456', 'Y', NOW()),
('主框架页-侧边栏主题', 'sys.index.sideTheme', 'theme-dark', 'Y', NOW()),
('文件上传路径', 'sys.file.path', '/home/srm/upload', 'Y', NOW());

INSERT INTO sys_dict_type (dict_name, dict_type, status, create_time) VALUES
('用户性别', 'sys_user_sex', '0', NOW()),
('系统状态', 'sys_normal_disable', '0', NOW()),
('是否', 'sys_yes_no', '0', NOW());

INSERT INTO sys_dict_data (dict_sort, dict_label, dict_value, dict_type, css_class, list_class, is_default, status, create_time) VALUES
(1, '男', '0', 'sys_user_sex', NULL, NULL, 'Y', '0', NOW()),
(2, '女', '1', 'sys_user_sex', NULL, NULL, 'N', '0', NOW()),
(3, '未知', '2', 'sys_user_sex', NULL, NULL, 'N', '0', NOW()),
(1, '正常', '0', 'sys_normal_disable', NULL, 'primary', 'Y', '0', NOW()),
(2, '停用', '1', 'sys_normal_disable', NULL, 'danger', 'N', '0', NOW()),
(1, '是', 'Y', 'sys_yes_no', NULL, 'primary', 'Y', '0', NOW()),
(2, '否', 'N', 'sys_yes_no', NULL, 'danger', 'N', '0', NOW());

-- =====================================================
-- 数据库初始化完成
-- 共创建表: 28个
-- =====================================================
