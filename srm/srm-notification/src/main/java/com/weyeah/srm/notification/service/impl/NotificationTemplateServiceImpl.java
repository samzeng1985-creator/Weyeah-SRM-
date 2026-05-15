package com.weyeah.srm.notification.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.notification.entity.NotificationTemplate;
import com.weyeah.srm.notification.mapper.NotificationTemplateMapper;
import com.weyeah.srm.notification.service.NotificationTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    private final NotificationTemplateMapper templateMapper;

    @Override
    public List<NotificationTemplate> listAll() {
        QueryWrapper<NotificationTemplate> wrapper = new QueryWrapper<>();
        wrapper.orderByDesc("create_time");
        return templateMapper.selectList(wrapper);
    }

    @Override
    public List<NotificationTemplate> listActive() {
        QueryWrapper<NotificationTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("is_active", true);
        wrapper.orderByDesc("create_time");
        return templateMapper.selectList(wrapper);
    }

    @Override
    public NotificationTemplate getById(Long id) {
        NotificationTemplate template = templateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "通知模板不存在");
        }
        return template;
    }

    @Override
    public NotificationTemplate getByCode(String code) {
        QueryWrapper<NotificationTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("code", code);
        return templateMapper.selectOne(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(NotificationTemplate template) {
        QueryWrapper<NotificationTemplate> wrapper = new QueryWrapper<>();
        wrapper.eq("code", template.getCode());
        if (templateMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "模板编码已存在");
        }

        if (template.getIsActive() == null) {
            template.setIsActive(true);
        }
        template.setCreateTime(LocalDateTime.now());
        templateMapper.insert(template);
        return template.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(NotificationTemplate template) {
        NotificationTemplate exist = templateMapper.selectById(template.getId());
        if (exist == null) {
            throw new BizException(404, "通知模板不存在");
        }
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        NotificationTemplate template = templateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "通知模板不存在");
        }
        templateMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void enable(Long id) {
        NotificationTemplate template = templateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "通知模板不存在");
        }
        template.setIsActive(true);
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void disable(Long id) {
        NotificationTemplate template = templateMapper.selectById(id);
        if (template == null) {
            throw new BizException(404, "通知模板不存在");
        }
        template.setIsActive(false);
        template.setUpdateTime(LocalDateTime.now());
        templateMapper.updateById(template);
    }
}
