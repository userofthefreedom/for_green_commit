import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'default' | 'auto' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  children: ReactNode
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'p',
  default: '',
  auto: 'auto',
  ghost: 'ghost',
}
const SIZE_CLASS: Record<ButtonSize, string> = { sm: 'sm', md: '', lg: 'lg' }

/**
 * 프로토타입 v3의 .btn 계열 클래스를 감싼 얇은 presentational 버튼.
 * Phase 1 스켈레톤에서는 대부분 페이지 내 네비게이션 CTA로 쓰인다.
 */
export function Button({ variant = 'default', size = 'md', full = false, className = '', children, ...rest }: ButtonProps) {
  const classes = ['btn', VARIANT_CLASS[variant], SIZE_CLASS[size], full ? 'full' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
