package com.weyeah.srm.notification.service;

import com.weyeah.srm.notification.entity.NotificationTemplate;

import java.util.List;

public interface NotificationTemplateService {

    List<NotificationTemplate> listAll();

    List<NotificationTemplate> listActive();

    NotificationTemplate getById(Long id);

    NotificationTemplate getByCode(String code);

    Long create(NotificationTemplate template);

    void update(NotificationTemplate template);

    void delete(Long id);

    void enable(Long id);

    void disable(Long id);
}
