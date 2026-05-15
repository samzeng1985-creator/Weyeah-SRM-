-- 插入测试用户
INSERT INTO org_user (username, password, real_name, email, phone, status) VALUES
('admin', 'admin123', '系统管理员', 'admin@weyeah.com', '13800138000', 'ACTIVE');

-- 插入测试部门
INSERT INTO department (code, name, parent_id, level, leader_id, leader_name, description, status, sort_order) VALUES
('DEPT001', '公司总部', 0, 1, NULL, NULL, '公司总部管理部门', 'ACTIVE', 1),
('DEPT002', '采购部', 1, 2, NULL, '张采购', '负责采购管理', 'ACTIVE', 1),
('DEPT003', '财务部', 1, 2, NULL, '李财务', '负责财务管理', 'ACTIVE', 2),
('DEPT004', '质量管理部', 1, 2, NULL, '王质量', '负责质量管控', 'ACTIVE', 3),
('DEPT005', '战略采购组', 2, 3, NULL, '刘战略', '战略采购团队', 'ACTIVE', 1),
('DEPT006', '运营采购组', 2, 3, NULL, '陈运营', '运营采购团队', 'ACTIVE', 2);

-- 插入测试员工
INSERT INTO employee (employee_no, name, gender, phone, email, department_id, department_name, position, position_level, hire_date, status) VALUES
('EMP001', '张采购', 'MALE', '13800138001', 'zhangcaigou@weyeah.com', 2, '采购部', '采购总监', 'DIRECTOR', '2020-01-15', 'ACTIVE'),
('EMP002', '李财务', 'MALE', '13800138002', 'licaiwu@weyeah.com', 3, '财务部', '财务经理', 'MANAGER', '2019-06-20', 'ACTIVE'),
('EMP003', '王质量', 'FEMALE', '13800138003', 'wangzhiliang@weyeah.com', 4, '质量管理部', '质量经理', 'MANAGER', '2019-08-10', 'ACTIVE'),
('EMP004', '刘战略', 'MALE', '13800138004', 'liuzhanlue@weyeah.com', 5, '战略采购组', '战略采购主管', 'LEADER', '2021-03-01', 'ACTIVE'),
('EMP005', '陈运营', 'MALE', '13800138005', 'chenyunying@weyeah.com', 6, '运营采购组', '运营采购主管', 'LEADER', '2021-05-15', 'ACTIVE');

-- 插入测试角色
INSERT INTO role (code, name, description, status, is_system, sort_order) VALUES
('ROLE_ADMIN', '系统管理员', '系统最高权限管理员', 'ACTIVE', 1, 1),
('ROLE_PURCHASE_DIRECTOR', '采购总监', '采购部门最高负责人', 'ACTIVE', 0, 2),
('ROLE_PURCHASE_MANAGER', '采购经理', '采购部门经理', 'ACTIVE', 0, 3),
('ROLE_PURCHASE_SPECIALIST', '采购专员', '采购执行人员', 'ACTIVE', 0, 4),
('ROLE_FINANCE', '财务经理', '财务管理角色', 'ACTIVE', 0, 5),
('ROLE_QUALITY', '质量经理', '质量管控角色', 'ACTIVE', 0, 6);

-- 插入测试权限
INSERT INTO permission (code, name, module, type, parent_id, path, icon, sort_order, status) VALUES
('SUPPLIER_VIEW', '查看供应商', 'supplier', 'BUTTON', 0, '/suppliers', 'fa-eye', 1, 'ACTIVE'),
('SUPPLIER_CREATE', '创建供应商', 'supplier', 'BUTTON', 0, '/suppliers', 'fa-plus', 2, 'ACTIVE'),
('SUPPLIER_EDIT', '编辑供应商', 'supplier', 'BUTTON', 0, '/suppliers', 'fa-edit', 3, 'ACTIVE'),
('SUPPLIER_DELETE', '删除供应商', 'supplier', 'BUTTON', 0, '/suppliers', 'fa-trash', 4, 'ACTIVE'),
('MATERIAL_VIEW', '查看物料', 'material', 'BUTTON', 0, '/materials', 'fa-eye', 1, 'ACTIVE'),
('MATERIAL_CREATE', '创建物料', 'material', 'BUTTON', 0, '/materials', 'fa-plus', 2, 'ACTIVE'),
('CONTRACT_VIEW', '查看合同', 'contract', 'BUTTON', 0, '/contracts', 'fa-eye', 1, 'ACTIVE'),
('CONTRACT_CREATE', '创建合同', 'contract', 'BUTTON', 0, '/contracts', 'fa-plus', 2, 'ACTIVE');

