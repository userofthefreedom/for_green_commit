package com.greencommit.backend.automation.controller;

import com.greencommit.backend.automation.dto.ClonePrepareRequest;
import com.greencommit.backend.automation.dto.ClonePrepareResponse;
import com.greencommit.backend.automation.dto.ForkRequest;
import com.greencommit.backend.automation.dto.ForkResponse;
import com.greencommit.backend.automation.dto.IdeLaunchRequest;
import com.greencommit.backend.automation.dto.IdeLaunchResponse;
import com.greencommit.backend.automation.service.AutomationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F009/F010/F013: 표37 API — POST /automations/fork, /automations/clone/prepare, /ide-launch. */
@RestController
@RequiredArgsConstructor
public class AutomationController {

    private final AutomationService automationService;

    @PostMapping("/automations/fork")
    public ResponseEntity<ForkResponse> fork(@Valid @RequestBody ForkRequest request) {
        return ResponseEntity.ok(automationService.fork(request));
    }

    @PostMapping("/automations/clone/prepare")
    public ResponseEntity<ClonePrepareResponse> clonePrepare(@Valid @RequestBody ClonePrepareRequest request) {
        return ResponseEntity.ok(automationService.clonePrepare(request));
    }

    @PostMapping("/ide-launch")
    public ResponseEntity<IdeLaunchResponse> ideLaunch(@Valid @RequestBody IdeLaunchRequest request) {
        return ResponseEntity.ok(automationService.ideLaunch(request));
    }
}
