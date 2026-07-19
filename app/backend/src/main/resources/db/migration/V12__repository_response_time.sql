-- F006 확장(2026-07-19 사용자 결정): 추천 가산점·PR 대기시간 기대치 안내에 쓸 숫자 필드.
-- 기존 external_pr_responsiveness(자유 텍스트)는 정렬·가산점 계산에 못 쓰므로,
-- 같은 의미를 담은 숫자 컬럼을 별도로 둔다. 실제 GitHub 통계 자동 집계(F017)는 Phase 99 보류이고,
-- 지금은 seed 텍스트와 맞춘 값을 수동으로 채운다.

ALTER TABLE repositories ADD COLUMN avg_feedback_hours INTEGER;

UPDATE repositories SET avg_feedback_hours = 8  WHERE full_name = 'TEAMMATES/teammates';
UPDATE repositories SET avg_feedback_hours = 36 WHERE full_name = 'date-fns/date-fns';
UPDATE repositories SET avg_feedback_hours = 60 WHERE full_name = 'DavidAnson/markdownlint';
UPDATE repositories SET avg_feedback_hours = 96 WHERE full_name = 'freeCodeCamp/freeCodeCamp';
UPDATE repositories SET avg_feedback_hours = 36 WHERE full_name = 'excalidraw/excalidraw';
UPDATE repositories SET avg_feedback_hours = 48 WHERE full_name = 'colinhacks/zod';
