import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './app/AuthContext'
import { router } from './app/router'
import './styles/tokens.css'

/**
 * Phase 1 — SCR001~018 라우팅 스켈레톤. `src/app/router.tsx`에 화면-라우트 매핑이 있다.
 * 참고: docs/그린커밋_WEB_서비스_기획서_v0.6.2.docx SECTION II-8 표19.
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
