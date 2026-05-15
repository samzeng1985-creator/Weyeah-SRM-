package com.weyeah.srm.organization;

import com.weyeah.srm.organization.dto.UserCreateDTO;
import com.weyeah.srm.organization.dto.UserQueryDTO;
import com.weyeah.srm.organization.entity.OrgUser;
import com.weyeah.srm.organization.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void testCreateUser() {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("zhangsan");
        createDTO.setPassword("123456");
        createDTO.setRealName("张三");
        createDTO.setEmail("zhangsan@example.com");
        createDTO.setPhone("13800138000");

        Long id = userService.create(createDTO);

        assertNotNull(id);
        assertTrue(id > 0);
    }

    @Test
    void testGetByUsername() {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("lisi");
        createDTO.setPassword("123456");
        createDTO.setRealName("李四");
        createDTO.setEmail("lisi@example.com");

        Long id = userService.create(createDTO);

        OrgUser byUsername = userService.getByUsername("lisi");

        assertNotNull(byUsername);
        assertEquals(id, byUsername.getId());
    }

    @Test
    void testQueryPage() {
        UserQueryDTO queryDTO = new UserQueryDTO();
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        var pageResult = userService.queryPage(queryDTO);

        assertNotNull(pageResult);
        assertNotNull(pageResult.getRecords());
    }

    @Test
    void testUpdateStatus() {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("wangwu");
        createDTO.setPassword("123456");
        createDTO.setRealName("王五");
        createDTO.setEmail("wangwu@example.com");

        Long id = userService.create(createDTO);

        userService.updateStatus(id, "INACTIVE");

        var vo = userService.getById(id);

        assertEquals("INACTIVE", vo.getStatus());
    }

    @Test
    void testResetPassword() {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("zhaoliu");
        createDTO.setPassword("123456");
        createDTO.setRealName("赵六");
        createDTO.setEmail("zhaoliu@example.com");

        Long id = userService.create(createDTO);

        userService.resetPassword(id, "newpassword123");

        var user = userService.getById(id);

        assertNotNull(user);
    }

    @Test
    void testDeleteUser() {
        UserCreateDTO createDTO = new UserCreateDTO();
        createDTO.setUsername("qianqi");
        createDTO.setPassword("123456");
        createDTO.setRealName("钱七");
        createDTO.setEmail("qianqi@example.com");

        Long id = userService.create(createDTO);

        userService.delete(id);

        assertThrows(Exception.class, () -> {
            userService.getById(id);
        });
    }
}
