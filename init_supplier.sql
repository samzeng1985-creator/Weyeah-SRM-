-- 创建供应商表
CREATE TABLE IF NOT EXISTS `supplier` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL COMMENT '供应商编码',
  `name` varchar(200) NOT NULL COMMENT '供应商名称',
  `short_name` varchar(100) DEFAULT NULL COMMENT '供应商简称',
  `type` varchar(50) DEFAULT 'MANUFACTURER' COMMENT '供应商类型：MANUFACTURER制造商, TRADER贸易商, AGENT代理商',
  `status` varchar(50) DEFAULT 'DRAFT' COMMENT '状态：DRAFT草稿, PENDING待审核, QUALIFIED合格, SUSPENDED暂停, BLACKLIST黑名单',
  `country` varchar(100) DEFAULT '中国' COMMENT '国家',
  `city` varchar(100) DEFAULT NULL COMMENT '城市',
  `address` varchar(500) DEFAULT NULL COMMENT '地址',
  `contact_person` varchar(100) DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(50) DEFAULT NULL COMMENT '联系电话',
  `contact_email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `tax_number` varchar(100) DEFAULT NULL COMMENT '税号',
  `business_license` varchar(100) DEFAULT NULL COMMENT '营业执照号',
  `bank_name` varchar(200) DEFAULT NULL COMMENT '开户银行',
  `bank_account` varchar(100) DEFAULT NULL COMMENT '银行账号',
  `main_products` text COMMENT '主要产品',
  `quality_certification` varchar(200) DEFAULT NULL COMMENT '质量认证',
  `iso_certificate` varchar(200) DEFAULT NULL COMMENT 'ISO证书',
  `remark` text COMMENT '备注',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  `del_flag` int DEFAULT '0' COMMENT '删除标志：0-未删除，1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- 插入测试数据
INSERT INTO `supplier` (`code`, `name`, `short_name`, `type`, `status`, `country`, `city`, `address`, `contact_person`, `contact_phone`, `contact_email`, `main_products`, `quality_certification`, `iso_certificate`) VALUES
('SUP001', '上海燃气设备有限公司', '上海燃气', 'MANUFACTURER', 'QUALIFIED', '中国', '上海', '上海市浦东新区张江高科技园区', '张明', '13800138001', 'zhangming@shgas.com', '燃气轮机零部件、燃烧室组件', 'ISO9001', 'ISO9001:2015'),
('SUP002', '江苏精密机械制造有限公司', '江苏精密', 'MANUFACTURER', 'QUALIFIED', '中国', '苏州', '江苏省苏州市工业园区', '李华', '13800138002', 'lihua@jsprecision.com', '精密轴承、齿轮组件', 'ISO9001,TS16949', 'ISO9001:2015'),
('SUP003', '浙江材料科技有限公司', '浙江材料', 'TRADER', 'QUALIFIED', '中国', '杭州', '浙江省杭州市滨江区', '王强', '13800138003', 'wangqiang@zjmaterial.com', '高温合金材料、特种钢材', 'ISO9001', 'ISO9001:2015'),
('SUP004', '北京控制系统有限公司', '北京控制', 'MANUFACTURER', 'PENDING', '中国', '北京', '北京市海淀区中关村', '赵敏', '13800138004', 'zhaomin@bjcontrol.com', '控制系统、传感器', 'ISO9001,ISO14001', 'ISO9001:2015'),
('SUP005', '广东电气设备有限公司', '广东电气', 'MANUFACTURER', 'QUALIFIED', '中国', '深圳', '广东省深圳市宝安区', '陈伟', '13800138005', 'chenwei@gdelec.com', '电气元件、电缆线束', 'ISO9001', 'ISO9001:2015'),
('SUP006', '山东重型机械有限公司', '山东重工', 'MANUFACTURER', 'DRAFT', '中国', '济南', '山东省济南市高新区', '刘洋', '13800138006', 'liuyang@sdheavy.com', '大型铸件、锻件', NULL, NULL),
('SUP007', '天津国际贸易有限公司', '天津国际', 'AGENT', 'QUALIFIED', '中国', '天津', '天津市滨海新区', '孙丽', '13800138007', 'sunli@tjtrade.com', '进口零部件代理', 'ISO9001', 'ISO9001:2015'),
('SUP008', '四川动力设备有限公司', '四川动力', 'MANUFACTURER', 'SUSPENDED', '中国', '成都', '四川省成都市高新区', '周杰', '13800138008', 'zhoujie@scpower.com', '动力设备、发电机组', 'ISO9001', 'ISO9001:2015');
