package com.weyeah.srm.purchase.service;

import com.weyeah.srm.purchase.dto.ReceivingCreateDTO;
import com.weyeah.srm.purchase.entity.Receiving;

import java.util.List;

public interface ReceivingService {

    List<Receiving> listByDelivery(Long deliveryId);

    List<Receiving> listByOrder(Long purchaseOrderId);

    Receiving getById(Long id);

    Long create(ReceivingCreateDTO createDTO);

    void update(Receiving receiving);

    void delete(Long id);
}
