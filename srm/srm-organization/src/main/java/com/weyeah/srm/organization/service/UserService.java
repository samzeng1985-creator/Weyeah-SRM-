package com.weyeah.srm.organization.service;

import com.weyeah.srm.common.result.PageResult;
import com.weyeah.srm.organization.dto.UserCreateDTO;
import com.weyeah.srm.organization.dto.UserQueryDTO;
import com.weyeah.srm.organization.dto.UserUpdateDTO;
import com.weyeah.srm.organization.entity.OrgUser;
import com.weyeah.srm.organization.vo.UserDetailVO;

import java.util.List;

public interface UserService {

    PageResult<OrgUser> queryPage(UserQueryDTO queryDTO);

    UserDetailVO getById(Long id);

    OrgUser getByUsername(String username);

    List<OrgUser> listByDepartment(Long departmentId);

    Long create(UserCreateDTO createDTO);

    void update(UserUpdateDTO updateDTO);

    void updateStatus(Long id, String status);

    void resetPassword(Long id, String newPassword);

    void delete(Long id);
}
