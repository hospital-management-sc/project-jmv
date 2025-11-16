import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]}`}
      {...props}
    >
      {children}
    </button>
  )
}
