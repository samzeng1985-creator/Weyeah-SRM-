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
