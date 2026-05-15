-- =====================================================
-- 数据库初始化脚本
-- 数据库：srm_system
-- 字符集：utf8mb4
-- 排序规则：utf8mb4_unicode_ci
-- 创建日期：2026-05-12
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS srm_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE srm_system;

-- =====================================================
-- 1. 系统管理模块
-- =====================================================

-- 用户表
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

-- 部门表
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

-- 角色表
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

-- 菜单表
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

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id BIGINT NOT NULL COMMENT '角色ID',
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 角色菜单关联表
CREATE TABLE IF NOT EXISTS sys_role_menu (
    role_id BIGINT NOT NULL COMMENT '角色ID',
    menu_id BIGINT NOT NULL COMMENT '菜单ID',
    PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- =====================================================
-- 2. 系统配置模块
-- =====================================================

-- 字典类型表
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

-- 字典数据表
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

-- 系统配置表
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
-- 3. 供应商管理模块
-- =====================================================

-- 供应商主表
CREATE TABLE IF NOT EXISTS supplier (
    supplier_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '供应商ID',
    erp_code VARCHAR(50) COMMENT 'ERP编码',
    supplier_type VARCHAR(20) NOT NULL COMMENT '供应商类型',
    supplier_name VARCHAR(200) NOT NULL COMMENT '供应商名称',
    supplier_code VARCHAR(50) NOT NULL COMMENT '供应商编码',
    credit_code VARCHAR(50) COMMENT '统一社会信用代码',
    register_address VARCHAR(500) COMMENT '注册地址',
    country VARCHAR(100) COMMENT '国家',
    province VARCHAR(100) COMMENT '省份',
    city VARCHAR(100) COMMENT '城市',
    supplier_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' COMMENT '供应商状态',
    security_locked TINYINT(1) DEFAULT 0 COMMENT '安全锁定开关',
    last_annual_review_date DATE COMMENT '最近年审日期',
    annual_review_status VARCHAR(20) COMMENT '年审状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_supplier_code (supplier_code),
    INDEX idx_erp_code (erp_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商主表';

-- 供应商联系人表
CREATE TABLE IF NOT EXISTS supplier_contact (
    contact_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '联系人ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    contact_name VARCHAR(100) NOT NULL COMMENT '联系人姓名',
    contact_position VARCHAR(100) COMMENT '联系人职位',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    contact_email VARCHAR(100) COMMENT '联系邮箱',
    is_default TINYINT(1) DEFAULT 0 COMMENT '是否主要联系人',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商联系人表';

-- 供应商资质文件表
CREATE TABLE IF NOT EXISTS supplier_qualification (
    qual_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '资质ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    qual_type VARCHAR(50) NOT NULL COMMENT '资质类型',
    qual_name VARCHAR(200) NOT NULL COMMENT '资质名称',
    file_name VARCHAR(200) NOT NULL COMMENT '文件名称',
    file_url VARCHAR(500) NOT NULL COMMENT '文件地址',
    expire_date DATE COMMENT '到期日期',
    status VARCHAR(20) COMMENT '状态',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商资质文件表';

-- =====================================================
-- 4. 物料管理模块
-- =====================================================

-- 物料分类表
CREATE TABLE IF NOT EXISTS material_category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    category_name VARCHAR(200) NOT NULL COMMENT '分类名称',
    category_code VARCHAR(50) COMMENT '分类编码',
    erp_code VARCHAR(50) COMMENT 'ERP编码',
    level INT COMMENT '层级',
    order_num INT DEFAULT 0 COMMENT '排序',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料分类表';

-- 物料主表
CREATE TABLE IF NOT EXISTS material (
    material_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '物料ID',
    material_code VARCHAR(50) NOT NULL COMMENT '物料编码',
    erp_code VARCHAR(50) COMMENT 'ERP编码',
    material_name VARCHAR(200) NOT NULL COMMENT '物料名称',
    specification VARCHAR(500) COMMENT '规格型号',
    material_type VARCHAR(20) COMMENT '物料类型',
    unit VARCHAR(20) COMMENT '单位',
    category_id BIGINT COMMENT '分类ID',
    drawing_url VARCHAR(500) COMMENT '图纸地址',
    drawing_version VARCHAR(50) COMMENT '图纸版本',
    applicable_models VARCHAR(500) COMMENT '适用机型',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_material_code (material_code),
    INDEX idx_erp_code (erp_code),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料主表';

-- 物料供应商关联表
CREATE TABLE IF NOT EXISTS material_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    is_primary TINYINT(1) DEFAULT 0 COMMENT '是否主要供应商',
    create_time DATETIME COMMENT '创建时间',
    UNIQUE INDEX uk_material_supplier (material_id, supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物料供应商关联表';

-- =====================================================
-- 5. 定价管理模块
-- =====================================================

-- 定价主表
CREATE TABLE IF NOT EXISTS pricing (
    pricing_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '定价ID',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    pricing_code VARCHAR(50) COMMENT '定价编码',
    effective_date DATE NOT NULL COMMENT '生效日期',
    expiry_date DATE COMMENT '失效日期',
    pricing_status VARCHAR(20) DEFAULT 'DRAFT' COMMENT '状态',
    review_status VARCHAR(20) COMMENT '审批状态',
    reviewer_id BIGINT COMMENT '审批人ID',
    review_time DATETIME COMMENT '审批时间',
    review_remark VARCHAR(500) COMMENT '审批备注',
    price_increase_remark VARCHAR(500) COMMENT '涨价原因',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定价主表';

-- 定价明细表
CREATE TABLE IF NOT EXISTS pricing_item (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '明细ID',
    pricing_id BIGINT NOT NULL COMMENT '定价ID',
    material_id BIGINT NOT NULL COMMENT '物料ID',
    price DECIMAL(18,4) NOT NULL COMMENT '单价',
    tax_rate DECIMAL(10,2) COMMENT '税率',
    min_order_qty INT COMMENT '最小起订量',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_pricing_id (pricing_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定价明细表';

-- =====================================================
-- 6. 合同管理模块
-- =====================================================

-- 合同主表
CREATE TABLE IF NOT EXISTS contract (
    contract_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '合同ID',
    contract_code VARCHAR(50) NOT NULL COMMENT '合同编码',
    contract_type VARCHAR(20) NOT NULL COMMENT '合同类型',
    supplier_id BIGINT COMMENT '供应商ID',
    contract_title VARCHAR(500) NOT NULL COMMENT '合同标题',
    contract_content TEXT COMMENT '合同内容',
    template_id BIGINT COMMENT '模板ID',
    effective_date DATE COMMENT '生效日期',
    expiry_date DATE COMMENT '失效日期',
    contract_status VARCHAR(20) DEFAULT 'DRAFT' COMMENT '合同状态',
    warehouse_type VARCHAR(20) COMMENT '入库仓库类型',
    total_amount DECIMAL(18,4) DEFAULT 0.0000 COMMENT '合同总金额',
    review_status VARCHAR(20) COMMENT '审批状态',
    review_process_id VARCHAR(100) COMMENT '飞书审批流程ID',
    sign_status VARCHAR(20) COMMENT '签署状态',
    sign_date DATE COMMENT '签署日期',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_contract_code (contract_code),
    INDEX idx_supplier_id (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同主表';

-- 合同明细表
CREATE TABLE IF NOT EXISTS contract_item (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '明细ID',
    contract_id BIGINT NOT NULL COMMENT '合同ID',
    material_id BIGINT COMMENT '物料ID',
    material_snapshot_name VARCHAR(200) COMMENT '物料名称快照',
    material_snapshot_model VARCHAR(500) COMMENT '规格型号快照',
    material_snapshot_drawing_version VARCHAR(50) COMMENT '图纸版本快照',
    snapshot_time DATETIME COMMENT '快照时间',
    quantity INT NOT NULL COMMENT '数量',
    unit VARCHAR(20) COMMENT '单位',
    unit_price DECIMAL(18,4) NOT NULL COMMENT '单价',
    tax_rate DECIMAL(10,2) COMMENT '税率',
    total_price DECIMAL(18,4) NOT NULL COMMENT '金额',
    total_price_with_tax DECIMAL(18,4) COMMENT '含税金额',
    item_type VARCHAR(20) DEFAULT 'MATERIAL' COMMENT '明细类型',
    remark VARCHAR(500) COMMENT '备注',
    INDEX idx_contract_id (contract_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同明细表';

-- 合同模板表
CREATE TABLE IF NOT EXISTS contract_template (
    template_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '模板ID',
    template_code VARCHAR(50) NOT NULL COMMENT '模板编码',
    template_name VARCHAR(200) NOT NULL COMMENT '模板名称',
    template_type VARCHAR(20) NOT NULL COMMENT '模板类型',
    language VARCHAR(10) DEFAULT 'zh_CN' COMMENT '语言',
    content TEXT NOT NULL COMMENT '模板内容',
    variables TEXT COMMENT '变量定义',
    version INT DEFAULT 1 COMMENT '版本号',
    is_current TINYINT(1) DEFAULT 1 COMMENT '是否当前版本',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    remark VARCHAR(500) COMMENT '备注',
    UNIQUE INDEX idx_template_code (template_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同模板表';

-- =====================================================
-- 7. 集成管理模块
-- =====================================================

-- ERP同步日志表
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

-- 飞书配置表
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

-- 企业微信配置表
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

-- 供应商企业微信关联表
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

-- 初始化系统配置
INSERT INTO sys_config (config_name, config_key, config_value, config_type, create_time) VALUES
('主框架页-默认皮肤样式名称', 'sys.index.skinName', 'skin-blue', 'Y', NOW()),
('用户管理-账号初始密码', 'sys.user.initPassword', '123456', 'Y', NOW()),
('主框架页-侧边栏主题', 'sys.index.sideTheme', 'theme-dark', 'Y', NOW()),
('文件上传路径', 'sys.file.path', '/home/srm/upload', 'Y', NOW());

-- 初始化字典类型
INSERT INTO sys_dict_type (dict_name, dict_type, status, create_time) VALUES
('用户性别', 'sys_user_sex', '0', NOW()),
('系统状态', 'sys_normal_disable', '0', NOW()),
('是否', 'sys_yes_no', '0', NOW());

-- 初始化字典数据
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
-- =====================================================
