package com.weyeah.srm.organization.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.weyeah.srm.common.exception.BizException;
import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.organization.dto.UserCreateDTO;
import com.weyeah.srm.organization.dto.UserQueryDTO;
import com.weyeah.srm.organization.dto.UserUpdateDTO;
import com.weyeah.srm.organization.entity.OrgUser;
import com.weyeah.srm.organization.mapper.OrgUserMapper;
import com.weyeah.srm.organization.service.UserService;
import com.weyeah.srm.organization.vo.UserDetailVO;
import com.weyeah.srm.types.enums.EUserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final OrgUserMapper userMapper;

    @Override
    public PageResult<OrgUser> queryPage(UserQueryDTO queryDTO) {
        Page<OrgUser> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());

        QueryWrapper<OrgUser> wrapper = new QueryWrapper<>();

        if (StringUtils.hasText(queryDTO.getKeyword())) {
            wrapper.and(w -> w.like("real_name", queryDTO.getKeyword())
                    .or().like("username", queryDTO.getKeyword())
                    .or().like("email", queryDTO.getKeyword()));
        }

        if (queryDTO.getDepartmentId() != null) {
            wrapper.eq("department_id", queryDTO.getDepartmentId());
        }

        if (StringUtils.hasText(queryDTO.getStatus())) {
            wrapper.eq("status", queryDTO.getStatus());
        }

        wrapper.orderByDesc("create_time");

        Page<OrgUser> result = userMapper.selectPage(page, wrapper);

        return PageResult.of(
                result.getRecords(),
                result.getTotal(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public UserDetailVO getById(Long id) {
        OrgUser user = userMapper.selectById(id);
        if (user == null) {
            throw new BizException(404, "用户不存在");
        }
        return convertToDetailVO(user);
    }

    @Override
    public OrgUser getByUsername(String username) {
        QueryWrapper<OrgUser> wrapper = new QueryWrapper<>();
        wrapper.eq("username", username);
        return userMapper.selectOne(wrapper);
    }

    @Override
    public List<OrgUser> listByDepartment(Long departmentId) {
        QueryWrapper<OrgUser> wrapper = new QueryWrapper<>();
        wrapper.eq("department_id", departmentId);
        wrapper.orderByDesc("create_time");
        return userMapper.selectList(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long create(UserCreateDTO createDTO) {
        QueryWrapper<OrgUser> wrapper = new QueryWrapper<>();
        wrapper.eq("username", createDTO.getUsername());
        if (userMapper.selectCount(wrapper) > 0) {
            throw new BizException(400, "用户名已存在");
        }

        OrgUser user = new OrgUser();
        BeanUtils.copyProperties(createDTO, user);

        user.setStatus(EUserStatus.ACTIVE);
        user.setCreateTime(LocalDateTime.now());

        userMapper.insert(user);

        return user.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void update(UserUpdateDTO updateDTO) {
        OrgUser user = userMapper.selectById(updateDTO.getId());
        if (user == null) {
            throw new BizException(404, "用户不存在");
        }

        BeanUtils.copyProperties(updateDTO, user);

        if (StringUtils.hasText(updateDTO.getStatus())) {
            user.setStatus(EUserStatus.fromCode(updateDTO.getStatus()));
        }

        user.setUpdateTime(LocalDateTime.now());

        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, String status) {
        OrgUser user = userMapper.selectById(id);
        if (user == null) {
            throw new BizException(404, "用户不存在");
        }

        user.setStatus(EUserStatus.fromCode(status));
        user.setUpdateTime(LocalDateTime.now());

        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void resetPassword(Long id, String newPassword) {
        OrgUser user = userMapper.selectById(id);
        if (user == null) {
            throw new BizException(404, "用户不存在");
        }

        user.setPassword(newPassword);
        user.setUpdateTime(LocalDateTime.now());

        userMapper.updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id) {
        OrgUser user = userMapper.selectById(id);
        if (user == null) {
            throw new BizException(404, "用户不存在");
        }

        userMapper.deleteById(id);
    }

    private UserDetailVO convertToDetailVO(OrgUser user) {
        UserDetailVO vo = new UserDetailVO();
        BeanUtils.copyProperties(user, vo);

        if (user.getStatus() != null) {
            vo.setStatus(user.getStatus().getCode());
            vo.setStatusDesc(user.getStatus().getDesc());
        }

        if (user.getCreateTime() != null) {
            vo.setCreateTime(user.getCreateTime().toString());
        }

        if (user.getUpdateTime() != null) {
            vo.setUpdateTime(user.getUpdateTime().toString());
        }

        return vo;
    }
}
