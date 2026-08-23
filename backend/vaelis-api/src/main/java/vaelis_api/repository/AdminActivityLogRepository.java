package vaelis_api.repository;

import vaelis_api.entity.AdminActivityLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminActivityLogRepository
        extends JpaRepository<AdminActivityLog, Long> {

    // =========================================================
    // GET ALL ACTIVITY LOGS
    // =========================================================

    List<AdminActivityLog>
    findAllByOrderByCreatedAtDesc();
}