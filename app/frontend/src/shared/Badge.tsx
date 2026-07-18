import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'gray' | 'amber' | 'blue'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  green: 'pill',
  gray: 'pill g',
  amber: 'pill a',
  blue: 'pill b',
}

/** v3 .pill 계열 상태/적합도 뱃지. */
export function Badge({ variant = 'green', children }: BadgeProps) {
  return <span className={VARIANT_CLASS[variant]}>{children}</span>
}
