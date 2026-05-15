package com.weyeah.srm.purchase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.purchase.dto.ReceivingCreateDTO;
import com.weyeah.srm.purchase.entity.Receiving;
import com.weyeah.srm.purchase.mapper.ReceivingMapper;
import com.weyeah.srm.purchase.service.ReceivingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceivingServiceImpl implements ReceivingService {

    private final ReceivingMapper receivingMapper;

    @Override
    public List<Receiving> listByDelivery(Long deliveryId) {
        QueryWrapper<Receiving> wrapper = new QueryWrapper<>();
        wrapper.eq("delivery_id", deliveryId);
        wrapper.orderByDesc("create_time");
        return receivingMapper.selectList(wrapper);
    }

    @Override
    public List<Receiving> listByOrder(Long purchaseOrderId) {
        QueryWrapper<Receiving> wrapper = new QueryWrapper<>();
        wrapper.eq("purchase_order_id", purchaseOrderId);
        wrapper.orderByDesc("create_time");
        return receivingMapper.selectList(wrapper);
    }

    @Override
    public Receiving getById(Long id) {
        Receiving receiving = receivingMapper.selectById(id);
        if (receiving == null) {
            throw new BizException(404, "收货记录不存在");
        }
        return receiving;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(ReceivingCreateDTO createDTO) {
        Receiving receiving = new Receiving();
        BeanUtils.copyProperties(createDTO, receiving);

        receiving.setReceivingNo(generateReceivingNo());
        receiving.setInspectionTime(LocalDateTime.now());
        receiving.setCreateTime(LocalDateTime.now());

        if (receiving.getDefectiveQuantity() == null) {
            receiving.setDefectiveQuantity(java.math.BigDecimal.ZERO);
        }

        receivingMapper.insert(receiving);

        return receiving.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(Receiving receiving) {
        Receiving exist = receivingMapper.selectById(receiving.getId());
        if (exist == null) {
            throw new BizException(404, "收货记录不存在");
        }

        receiving.setUpdateTime(LocalDateTime.now());
        receivingMapper.updateById(receiving);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        Receiving receiving = receivingMapper.selectById(id);
        if (receiving == null) {
            throw new BizException(404, "收货记录不存在");
        }

        receivingMapper.deleteById(id);
    }

    private String generateReceivingNo() {
        return "RC" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }
}
