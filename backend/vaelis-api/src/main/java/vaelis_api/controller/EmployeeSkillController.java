package vaelis_api.controller;

import vaelis_api.dto.EmployeeSkillRequest;
import vaelis_api.entity.EmployeeSkill;
import vaelis_api.service.EmployeeSkillManagementService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
public class EmployeeSkillController {

    private final EmployeeSkillManagementService
            employeeSkillManagementService;

    public EmployeeSkillController(
            EmployeeSkillManagementService employeeSkillManagementService) {

        this.employeeSkillManagementService =
                employeeSkillManagementService;
    }

    // =========================================================
    // GET ALL SKILLS
    // =========================================================

    @GetMapping("/{employeeId}/skills")
    public ResponseEntity<List<EmployeeSkill>> getAllSkills(
            @PathVariable Long employeeId,
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeSkillManagementService
                        .getAllSkills(
                                employeeId,
                                authentication
                        )
        );
    }

    // =========================================================
    // GET ACTIVE SKILLS
    // =========================================================

    @GetMapping("/{employeeId}/skills/active")
    public ResponseEntity<List<EmployeeSkill>> getActiveSkills(
            @PathVariable Long employeeId,
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeSkillManagementService
                        .getActiveSkills(
                                employeeId,
                                authentication
                        )
        );
    }

    // =========================================================
    // GET SKILL BY ID
    // =========================================================

    @GetMapping("/{employeeId}/skills/{skillId}")
    public ResponseEntity<EmployeeSkill> getSkill(
            @PathVariable Long employeeId,
            @PathVariable Long skillId,
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeSkillManagementService
                        .getSkill(
                                employeeId,
                                skillId,
                                authentication
                        )
        );
    }

    // =========================================================
    // CREATE SKILL
    // =========================================================

    @PostMapping("/{employeeId}/skills")
    public ResponseEntity<EmployeeSkill> createSkill(
            @PathVariable Long employeeId,
            @RequestBody EmployeeSkillRequest request,
            Authentication authentication) {

        EmployeeSkill created =
                employeeSkillManagementService
                        .createSkill(
                                employeeId,
                                request,
                                authentication
                        );

        return ResponseEntity
                .status(201)
                .body(created);
    }

    // =========================================================
    // UPDATE SKILL
    // =========================================================

    @PutMapping("/{employeeId}/skills/{skillId}")
    public ResponseEntity<EmployeeSkill> updateSkill(
            @PathVariable Long employeeId,
            @PathVariable Long skillId,
            @RequestBody EmployeeSkillRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                employeeSkillManagementService
                        .updateSkill(
                                employeeId,
                                skillId,
                                request,
                                authentication
                        )
        );
    }

    // =========================================================
    // DELETE SKILL
    // =========================================================

    @DeleteMapping("/{employeeId}/skills/{skillId}")
    public ResponseEntity<Void> deleteSkill(
            @PathVariable Long employeeId,
            @PathVariable Long skillId,
            Authentication authentication) {

        employeeSkillManagementService
                .deleteSkill(
                        employeeId,
                        skillId,
                        authentication
                );

        return ResponseEntity.noContent().build();
    }
}