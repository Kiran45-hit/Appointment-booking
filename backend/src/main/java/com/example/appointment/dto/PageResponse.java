package com.example.appointment.dto;

import java.util.List;

public class PageResponse<T> {

    private List<T> data;

    private int page;

    private int totalPages;

    private long totalElements;

    // =========================
    // CONSTRUCTOR
    // =========================

    public PageResponse(

            List<T> data,

            int page,

            int totalPages,

            long totalElements
    ) {

        this.data = data;

        this.page = page;

        this.totalPages = totalPages;

        this.totalElements =
                totalElements;
    }

    // =========================
    // GETTERS
    // =========================

    public List<T> getData() {
        return data;
    }

    public int getPage() {
        return page;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    // =========================
    // SETTERS
    // =========================

    public void setData(
            List<T> data
    ) {
        this.data = data;
    }

    public void setPage(
            int page
    ) {
        this.page = page;
    }

    public void setTotalPages(
            int totalPages
    ) {
        this.totalPages =
                totalPages;
    }

    public void setTotalElements(
            long totalElements
    ) {
        this.totalElements =
                totalElements;
    }
}