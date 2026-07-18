package com.greencommit.backend.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 부록C Repository·Issue 선정 루브릭을 코드화하는 자리. Phase 1은 recommendation 서비스가
 * 참고하는 명시적 규칙 몇 개만 seed로 두고, Knowledge Graph 연동(F020)은 하지 않는다.
 */
@Entity
@Table(name = "contribution_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContributionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    /** 예: SCORING / FILTER. */
    @Column(name = "rule_type", nullable = false)
    private String ruleType;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "active", nullable = false)
    private boolean active;
}
