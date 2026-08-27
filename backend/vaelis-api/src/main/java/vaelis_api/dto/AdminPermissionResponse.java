package vaelis_api.dto;

import vaelis_api.entity.AdminPermission;

public class AdminPermissionResponse {

    private Long id;

    private String code;

    private String name;

    private String description;

    private boolean enabled;

    private AdminModuleResponse module;

    public AdminPermissionResponse() {
    }

    public AdminPermissionResponse(
            Long id,
            String code,
            String name,
            String description,
            boolean enabled,
            AdminModuleResponse module) {

        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
        this.module = module;
    }

    public static AdminPermissionResponse from(
            AdminPermission permission) {

        if (permission == null) {
            return null;
        }

        return new AdminPermissionResponse(
                permission.getId(),
                permission.getCode(),
                permission.getName(),
                permission.getDescription(),
                permission.isEnabled(),
                AdminModuleResponse.from(
                        permission.getModule()
                )
        );
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public AdminModuleResponse getModule() {
        return module;
    }
}