package com.weyeah.srm.common.result;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    private List<T> records;
    private long total;
    private long size;
    private long current;
    private long pages;

    public PageResult(List<T> records, long total, long size, long current, long pages) {
        this.records = records != null ? new ArrayList<>(records) : null;
        this.total = total;
        this.size = size;
        this.current = current;
        this.pages = pages;
    }

    public void setRecords(List<T> records) {
        this.records = records != null ? new ArrayList<>(records) : null;
    }

    public List<T> getRecords() {
        return records != null ? Collections.unmodifiableList(records) : null;
    }

    public static <T> PageResult<T> of(List<T> records, long total, long size, long current) {
        long pages = size == 0 ? 0 : (total + size - 1) / size;
        return new PageResult<>(records, total, size, current, pages);
    }

    public static <T> Builder<T> builder() {
        return new Builder<>();
    }

    public static class Builder<T> {
        private List<T> records;
        private long total;
        private long size;
        private long current;
        private long pages;

        public Builder<T> records(List<T> records) {
            this.records = records != null ? new ArrayList<>(records) : null;
            return this;
        }

        public Builder<T> total(long total) {
            this.total = total;
            return this;
        }

        public Builder<T> size(long size) {
            this.size = size;
            return this;
        }

        public Builder<T> current(long current) {
            this.current = current;
            return this;
        }

        public Builder<T> pages(long pages) {
            this.pages = pages;
            return this;
        }

        public PageResult<T> build() {
            return new PageResult<>(records, total, size, current, pages);
        }
    }

}