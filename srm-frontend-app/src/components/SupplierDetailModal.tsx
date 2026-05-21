import { useState, useEffect } from 'react';
import { Supplier, SupplierTag } from '../types';
import { qualificationApi, SupplierQualification, QualificationCreate } from '../services/supplierQualification';
import { contactPersonApi, ContactPerson, ContactPersonCreate } from '../services/contactPerson';
import { cooperationRecordApi, CooperationRecord, CooperationRecordCreate } from '../services/cooperationRecord';
import { supplierEvaluationApi, SupplierEvaluation, SupplierEvaluationCreate } from '../services/supplierEvaluation';
import { supplierTagApi } from '../services/supplier';
import { contractApi } from '../services/contract';
import type { Contract } from '../types';

interface SupplierDetailModalProps {
  supplier: Supplier;
  onClose: () => void;
}

export default function SupplierDetailModal({ supplier, onClose }: SupplierDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'qualifications' | 'contacts' | 'cooperation' | 'evaluations' | 'contracts' | 'tags'>('info');
  const [currentSupplier, setCurrentSupplier] = useState<Supplier>(supplier);
  
  const [qualifications, setQualifications] = useState<SupplierQualification[]>([]);
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [cooperationRecords, setCooperationRecords] = useState<CooperationRecord[]>([]);
  const [evaluations, setEvaluations] = useState<SupplierEvaluation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tags, setTags] = useState<SupplierTag[]>([]);
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'qualification' | 'contact' | 'cooperation' | 'evaluation'>('qualification');
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, [supplier.id]);

  const loadAllData = async () => {
    await Promise.all([
      loadQualifications(),
      loadContacts(),
      loadCooperationRecords(),
      loadEvaluations(),
      loadContracts(),
      loadTags(),
    ]);
  };

  const loadTags = async () => {
    try {
      const response = await supplierTagApi.getBySupplierId(supplier.id!);
      if (response.success && response.data) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const loadQualifications = async () => {
    try {
      const response = await qualificationApi.getBySupplierId(supplier.id!);
      if (response.success && response.data) {
        setQualifications(response.data);
      }
    } catch (error) {
      console.error('加载资质文件失败:', error);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await contactPersonApi.getBySupplierId(supplier.id!);
      if (response.success && response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error('加载联系人失败:', error);
    }
  };

  const loadCooperationRecords = async () => {
    try {
      const response = await cooperationRecordApi.getBySupplierId(supplier.id!);
      if (response.success && response.data) {
        setCooperationRecords(response.data);
      }
    } catch (error) {
      console.error('加载合作记录失败:', error);
    }
  };

  const loadEvaluations = async () => {
    try {
      const response = await supplierEvaluationApi.getBySupplierId(supplier.id!);
      if (response.success && response.data) {
        setEvaluations(response.data);
      }
    } catch (error) {
      console.error('加载评估记录失败:', error);
    }
  };

  const loadContracts = async () => {
    try {
      const response = await contractApi.getList({ supplierId: supplier.id });
      if (response.success && response.data) {
        setContracts(response.data.list || []);
      }
    } catch (error) {
      console.error('加载合同失败:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const colors = { success: 'bg-green-500', error: 'bg-red-500' };
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-[100] px-6 py-4 rounded-lg text-white shadow-lg ${colors[type]}`;
    notification.innerHTML = `<div class="flex items-center gap-3"><i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span></div>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.style.opacity = '0'; notification.style.transition = 'opacity 0.3s'; setTimeout(() => notification.remove(), 300); }, 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let response;
      if (modalType === 'qualification') {
        if (isEdit && editData?.id) {
          response = await qualificationApi.update(editData.id, editData);
        } else {
          response = await qualificationApi.create({ ...editData, supplierId: supplier.id } as QualificationCreate);
        }
        if (response.success) { loadQualifications(); showNotification('保存成功'); }
      } else if (modalType === 'contact') {
        if (isEdit && editData?.id) {
          response = await contactPersonApi.update(editData.id, editData);
        } else {
          response = await contactPersonApi.create({ ...editData, supplierId: supplier.id } as ContactPersonCreate);
        }
        if (response.success) { loadContacts(); showNotification('保存成功'); }
      } else if (modalType === 'cooperation') {
        if (isEdit && editData?.id) {
          response = await cooperationRecordApi.update(editData.id, editData);
        } else {
          response = await cooperationRecordApi.create({ ...editData, supplierId: supplier.id } as CooperationRecordCreate);
        }
        if (response.success) { loadCooperationRecords(); showNotification('保存成功'); }
      } else if (modalType === 'evaluation') {
        if (isEdit && editData?.id) {
          response = await supplierEvaluationApi.update(editData.id, editData);
        } else {
          response = await supplierEvaluationApi.create({ ...editData, supplierId: supplier.id } as SupplierEvaluationCreate);
        }
        if (response.success) { loadEvaluations(); showNotification('保存成功'); }
      }
      if (response && !response.success) showNotification(response.message || '保存失败', 'error');
    } catch (error) {
      console.error('保存失败:', error);
      showNotification('保存失败', 'error');
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('确定要删除吗？')) return;
    try {
      let response;
      if (type === 'qualification') response = await qualificationApi.delete(id);
      else if (type === 'contact') response = await contactPersonApi.delete(id);
      else if (type === 'cooperation') response = await cooperationRecordApi.delete(id);
      else if (type === 'evaluation') response = await supplierEvaluationApi.delete(id);
      else if (type === 'tag') response = await supplierTagApi.delete(id);
      
      if (response?.success) {
        showNotification('删除成功');
        if (type === 'qualification') loadQualifications();
        else if (type === 'contact') loadContacts();
        else if (type === 'cooperation') loadCooperationRecords();
        else if (type === 'evaluation') loadEvaluations();
        else if (type === 'tag') loadTags();
      }
    } catch (error) {
      console.error('删除失败:', error);
      showNotification('删除失败', 'error');
    }
  };

  const handleAddTag = async (tagName: string) => {
    if (!tagName.trim()) return;
    try {
      const response = await supplierTagApi.create({
        supplierId: supplier.id!,
        tagName: tagName.trim(),
        tagColor: getRandomColor()
      });
      if (response.success) {
        showNotification('标签添加成功');
        loadTags();
      }
    } catch (error) {
      console.error('添加标签失败:', error);
      showNotification('添加标签失败', 'error');
    }
  };

  const getRandomColor = () => {
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const openModal = (type: typeof modalType, data?: any) => {
    setModalType(type);
    setIsEdit(!!data);
    setEditData(data || getDefaultData(type));
    setShowModal(true);
  };

  const getDefaultData = (type: typeof modalType) => {
    if (type === 'qualification') return { type: 'BUSINESS_LICENSE', name: '', hasExpiry: true };
    if (type === 'contact') return { name: '', isPrimary: false };
    if (type === 'cooperation') return { status: 'ACTIVE' };
    if (type === 'evaluation') return { evaluationDate: new Date().toISOString().split('T')[0] };
    return {};
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      QUALIFIED: 'bg-green-100 text-green-700',
      SUSPENDED: 'bg-red-100 text-red-700',
      BLACKLIST: 'bg-gray-500 text-white',
      ACTIVE: 'bg-green-100 text-green-700',
      INACTIVE: 'bg-gray-100 text-gray-700',
      VALID: 'bg-green-100 text-green-700',
      EXPIRING_SOON: 'bg-yellow-100 text-yellow-700',
      EXPIRED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const getRatingClass = (rating: string) => {
    const map: Record<string, string> = {
      A: 'bg-green-100 text-green-700',
      B: 'bg-blue-100 text-blue-700',
      C: 'bg-yellow-100 text-yellow-700',
      D: 'bg-orange-100 text-orange-700',
      E: 'bg-red-100 text-red-700',
    };
    return map[rating] || 'bg-gray-100 text-gray-700';
  };

  const calculateRating = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
  };

  const calculateComprehensiveScore = (data: any) => {
    const quality = (data.qualityScore || 0) * 0.30;
    const delivery = (data.deliveryScore || 0) * 0.25;
    const price = (data.priceScore || 0) * 0.20;
    const service = (data.serviceScore || 0) * 0.15;
    return Math.round((quality + delivery + price + service) * 100) / 100;
  };

  const getQualificationTypeName = (type: string) => {
    const map: Record<string, string> = {
      BUSINESS_LICENSE: '营业执照', TAX_REGISTRATION: '税务登记证', ORG_CODE: '组织机构代码证',
      BANK_PERMIT: '开户许可证', ISO_CERT: 'ISO认证', INDUSTRY_CERT: '行业资质证书',
      AGENT_AUTH: '代理授权书', PRODUCTION_LICENSE: '生产许可证', OTHER: '其他',
    };
    return map[type] || type;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: '草稿',
      PENDING: '待审核',
      QUALIFIED: '合格',
      SUSPENDED: '暂停合作',
      BLACKLIST: '黑名单',
      EXPIRED: '已过期',
    };
    return map[status] || status || '未知';
  };

  const getEnterpriseNatureText = (nature: string) => {
    const map: Record<string, string> = {
      DOMESTIC: '国内企业',
      OVERSEAS: '海外企业',
    };
    return map[nature] || nature || '-';
  };

  const renderInfoTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fas fa-building text-weyeah-blue"></i>基本信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">供应商编码</div><div className="font-medium">{currentSupplier.code || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">供应商名称</div><div className="font-medium">{currentSupplier.name || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">英文名称</div><div className="font-medium">{currentSupplier.englishName || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">供应商简称</div><div className="font-medium">{currentSupplier.shortName || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">企业性质</div><div className="font-medium">{getEnterpriseNatureText(currentSupplier.enterpriseNature || '')}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">状态</div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(currentSupplier.status)}`}>{getStatusText(currentSupplier.status)}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">安全锁定</div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentSupplier.securityLocked === 1 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
              {currentSupplier.securityLocked === 1 ? '已锁定' : '正常'}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">年审日期</div><div className="font-medium">{currentSupplier.annualReviewDate || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2"><div className="text-sm text-gray-500 mb-1">主要产品</div><div className="font-medium">{currentSupplier.mainProducts || '-'}</div></div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><i className="fas fa-address-card text-weyeah-blue"></i>联系信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">联系人</div><div className="font-medium">{currentSupplier.contactPerson || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">联系电话</div><div className="font-medium">{currentSupplier.contactPhone || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">邮箱</div><div className="font-medium">{currentSupplier.contactEmail || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">地址</div><div className="font-medium">{currentSupplier.address || '-'}</div></div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><i className="fas fa-credit-card text-weyeah-blue"></i>银行账户信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">开户银行</div><div className="font-medium">{currentSupplier.bankName || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500 mb-1">账户名称</div><div className="font-medium">{currentSupplier.bankAccountName || '-'}</div></div>
          <div className="bg-gray-50 p-4 rounded-lg md:col-span-2"><div className="text-sm text-gray-500 mb-1">银行账号</div><div className="font-medium font-mono">{currentSupplier.bankAccount || '-'}</div></div>
        </div>
      </div>
    </div>
  );

  const renderQualificationsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><i className="fas fa-certificate text-weyeah-blue"></i>资质文件 ({qualifications.length})</h3>
        <button onClick={() => openModal('qualification')} className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"><i className="fas fa-plus"></i>新增</button>
      </div>
      {qualifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><i className="fas fa-folder-open text-4xl mb-4"></i><p>暂无资质文件</p></div>
      ) : (
        <div className="space-y-3">
          {qualifications.map((qual) => (
            <div key={qual.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{qual.name}</span>
                    <span className="text-sm text-gray-500">({getQualificationTypeName(qual.type)})</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(qual.status)}`}>{qual.status === 'VALID' ? '有效' : qual.status === 'EXPIRING_SOON' ? '即将过期' : '已过期'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {qual.issueDate && <div><span className="text-gray-500">颁发日期：</span>{qual.issueDate}</div>}
                    {qual.expiryDate && <div><span className="text-gray-500">到期日期：</span>{qual.expiryDate}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('qualification', qual)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete('qualification', qual.id!)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContactsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><i className="fas fa-users text-weyeah-blue"></i>联系人 ({contacts.length})</h3>
        <button onClick={() => openModal('contact')} className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"><i className="fas fa-plus"></i>新增</button>
      </div>
      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><i className="fas fa-user-friends text-4xl mb-4"></i><p>暂无联系人</p></div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{contact.name}</span>
                    {contact.isPrimary && <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">主要</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {contact.position && <div><span className="text-gray-500">职位：</span>{contact.position}</div>}
                    {contact.phone && <div><span className="text-gray-500">电话：</span>{contact.phone}</div>}
                    {contact.email && <div><span className="text-gray-500">邮箱：</span>{contact.email}</div>}
                    {contact.department && <div><span className="text-gray-500">部门：</span>{contact.department}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('contact', contact)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete('contact', contact.id!)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCooperationTab = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><i className="fas fa-handshake text-weyeah-blue"></i>合作记录 ({cooperationRecords.length})</h3>
        <button onClick={() => openModal('cooperation')} className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"><i className="fas fa-plus"></i>新增</button>
      </div>
      {cooperationRecords.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><i className="fas fa-history text-4xl mb-4"></i><p>暂无合作记录</p></div>
      ) : (
        <div className="space-y-3">
          {cooperationRecords.map((record) => (
            <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{record.cooperationType || '合作'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(record.status || '')}`}>{record.status === 'ACTIVE' ? '进行中' : record.status === 'COMPLETED' ? '已完成' : record.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    {record.startDate && <div><span className="text-gray-500">开始日期：</span>{record.startDate}</div>}
                    {record.endDate && <div><span className="text-gray-500">结束日期：</span>{record.endDate}</div>}
                    {record.contractNo && <div><span className="text-gray-500">合同号：</span>{record.contractNo}</div>}
                    {record.amount && <div><span className="text-gray-500">金额：</span>{record.amount.toLocaleString()} {record.currency || 'CNY'}</div>}
                  </div>
                  {record.description && <div className="mt-2 text-sm text-gray-600">{record.description}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('cooperation', record)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete('cooperation', record.id!)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEvaluationsTab = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><i className="fas fa-star text-weyeah-blue"></i>评估记录 ({evaluations.length})</h3>
        <button onClick={() => openModal('evaluation')} className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 flex items-center gap-2"><i className="fas fa-plus"></i>新增评估</button>
      </div>
      {evaluations.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><i className="fas fa-clipboard-list text-4xl mb-4"></i><p>暂无评估记录</p></div>
      ) : (
        <div className="space-y-3">
          {evaluations.map((eval_) => (
            <div key={eval_.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{eval_.evaluationDate}</span>
                    {eval_.rating && <span className={`px-3 py-1 rounded-full text-lg font-bold ${getRatingClass(eval_.rating)}`}>{eval_.rating}级</span>}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{eval_.periodType === 'QUARTERLY' ? '季度评估' : eval_.periodType === 'ANNUAL' ? '年度评估' : '评估'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal('evaluation', eval_)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-600"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete('evaluation', eval_.id!)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><i className="fas fa-trash"></i></button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">质量(30%)</div>
                  <div className="text-xl font-bold text-blue-600">{eval_.qualityScore || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">交付(25%)</div>
                  <div className="text-xl font-bold text-green-600">{eval_.deliveryScore || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">价格(20%)</div>
                  <div className="text-xl font-bold text-yellow-600">{eval_.priceScore || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">服务(15%)</div>
                  <div className="text-xl font-bold text-purple-600">{eval_.serviceScore || '-'}</div>
                </div>
                <div className="bg-white p-3 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">综合</div>
                  <div className="text-xl font-bold text-weyeah-blue">{eval_.comprehensiveScore || '-'}</div>
                </div>
              </div>
              {eval_.evaluationOpinion && <div className="mt-3 text-sm text-gray-600"><span className="text-gray-500">评估意见：</span>{eval_.evaluationOpinion}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContractsTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4"><i className="fas fa-file-contract text-weyeah-blue"></i>相关合同 ({contracts.length})</h3>
      {contracts.length === 0 ? (
        <div className="text-center py-12 text-gray-500"><i className="fas fa-file-alt text-4xl mb-4"></i><p>暂无合同</p></div>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{contract.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(contract.status)}`}>{getStatusText(contract.status)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div><span className="text-gray-500">合同号：</span>{contract.code}</div>
                    <div><span className="text-gray-500">类型：</span>{contract.type}</div>
                    <div><span className="text-gray-500">金额：</span>{contract.amount?.toLocaleString() || '-'} {contract.currency || 'CNY'}</div>
                    <div><span className="text-gray-500">日期：</span>{contract.startDate} ~ {contract.endDate}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTagsTab = () => {
    const [newTagName, setNewTagName] = useState('');

    const handleAddTagClick = () => {
      handleAddTag(newTagName);
      setNewTagName('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddTag(newTagName);
        setNewTagName('');
      }
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-tags text-weyeah-blue"></i>标签管理 ({tags.length})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入标签名称..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-weyeah-blue"
              maxLength={20}
            />
            <button
              onClick={handleAddTagClick}
              disabled={!newTagName.trim()}
              className="px-4 py-2 bg-weyeah-blue text-white rounded-lg hover:bg-weyeah-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>添加
            </button>
          </div>
        </div>
        {tags.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-tag text-4xl mb-4"></i>
            <p>暂无标签</p>
            <p className="text-sm mt-2">点击上方输入框添加标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${tag.tagColor}20`, color: tag.tagColor }}
              >
                <i className="fas fa-tag"></i>
                <span>{tag.tagName}</span>
                <button
                  onClick={() => tag.id && handleDelete('tag', tag.id)}
                  className="hover:bg-white/50 rounded-full p-1 transition-colors"
                  title="删除标签"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderModalForm = () => {
    if (!showModal) return null;
    
    const handleScoreChange = (field: string, value: string) => {
      const numValue = parseFloat(value) || 0;
      const newData = { ...editData, [field]: numValue };
      const comprehensiveScore = calculateComprehensiveScore(newData);
      const rating = calculateRating(comprehensiveScore);
      setEditData({ ...newData, comprehensiveScore, rating });
    };

    const previewScore = editData?.qualityScore || editData?.deliveryScore || editData?.priceScore || editData?.serviceScore
      ? calculateComprehensiveScore(editData)
      : null;
    const previewRating = previewScore !== null ? calculateRating(previewScore) : null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{isEdit ? '编辑' : '新增'}{modalType === 'qualification' ? '资质文件' : modalType === 'contact' ? '联系人' : modalType === 'cooperation' ? '合作记录' : '评估'}</h2>
            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><i className="fas fa-times"></i></button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              {modalType === 'qualification' && (
                <>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">资质类型 *</label>
                    <select value={editData.type || ''} onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                      <option value="BUSINESS_LICENSE">营业执照</option><option value="TAX_REGISTRATION">税务登记证</option><option value="ORG_CODE">组织机构代码证</option><option value="BANK_PERMIT">开户许可证</option><option value="ISO_CERT">ISO认证</option><option value="INDUSTRY_CERT">行业资质证书</option><option value="AGENT_AUTH">代理授权书</option><option value="PRODUCTION_LICENSE">生产许可证</option><option value="OTHER">其他</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">资质名称 *</label><input type="text" value={editData.name || ''} onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">颁发日期</label><input type="date" value={editData.issueDate || ''} onChange={(e) => setEditData(prev => ({ ...prev, issueDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">到期日期</label><input type="date" value={editData.expiryDate || ''} onChange={(e) => setEditData(prev => ({ ...prev, expiryDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  </div>
                  <div><label className="flex items-center gap-2"><input type="checkbox" checked={editData.hasExpiry || false} onChange={(e) => setEditData(prev => ({ ...prev, hasExpiry: e.target.checked }))} className="w-4 h-4" /><span className="text-sm">是否有有效期</span></label></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">备注</label><textarea value={editData.remark || ''} onChange={(e) => setEditData(prev => ({ ...prev, remark: e.target.value }))} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                </>
              )}
              {modalType === 'contact' && (
                <>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label><input type="text" value={editData.name || ''} onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">职位</label><input type="text" value={editData.position || ''} onChange={(e) => setEditData(prev => ({ ...prev, position: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">电话</label><input type="text" value={editData.phone || ''} onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label><input type="email" value={editData.email || ''} onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">部门</label><input type="text" value={editData.department || ''} onChange={(e) => setEditData(prev => ({ ...prev, department: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div><label className="flex items-center gap-2"><input type="checkbox" checked={editData.isPrimary || false} onChange={(e) => setEditData(prev => ({ ...prev, isPrimary: e.target.checked }))} className="w-4 h-4" /><span className="text-sm">设为主要联系人</span></label></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">备注</label><textarea value={editData.remark || ''} onChange={(e) => setEditData(prev => ({ ...prev, remark: e.target.value }))} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                </>
              )}
              {modalType === 'cooperation' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label><input type="date" value={editData.startDate || ''} onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label><input type="date" value={editData.endDate || ''} onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">合作类型</label><input type="text" value={editData.cooperationType || ''} onChange={(e) => setEditData(prev => ({ ...prev, cooperationType: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">合同号</label><input type="text" value={editData.contractNo || ''} onChange={(e) => setEditData(prev => ({ ...prev, contractNo: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">金额</label><input type="number" value={editData.amount || ''} onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                    <select value={editData.status || ''} onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                      <option value="ACTIVE">进行中</option><option value="COMPLETED">已完成</option><option value="TERMINATED">已终止</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">描述</label><textarea value={editData.description || ''} onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">备注</label><textarea value={editData.remark || ''} onChange={(e) => setEditData(prev => ({ ...prev, remark: e.target.value }))} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                </>
              )}
              {modalType === 'evaluation' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">评估日期 *</label><input type="date" value={editData.evaluationDate || ''} onChange={(e) => setEditData(prev => ({ ...prev, evaluationDate: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">评估周期</label>
                      <select value={editData.periodType || ''} onChange={(e) => setEditData(prev => ({ ...prev, periodType: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                        <option value="QUARTERLY">季度评估</option><option value="ANNUAL">年度评估</option><option value="PROJECT">项目评估</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                      <i className="fas fa-calculator"></i>实时计算预览
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">综合评分</div>
                        <div className="text-2xl font-bold text-weyeah-blue">{previewScore !== null ? previewScore : '-'}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center">
                        <div className="text-xs text-gray-500">评级</div>
                        <div className={`text-2xl font-bold ${previewRating ? getRatingClass(previewRating) : 'text-gray-300'}`}>{previewRating || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">质量评分 (30%)</label><input type="number" min="0" max="100" value={editData.qualityScore || ''} onChange={(e) => handleScoreChange('qualityScore', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">交付评分 (25%)</label><input type="number" min="0" max="100" value={editData.deliveryScore || ''} onChange={(e) => handleScoreChange('deliveryScore', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">价格评分 (20%)</label><input type="number" min="0" max="100" value={editData.priceScore || ''} onChange={(e) => handleScoreChange('priceScore', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">服务评分 (15%)</label><input type="number" min="0" max="100" value={editData.serviceScore || ''} onChange={(e) => handleScoreChange('serviceScore', e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">评估人</label><input type="text" value={editData.evaluator || ''} onChange={(e) => setEditData(prev => ({ ...prev, evaluator: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">评估意见</label><textarea value={editData.evaluationOpinion || ''} onChange={(e) => setEditData(prev => ({ ...prev, evaluationOpinion: e.target.value }))} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">备注</label><textarea value={editData.remark || ''} onChange={(e) => setEditData(prev => ({ ...prev, remark: e.target.value }))} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-lg" /></div>
                </>
              )}
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">取消</button>
            <button onClick={handleSave} disabled={isLoading || (modalType !== 'contact' && !editData.name && !editData.evaluationDate)} className="px-6 py-3 bg-gradient-to-r from-weyeah-blue to-weyeah-blue-700 text-white rounded-lg hover:from-weyeah-blue-700 hover:to-weyeah-blue disabled:opacity-50 flex items-center gap-2">
              {isLoading && <i className="fas fa-spinner fa-spin"></i>}保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">供应商详情 - {currentSupplier.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><i className="fas fa-times"></i></button>
        </div>
        <div className="border-b border-gray-100 flex-shrink-0 overflow-x-auto">
          <div className="flex min-w-max">
            {[
              { key: 'info', icon: 'fa-building', label: '基本信息' },
              { key: 'qualifications', icon: 'fa-certificate', label: `资质文件(${qualifications.length})` },
              { key: 'contacts', icon: 'fa-users', label: `联系人(${contacts.length})` },
              { key: 'cooperation', icon: 'fa-handshake', label: `合作记录(${cooperationRecords.length})` },
              { key: 'evaluations', icon: 'fa-star', label: `评估记录(${evaluations.length})` },
              { key: 'contracts', icon: 'fa-file-contract', label: `相关合同(${contracts.length})` },
              { key: 'tags', icon: 'fa-tags', label: `标签(${tags.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? 'text-weyeah-blue border-b-2 border-weyeah-blue' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={`fas ${tab.icon} mr-2`}></i>{tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'qualifications' && renderQualificationsTab()}
          {activeTab === 'contacts' && renderContactsTab()}
          {activeTab === 'cooperation' && renderCooperationTab()}
          {activeTab === 'evaluations' && renderEvaluationsTab()}
          {activeTab === 'contracts' && renderContractsTab()}
          {activeTab === 'tags' && renderTagsTab()}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end flex-shrink-0">
          <button onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50">关闭</button>
        </div>
      </div>
      {renderModalForm()}
    </div>
  );
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    DRAFT: '草稿', PENDING: '审批中', QUALIFIED: '合格', SUSPENDED: '暂停', BLACKLIST: '黑名单',
    ACTIVE: '进行中', COMPLETED: '已完成', EXECUTING: '执行中', EXPIRED: '已过期', TERMINATED: '已终止',
  };
  return map[status] || status;
}
