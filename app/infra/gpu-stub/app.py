"""Local GPU Model Server 자리 표시용 스텁 (기획서 SECTION V-1 Local Model Serving).
실제 vLLM/코드 모델 서빙은 이후 도입 — 지금은 헬스체크만 응답한다.
"""
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"status":"stub","service":"gpu-model-server"}')


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", 8200), Handler).serve_forever()
