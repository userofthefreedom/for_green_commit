import type { ReactNode } from 'react'

interface CardProps {
  eyebrow?: ReactNode
  title?: ReactNode
  className?: string
  children: ReactNode
}

/** v3 .card 패턴 — eyebrow(작은 라벨) + 제목 + 본문 슬롯. */
export function Card({ eyebrow, title, className = '', children }: CardProps) {
  return (
    <div className={['card', className].filter(Boolean).join(' ')}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}
