package com.greencommit.backend.ai.controller;

import com.greencommit.backend.ai.dto.OrchestrationRequest;
import com.greencommit.backend.ai.dto.OrchestrationResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * F021(Phase 99 보류): 표37 API — POST /ai/orchestrations. STUB ONLY — app/ai FastAPI 서비스를
 * 호출하지 않고 고정 placeholder만 반환한다.
 * TODO(Phase 99, 팀 확인 후 구현): Orchestrator LLM의 Tool/Model Routing을 app/ai와 연결.
 */
@RestController
public class AiOrchestrationController {

    @PostMapping("/ai/orchestrations")
    public ResponseEntity<OrchestrationResponse> orchestrate(@RequestBody(required = false) OrchestrationRequest request) {
        return ResponseEntity.ok(new OrchestrationResponse(
                "NOT_IMPLEMENTED",
                "고정 Workflow 준비 중",
                "AI Orchestrator 연동은 Phase 99에서 팀 확인 후 구현됩니다."));
    }
}
