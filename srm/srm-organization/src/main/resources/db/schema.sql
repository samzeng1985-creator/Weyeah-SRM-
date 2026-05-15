-- =============================================
-- 组织架构模块数据库脚本
-- 模块: srm-organization
-- =============================================

-- ---------------------------------------------
-- 1. 部门表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS org_department (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    code VARCHAR(50) NOT NULL COMMENT '部门编码',
    name VARCHAR(200) NOT NULL COMMENT '部门名称',
    type VARCHAR(20) NOT NULL COMMENT '组织类型',
    parent_id BIGINT COMMENT '父级ID',
    full_path VARCHAR(500) COMMENT '完整路径',
    sort_order INT DEFAULT 0 COMMENT '排序',
    leader_id VARCHAR(64) COMMENT '负责人ID',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_code (code),
    KEY idx_parent_id (parent_id),
    KEY idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';

-- ---------------------------------------------
-- 2. 用户表
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS org_user (
    id BIGINT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(50) COMMENT '电话',
    department_id BIGINT COMMENT '部门ID',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '状态',
    avatar VARCHAR(500) COMMENT '头像',
    remark VARCHAR(500) COMMENT '备注',
    create_by VARCHAR(64) COMMENT '创建者',
    create_time DATETIME COMMENT '创建时间',
    update_by VARCHAR(64) COMMENT '更新者',
    update_time DATETIME COMMENT '更新时间',
    UNIQUE KEY uk_username (username),
    KEY idx_department_id (department_id),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
