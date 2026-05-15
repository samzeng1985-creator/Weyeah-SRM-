package com.weyeah.srm.purchase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.purchase.dto.PurchaseOrderCreateDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderQueryDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderUpdateDTO;
import com.weyeah.srm.purchase.entity.PurchaseOrder;
import com.weyeah.srm.purchase.mapper.PurchaseOrderMapper;
import com.weyeah.srm.purchase.service.PurchaseOrderService;
import com.weyeah.srm.purchase.vo.PurchaseOrderDetailVO;
import com.weyeah.srm.types.enums.EPurchaseStatus;
import com.weyeah.srm.types.enums.EPurchaseType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderMapper purchaseOrderMapper;

    @Override
    public PageResult<PurchaseOrder> queryPage(PurchaseOrderQueryDTO queryDTO) {
        Page<PurchaseOrder> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<PurchaseOrder> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("title", queryDTO.getKeyword())
                    .or().like("order_no", queryDTO.getKeyword()));
        }

        if (StringUtils.hasText(queryDTO.getSupplierId())) {
            wrapper.eq("supplier_id", queryDTO.getSupplierId());
        }

        if (StringUtils.hasText(queryDTO.getMaterialId())) {
            wrapper.eq("material_id", queryDTO.getMaterialId());
        }

        if (StringUtils.hasText(queryDTO.getType())) {
            wrapper.eq("type", queryDTO.getType());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<PurchaseOrder> result = purchaseOrderMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public PurchaseOrderDetailVO getById(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }
        return convertToDetailVO(order);
    }

    @Override
    public PurchaseOrder getByOrderNo(String orderNo) {
        QueryWrapper<PurchaseOrder> wrapper = new QueryWrapper<>();
        wrapper.eq("order_no", orderNo);
        return purchaseOrderMapper.selectOne(wrapper);
    }

    @Override
    public List<PurchaseOrder> listBySupplier(Long supplierId) {
        QueryWrapper<PurchaseOrder> wrapper = new QueryWrapper<>();
        wrapper.eq("supplier_id", supplierId);
        wrapper.orderByDesc("create_time");
        return purchaseOrderMapper.selectList(wrapper);
    }

    @Override
    public List<PurchaseOrder> listByStatus(String status) {
        QueryWrapper<PurchaseOrder> wrapper = new QueryWrapper<>();
        wrapper.eq("status", status);
        wrapper.orderByDesc("create_time");
        return purchaseOrderMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(PurchaseOrderCreateDTO createDTO) {
        PurchaseOrder order = new PurchaseOrder();
        BeanUtils.copyProperties(createDTO, order);

        order.setOrderNo(generateOrderNo());
        order.setType(EPurchaseType.fromCode(createDTO.getType()));
        order.setStatus(EPurchaseStatus.DRAFT);
        order.setTotalAmount(createDTO.getQuantity().multiply(createDTO.getUnitPrice()));

        if (!StringUtils.hasText(createDTO.getCurrency())) {
            order.setCurrency("CNY");
        }

        order.setCreateTime(LocalDateTime.now());

        purchaseOrderMapper.insert(order);

        return order.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(PurchaseOrderUpdateDTO updateDTO) {
        PurchaseOrder order = purchaseOrderMapper.selectById(updateDTO.getId());
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的订单可以修改");
        }

        BeanUtils.copyProperties(updateDTO, order);

        if (StringUtils.hasText(updateDTO.getStatus())) {
            order.setStatus(EPurchaseStatus.fromCode(updateDTO.getStatus()));
        }

        if (updateDTO.getQuantity() != null && updateDTO.getUnitPrice() != null) {
            order.setTotalAmount(updateDTO.getQuantity().multiply(updateDTO.getUnitPrice()));
        }

        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的订单可以删除");
        }

        purchaseOrderMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void submitForApproval(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.DRAFT) {
            throw new BizException(400, "只有草稿状态的订单可以提交审批");
        }

        order.setStatus(EPurchaseStatus.PENDING_APPROVAL);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(Long id, String approvalNo) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.PENDING_APPROVAL) {
            throw new BizException(400, "只有待审批状态的订单可以审批");
        }

        order.setStatus(EPurchaseStatus.APPROVED);
        order.setApprovalNo(approvalNo);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void reject(Long id, String reason) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.PENDING_APPROVAL) {
            throw new BizException(400, "只有待审批状态的订单可以拒绝");
        }

        order.setStatus(EPurchaseStatus.REJECTED);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void sendToSupplier(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.APPROVED) {
            throw new BizException(400, "只有已审批状态的订单可以发送给供应商");
        }

        order.setStatus(EPurchaseStatus.PENDING_SUPPLIER_CONFIRM);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void confirmBySupplier(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.PENDING_SUPPLIER_CONFIRM) {
            throw new BizException(400, "当前状态不允许供应商确认");
        }

        order.setStatus(EPurchaseStatus.SUPPLIER_CONFIRMED);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateDeliveryInfo(Long id, String deliveryDate) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        order.setDeliveryDate(java.time.LocalDate.parse(deliveryDate));
        order.setStatus(EPurchaseStatus.IN_PRODUCTION);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void markAsDelivered(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.IN_PRODUCTION) {
            throw new BizException(400, "当前状态不允许标记为已发货");
        }

        order.setStatus(EPurchaseStatus.DELIVERED);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void receive(Long id, BigDecimal receivedQuantity) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (receivedQuantity.compareTo(order.getQuantity()) < 0) {
            order.setStatus(EPurchaseStatus.PARTIALLY_RECEIVED);
        } else {
            order.setStatus(EPurchaseStatus.RECEIVED);
        }

        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void complete(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() != EPurchaseStatus.RECEIVED) {
            throw new BizException(400, "当前状态不允许完成");
        }

        order.setStatus(EPurchaseStatus.COMPLETED);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(Long id) {
        PurchaseOrder order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        if (order.getStatus() == EPurchaseStatus.COMPLETED
                || order.getStatus() == EPurchaseStatus.CANCELLED) {
            throw new BizException(400, "当前状态不允许取消");
        }

        order.setStatus(EPurchaseStatus.CANCELLED);
        order.setUpdateTime(LocalDateTime.now());

        purchaseOrderMapper.updateById(order);
    }

    @Override
    public int countPending() {
        QueryWrapper<PurchaseOrder> wrapper = new QueryWrapper<>();
        wrapper.eq("status", EPurchaseStatus.PENDING_APPROVAL.getCode());
        return purchaseOrderMapper.selectCount(wrapper).intValue();
    }

    private String generateOrderNo() {
        return "PO" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private PurchaseOrderDetailVO convertToDetailVO(PurchaseOrder order) {
        PurchaseOrderDetailVO vo = new PurchaseOrderDetailVO();
        BeanUtils.copyProperties(order, vo);

        if (order.getType() != null) {
            vo.setType(order.getType().getCode());
            vo.setTypeDesc(order.getType().getDesc());
        }

        if (order.getStatus() != null) {
            vo.setStatus(order.getStatus().getCode());
            vo.setStatusDesc(order.getStatus().getDesc());
        }

        if (order.getCreateTime() != null) {
            vo.setCreateTime(order.getCreateTime().toString());
        }

        if (order.getUpdateTime() != null) {
            vo.setUpdateTime(order.getUpdateTime().toString());
        }

        return vo;
    }
}
