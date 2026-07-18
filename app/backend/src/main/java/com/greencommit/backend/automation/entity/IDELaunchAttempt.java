package com.greencommit.backend.automation.entity;

import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.profile.entity.PrimaryIde;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** F013/BR06: 선택 IDE Deep Link Handoff 기록. */
@Entity
@Table(name = "ide_launch_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IDELaunchAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "ide", nullable = false, length = 32)
    private PrimaryIde ide;

    @Column(name = "deep_link_url")
    private String deepLinkUrl;

    @Column(name = "launched_at", nullable = false)
    private Instant launchedAt;

    @Column(name = "succeeded")
    private Boolean succeeded;
}