-- 插入测试供应商
INSERT INTO supplier (code, name, short_name, type, status, country, city, address, contact_person, contact_phone, contact_email, main_products, quality_certification, iso_certificate) VALUES
('SUP001', '上海燃气设备有限公司', '上海燃气', 'MANUFACTURER', 'QUALIFIED', '中国', '上海', '上海市浦东新区张江高科技园区', '张明', '13800138001', 'zhangming@shgas.com', '燃气轮机零部件、燃烧室组件', 'ISO9001', 'ISO9001:2015'),
('SUP002', '江苏精密机械制造有限公司', '江苏精密', 'MANUFACTURER', 'QUALIFIED', '中国', '苏州', '江苏省苏州市工业园区', '李华', '13800138002', 'lihua@jsprecision.com', '精密轴承、齿轮组件', 'ISO9001,TS16949', 'ISO9001:2015'),
('SUP003', '浙江材料科技有限公司', '浙江材料', 'TRADER', 'QUALIFIED', '中国', '杭州', '浙江省杭州市滨江区', '王强', '13800138003', 'wangqiang@zjmaterial.com', '高温合金材料、特种钢材', 'ISO9001', 'ISO9001:2015'),
('SUP004', '北京控制系统有限公司', '北京控制', 'MANUFACTURER', 'PENDING', '中国', '北京', '北京市海淀区中关村', '赵敏', '13800138004', 'zhaomin@bjcontrol.com', '控制系统、传感器', 'ISO9001,ISO14001', 'ISO9001:2015'),
('SUP005', '广东电气设备有限公司', '广东电气', 'MANUFACTURER', 'QUALIFIED', '中国', '深圳', '广东省深圳市宝安区', '陈伟', '13800138005', 'chenwei@gdelec.com', '电气元件、电缆线束', 'ISO9001', 'ISO9001:2015'),
('SUP006', '山东重型机械有限公司', '山东重工', 'MANUFACTURER', 'DRAFT', '中国', '济南', '山东省济南市高新区', '刘洋', '13800138006', 'liuyang@sdheavy.com', '大型铸件、锻件', NULL, NULL),
('SUP007', '天津国际贸易有限公司', '天津国际', 'AGENT', 'QUALIFIED', '中国', '天津', '天津市滨海新区', '孙丽', '13800138007', 'sunli@tjtrade.com', '进口零部件代理', 'ISO9001', 'ISO9001:2015'),
('SUP008', '四川动力设备有限公司', '四川动力', 'MANUFACTURER', 'SUSPENDED', '中国', '成都', '四川省成都市高新区', '周杰', '13800138008', 'zhoujie@scpower.com', '动力设备、发电机组', 'ISO9001', 'ISO9001:2015');

-- 插入测试物料
INSERT INTO material (code, name, specification, category, unit, description, status) VALUES
('MAT001', '燃气轮机叶片', '材质：高温合金，尺寸：200x100x50mm', '核心零部件', '件', '用于燃气轮机的一级动叶片', 'ACTIVE'),
('MAT002', '燃烧室组件', '材质：耐热钢，耐温：1200°C', '核心零部件', '套', '燃气轮机燃烧室全套组件', 'ACTIVE'),
('MAT003', '轴承组件', '型号：SKF 22320，双列调心滚子轴承', '标准件', '套', '主轴承箱用轴承组件', 'ACTIVE'),
('MAT004', '控制系统模块', '型号：Siemens S7-1500', '电气元件', '套', '燃气轮机控制系统PLC模块', 'ACTIVE'),
('MAT005', '润滑油', '型号：ISO VG 46，容量：200L', '耗材', '桶', '燃气轮机专用润滑油', 'ACTIVE');

-- 插入测试合同
INSERT INTO contract (code, name, supplier_id, type, amount, start_date, end_date, status, content) VALUES
('CON001', '2026年度燃气轮机叶片采购合同', 1, '采购合同', 1500000.00, '2026-01-01', '2026-12-31', 'EXECUTING', '采购燃气轮机一级动叶片500件'),
('CON002', '燃烧室组件供应协议', 1, '供应协议', 2800000.00, '2026-01-01', '2026-12-31', 'EXECUTING', '燃烧室组件年度供应协议'),
('CON003', '轴承组件采购合同', 2, '采购合同', 450000.00, '2026-03-01', '2026-08-31', 'EXECUTING', '轴承组件批量采购'),
('CON004', '控制系统升级合同', 4, '服务合同', 680000.00, '2026-02-15', '2026-05-15', 'EXECUTING', '控制系统软硬件升级服务'),
('CON005', '润滑油年度采购合同', 3, '采购合同', 120000.00, '2026-01-01', '2026-12-31', 'DRAFT', '润滑油年度框架协议');

-- 插入测试定价数据
INSERT INTO pricing (code, material_id, supplier_id, price, currency, unit, effective_date, status, remark) VALUES
('PRC001', 1, 1, 8500.00, 'CNY', '件', '2026-01-01', 'ACTIVE', '燃气轮机叶片定价'),
('PRC002', 2, 1, 12000.00, 'CNY', '套', '2026-01-01', 'ACTIVE', '燃烧室组件定价'),
('PRC003', 3, 2, 3200.00, 'CNY', '套', '2026-01-01', 'ACTIVE', '轴承组件定价'),
('PRC004', 4, 4, 45000.00, 'CNY', '套', '2026-02-01', 'PENDING', '控制系统模块定价待审批'),
('PRC005', 5, 3, 280.00, 'CNY', '桶', '2026-01-01', 'ACTIVE', '润滑油定价');
