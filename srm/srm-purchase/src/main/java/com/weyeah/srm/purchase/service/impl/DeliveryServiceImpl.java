package com.weyeah.srm.purchase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.purchase.dto.DeliveryCreateDTO;
import com.weyeah.srm.purchase.entity.Delivery;
import com.weyeah.srm.purchase.entity.PurchaseOrder;
import com.weyeah.srm.purchase.mapper.DeliveryMapper;
import com.weyeah.srm.purchase.mapper.PurchaseOrderMapper;
import com.weyeah.srm.purchase.service.DeliveryService;
import com.weyeah.srm.purchase.vo.DeliveryDetailVO;
import com.weyeah.srm.types.enums.EDeliveryStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryMapper deliveryMapper;
    private final PurchaseOrderMapper purchaseOrderMapper;

    @Override
    public List<Delivery> listByOrder(Long purchaseOrderId) {
        QueryWrapper<Delivery> wrapper = new QueryWrapper<>();
        wrapper.eq("purchase_order_id", purchaseOrderId);
        wrapper.orderByDesc("create_time");
        return deliveryMapper.selectList(wrapper);
    }

    @Override
    public DeliveryDetailVO getById(Long id) {
        Delivery delivery = deliveryMapper.selectById(id);
        if (delivery == null) {
            throw new BizException(404, "交货单不存在");
        }
        return convertToDetailVO(delivery);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(DeliveryCreateDTO createDTO) {
        PurchaseOrder order = purchaseOrderMapper.selectById(createDTO.getPurchaseOrderId());
        if (order == null) {
            throw new BizException(404, "采购订单不存在");
        }

        Delivery delivery = new Delivery();
        BeanUtils.copyProperties(createDTO, delivery);

        delivery.setDeliveryNo(generateDeliveryNo());
        delivery.setStatus(EDeliveryStatus.PENDING);
        delivery.setCreateTime(LocalDateTime.now());

        deliveryMapper.insert(delivery);

        return delivery.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Delivery delivery) {
        Delivery exist = deliveryMapper.selectById(delivery.getId());
        if (exist == null) {
            throw new BizException(404, "交货单不存在");
        }

        delivery.setUpdateTime(LocalDateTime.now());
        deliveryMapper.updateById(delivery);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void ship(Long id) {
        Delivery delivery = deliveryMapper.selectById(id);
        if (delivery == null) {
            throw new BizException(404, "交货单不存在");
        }

        delivery.setStatus(EDeliveryStatus.IN_TRANSIT);
        delivery.setUpdateTime(LocalDateTime.now());

        deliveryMapper.updateById(delivery);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void arrive(Long id) {
        Delivery delivery = deliveryMapper.selectById(id);
        if (delivery == null) {
            throw new BizException(404, "交货单不存在");
        }

        delivery.setStatus(EDeliveryStatus.ARRIVED);
        delivery.setActualArrivalDate(LocalDateTime.now().toLocalDate());
        delivery.setUpdateTime(LocalDateTime.now());

        deliveryMapper.updateById(delivery);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Delivery delivery = deliveryMapper.selectById(id);
        if (delivery == null) {
            throw new BizException(404, "交货单不存在");
        }

        if (delivery.getStatus() != EDeliveryStatus.PENDING) {
            throw new BizException(400, "只有待发货的交货单可以删除");
        }

        deliveryMapper.deleteById(id);
    }

    private String generateDeliveryNo() {
        return "DL" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private DeliveryDetailVO convertToDetailVO(Delivery delivery) {
        DeliveryDetailVO vo = new DeliveryDetailVO();
        BeanUtils.copyProperties(delivery, vo);

        if (delivery.getStatus() != null) {
            vo.setStatus(delivery.getStatus().getCode());
            vo.setStatusDesc(delivery.getStatus().getDesc());
        }

        if (delivery.getCreateTime() != null) {
            vo.setCreateTime(delivery.getCreateTime().toString());
        }

        if (delivery.getUpdateTime() != null) {
            vo.setUpdateTime(delivery.getUpdateTime().toString());
        }

        return vo;
    }
}
