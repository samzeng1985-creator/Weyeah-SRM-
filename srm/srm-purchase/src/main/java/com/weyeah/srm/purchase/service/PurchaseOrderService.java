package com.weyeah.srm.purchase.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.purchase.dto.PurchaseOrderCreateDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderQueryDTO;
import com.weyeah.srm.purchase.dto.PurchaseOrderUpdateDTO;
import com.weyeah.srm.purchase.entity.PurchaseOrder;
import com.weyeah.srm.purchase.vo.PurchaseOrderDetailVO;

import java.util.List;

public interface PurchaseOrderService {

    PageResult<PurchaseOrder> queryPage(PurchaseOrderQueryDTO queryDTO);

    PurchaseOrderDetailVO getById(Long id);

    PurchaseOrder getByOrderNo(String orderNo);

    List<PurchaseOrder> listBySupplier(Long supplierId);

    List<PurchaseOrder> listByStatus(String status);

    Long create(PurchaseOrderCreateDTO createDTO);

    void update(PurchaseOrderUpdateDTO updateDTO);

    void delete(Long id);

    void submitForApproval(Long id);

    void approve(Long id, String approvalNo);

    void reject(Long id, String reason);

    void sendToSupplier(Long id);

    void confirmBySupplier(Long id);

    void updateDeliveryInfo(Long id, String deliveryDate);

    void markAsDelivered(Long id);

    void receive(Long id, java.math.BigDecimal receivedQuantity);

    void complete(Long id);

    void cancel(Long id);

    int countPending();
}
