-- =============================================
-- 消息通知模块数据库脚本
-- 模块: srm-notification
-- =============================================

-- ---------------------------------------------
-- 1. 通知消息表
-- ---------------------------------------------
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

-- ---------------------------------------------
-- 2. 通知模板表
-- ---------------------------------------------
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
