package com.srm.common.core.domain;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class BaseEntityTest {

    @Test
    void testBaseEntityCreation() {
        LocalDateTime now = LocalDateTime.now();
        BaseEntity entity = new BaseEntity();
        entity.setCreateBy("admin");
        entity.setCreateTime(now);
        entity.setUpdateBy("admin");
        entity.setUpdateTime(now);
        entity.setRemark("test remark");
        
        assertEquals("admin", entity.getCreateBy());
        assertEquals(now, entity.getCreateTime());
        assertEquals("admin", entity.getUpdateBy());
        assertEquals(now, entity.getUpdateTime());
        assertEquals("test remark", entity.getRemark());
    }
}
