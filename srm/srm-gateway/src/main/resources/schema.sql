-- 用户表
CREATE TABLE IF NOT EXISTS org_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    department_id BIGINT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    avatar VARCHAR(200),
    remark VARCHAR(500),
    create_by BIGINT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_by BIGINT,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 供应商表
CREATE TABLE IF NOT EXISTS supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100),
    type VARCHAR(50) DEFAULT 'MANUFACTURER',
    status VARCHAR(50) DEFAULT 'DRAFT',
    country VARCHAR(100) DEFAULT '中国',
    city VARCHAR(100),
    address VARCHAR(500),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    tax_number VARCHAR(100),
    business_license VARCHAR(100),
    bank_name VARCHAR(200),
    bank_account VARCHAR(100),
    main_products TEXT,
    quality_certification VARCHAR(200),
    iso_certificate VARCHAR(200),
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    del_flag INT DEFAULT 0
);

-- 物料表
CREATE TABLE IF NOT EXISTS material (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    specification VARCHAR(500),
    category VARCHAR(100),
    unit VARCHAR(50),
    description TEXT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    del_flag INT DEFAULT 0
);

-- 合同表
CREATE TABLE IF NOT EXISTS contract (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    supplier_id BIGINT,
    type VARCHAR(50),
    amount DECIMAL(18,2),
    currency VARCHAR(10) DEFAULT 'CNY',
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'DRAFT',
    content TEXT,
    confidentiality_scope TEXT,
    confidentiality_period INT,
    confidentiality_obligations TEXT,
    liability_for_breach TEXT,
    dispute_resolution VARCHAR(500),
    governing_law VARCHAR(200),
    purchase_order_no VARCHAR(100),
    warehouse VARCHAR(200),
    delivery_address VARCHAR(500),
    delivery_method VARCHAR(100),
    quality_requirements TEXT,
    acceptance_criteria TEXT,
    warranty_period INT,
    penalty_rate DECIMAL(5,2),
    drawing_no VARCHAR(100),
    drawing_version VARCHAR(20),
    processing_requirements TEXT,
    material_requirements TEXT,
    quality_monitoring TEXT,
    intellectual_property TEXT,
    payment_terms TEXT,
    attachment_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    del_flag INT DEFAULT 0
);

-- 定价表
CREATE TABLE IF NOT EXISTS pricing (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50),
    material_id BIGINT,
    supplier_id BIGINT,
    price DECIMAL(18,2),
    tax_rate DECIMAL(5,2) DEFAULT 13.00,
    price_with_tax DECIMAL(18,2),
    min_order_qty DECIMAL(18,4) DEFAULT 1,
    currency VARCHAR(20) DEFAULT 'CNY',
    unit VARCHAR(50),
    effective_date DATE,
    expiry_date DATE,
    price_terms VARCHAR(100),
    payment_terms VARCHAR(100),
    delivery_cycle INT,
    status VARCHAR(20) DEFAULT 'PENDING',
    remark TEXT,
    price_change_reason VARCHAR(100),
    price_change_detail TEXT,
    original_price DECIMAL(18,2),
    price_increase_rate DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    del_flag INT DEFAULT 0
);

-- 部门表
CREATE TABLE IF NOT EXISTS department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    leader_id BIGINT,
    leader_name VARCHAR(100),
    description VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 员工表
CREATE TABLE IF NOT EXISTS employee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_no VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    department_id BIGINT NOT NULL,
    department_name VARCHAR(100),
    position VARCHAR(100),
    position_level VARCHAR(20),
    hire_date DATE,
    leave_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 角色表
CREATE TABLE IF NOT EXISTS role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_system INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 权限表
CREATE TABLE IF NOT EXISTS permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    module VARCHAR(50),
    type VARCHAR(20) DEFAULT 'BUTTON',
    parent_id BIGINT DEFAULT 0,
    path VARCHAR(200),
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del_flag INT DEFAULT 0
);

-- 联系人表
CREATE TABLE IF NOT EXISTS contact_person (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 合作记录表
CREATE TABLE IF NOT EXISTS cooperation_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT NOT NULL,
    start_date DATE,
    end_date DATE,
    cooperation_type VARCHAR(50),
    contract_no VARCHAR(100),
    amount DECIMAL(18,4),
    currency VARCHAR(10),
    status VARCHAR(20),
    description TEXT,
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 供应商评估表
CREATE TABLE IF NOT EXISTS supplier_evaluation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT NOT NULL,
    evaluation_date DATE NOT NULL,
    period_type VARCHAR(20),
    quality_score DECIMAL(5,2),
    delivery_score DECIMAL(5,2),
    price_score DECIMAL(5,2),
    service_score DECIMAL(5,2),
    comprehensive_score DECIMAL(5,2),
    rating VARCHAR(10),
    evaluator VARCHAR(100),
    evaluation_opinion TEXT,
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS role_permission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 供应商资质文件表
CREATE TABLE IF NOT EXISTS supplier_qualification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    file_url VARCHAR(500),
    file_type VARCHAR(20),
    file_size BIGINT,
    issue_date DATE,
    expiry_date DATE,
    has_expiry BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'VALID',
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 物料品类表
CREATE TABLE IF NOT EXISTS category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    level INT DEFAULT 1,
    description VARCHAR(500),
    is_leaf BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_by VARCHAR(50),
    del_flag INT DEFAULT 0
);

-- 合同明细表
CREATE TABLE IF NOT EXISTS contract_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    material_id BIGINT,
    material_code VARCHAR(50),
    material_name VARCHAR(200),
    material_spec VARCHAR(500),
    material_model VARCHAR(200),
    snapshot_data TEXT,
    quantity DECIMAL(18,4) NOT NULL,
    unit VARCHAR(20),
    unit_price DECIMAL(18,4) NOT NULL,
    total_price DECIMAL(18,4) NOT NULL,
    sort_order INT DEFAULT 0,
    remark VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del_flag INT DEFAULT 0
);

-- 物流记录表
CREATE TABLE IF NOT EXISTS logistics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    contract_id BIGINT NOT NULL,
    contract_code VARCHAR(50),
    logistics_no VARCHAR(100),
    logistics_company VARCHAR(200),
    sender_name VARCHAR(100),
    sender_contact VARCHAR(100),
    sender_phone VARCHAR(50),
    sender_address VARCHAR(500),
    receiver_name VARCHAR(100),
    receiver_contact VARCHAR(100),
    receiver_phone VARCHAR(50),
    receiver_address VARCHAR(500),
    warehouse VARCHAR(100),
    delivery_address VARCHAR(500),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    actual_arrival_date DATE,
    status VARCHAR(50) DEFAULT 'PENDING',
    current_location VARCHAR(200),
    tracking_info TEXT,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    del_flag INT DEFAULT 0
);
