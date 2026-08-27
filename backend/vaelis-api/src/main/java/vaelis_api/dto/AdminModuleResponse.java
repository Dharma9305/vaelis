package vaelis_api.dto;

import vaelis_api.entity.AdminModule;

public class AdminModuleResponse {

    private Long id;
    private String code;
    private String name;
    private String description;
    private boolean enabled;

    public AdminModuleResponse() {
    }

    public AdminModuleResponse(
            Long id,
            String code,
            String name,
            String description,
            boolean enabled) {

        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
    }

    public static AdminModuleResponse from(
            AdminModule module) {

        if (module == null) {
            return null;
        }

        return new AdminModuleResponse(
                module.getId(),
                module.getCode(),
                module.getName(),
                module.getDescription(),
                module.isEnabled()
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
}