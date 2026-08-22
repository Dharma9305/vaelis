package vaelis_api.service;

import vaelis_api.entity.AdminPermission;
import vaelis_api.entity.AdminUser;
import vaelis_api.repository.AdminUserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminUserDetailsService
        implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserDetailsService(
            AdminUserRepository adminUserRepository) {

        this.adminUserRepository =
                adminUserRepository;
    }
@Override
public UserDetails loadUserByUsername(
        String username)
        throws UsernameNotFoundException {

    // =========================================================
    // FIND USER
    // =========================================================

    AdminUser adminUser =
            adminUserRepository
                    .findByUsernameIgnoreCase(
                            username.trim()
                    )
                    .orElseThrow(() ->
                            new UsernameNotFoundException(
                                    "User not found."
                            )
                    );

    // =========================================================
    // SOFT DELETE CHECK
    // =========================================================

    if (adminUser.isDeleted()) {

        throw new UsernameNotFoundException(
                "User account has been deleted."
        );
    }

    // =========================================================
    // ADMIN APPROVAL CHECK
    // =========================================================

    if ("ADMIN".equalsIgnoreCase(
            adminUser.getRole()
    ) && !adminUser.isApproved()) {

        throw new UsernameNotFoundException(
                "Admin account is awaiting Super Admin approval."
        );
    }

    // =========================================================
    // AUTHORITIES
    // =========================================================

    List<SimpleGrantedAuthority>
            authorities =
            new ArrayList<>();

    // =========================================================
    // ROLE AUTHORITY
    // =========================================================

    authorities.add(
            new SimpleGrantedAuthority(
                    "ROLE_" +
                    adminUser.getRole()
            )
    );

    // =========================================================
    // PERMISSION AUTHORITIES
    // =========================================================

    if (adminUser.getPermissions() != null) {

        for (
                AdminPermission permission :
                adminUser.getPermissions()
        ) {

            if (
                    permission != null &&
                    permission.isEnabled() &&
                    permission.getCode() != null &&
                    !permission.getCode().isBlank()
            ) {

                authorities.add(
                        new SimpleGrantedAuthority(
                                permission.getCode()
                        )
                );
            }
        }
    }

    // =========================================================
    // BUILD SPRING SECURITY USER
    // =========================================================

    return User
            .withUsername(
                    adminUser.getUsername()
            )
            .password(
                    adminUser.getPassword()
            )
            .disabled(
                    !adminUser.isEnabled()
            )
            .authorities(
                    authorities
            )
            .build();
        }
}
    