package vaelis_api.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "admin_modules",
        indexes = {
                @Index(
                        name = "idx_admin_modules_code",
                        columnList = "code",
                        unique = true
                )
        }
)
public class AdminModule {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // CODE
    // =========================================================

    @Column(
            nullable = false,
            unique = true,
            length = 100
    )
    private String code;

    // =========================================================
    // NAME
    // =========================================================

    @Column(
            nullable = false,
            length = 150
    )
    private String name;

    // =========================================================
    // DESCRIPTION
    // =========================================================

    @Column(length = 500)
    private String description;

    // =========================================================
    // ENABLED
    // =========================================================

    @Column(nullable = false)
    private boolean enabled = true;

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public AdminModule() {
    }

    public AdminModule(
            String code,
            String name,
            String description) {

        this.code = code;
        this.name = name;
        this.description = description;
        this.enabled = true;
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}