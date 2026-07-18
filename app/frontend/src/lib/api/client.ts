const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
}

/**
 * 얇은 fetch 래퍼. `VITE_API_BASE_URL`(기본 http://localhost:8080)을 기준으로 Core Backend
 * API 15종(표37)을 호출한다. Phase 1은 타입·경로만 확정하고, 화면에서의 실제 호출/에러
 * 처리(TanStack Query 연동)는 Phase 2 이후 각 화면에서 채운다.
 */
export async function apiClient<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, query } = options

  const url = new URL(path.replace(/^\//, ''), `${BASE_URL}/`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} 실패 (HTTP ${response.status})`)
  }
  if (response.status === 204) {
    return undefined as TResponse
  }
  return (await response.json()) as TResponse
}
