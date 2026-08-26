package vaelis_api.repository;

import vaelis_api.entity.AdminPermissionRequest;
import vaelis_api.entity.AdminPermissionRequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminPermissionRequestRepository
        extends JpaRepository<
                AdminPermissionRequest,
                Long> {

    List<AdminPermissionRequest>
    findAllByOrderByCreatedAtDesc();

    List<AdminPermissionRequest>
    findByTargetUserIdOrderByCreatedAtDesc(
            Long targetUserId
    );

    List<AdminPermissionRequest>
    findByRequestedByIdOrderByCreatedAtDesc(
            Long requestedById
    );

    List<AdminPermissionRequest>
    findByStatusOrderByCreatedAtDesc(
            AdminPermissionRequestStatus status
    );

    List<AdminPermissionRequest>
    findByStatusOrderByCreatedAtAsc(
            AdminPermissionRequestStatus status
    );

    boolean existsByTargetUserIdAndPermissionIdAndStatus(
            Long targetUserId,
            Long permissionId,
            AdminPermissionRequestStatus status
    );

    Optional<AdminPermissionRequest>
    findByTargetUserIdAndPermissionIdAndStatus(
            Long targetUserId,
            Long permissionId,
            AdminPermissionRequestStatus status
    );
}
