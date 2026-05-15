package com.weyeah.srm.purchase.service;

import com.weyeah.srm.purchase.dto.DeliveryCreateDTO;
import com.weyeah.srm.purchase.entity.Delivery;
import com.weyeah.srm.purchase.vo.DeliveryDetailVO;

import java.util.List;

public interface DeliveryService {

    List<Delivery> listByOrder(Long purchaseOrderId);

    DeliveryDetailVO getById(Long id);

    Long create(DeliveryCreateDTO createDTO);

    void update(Delivery delivery);

    void ship(Long id);

    void arrive(Long id);

    void delete(Long id);
}
