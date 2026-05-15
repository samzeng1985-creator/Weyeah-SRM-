-- =============================================
-- 工作流模块数据库脚本
-- 模块: srm-workflow
-- =============================================

-- ---------------------------------------------
-- 1. 流程定义表
-- ---------------------------------------------
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

-- ---------------------------------------------
-- 2. 流程实例表
-- ---------------------------------------------
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

-- ---------------------------------------------
-- 3. 流程任务表
-- ---------------------------------------------
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
