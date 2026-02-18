import { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './MainLayout.module.css'

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

export default function MainLayout() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Close tooltip when clicking/touching outside
  useEffect(() => {
    if (!tooltipOpen) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [tooltipOpen])

  const userLabel = user
    ? `${user.nombre}${user.especialidad ? ` • ${user.especialidad}` : ''}`
    : ''

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <a href="/" className={styles.logoLink} aria-label="Hospital JMV — Inicio">
            <img src="/main_icon.svg" alt="Hospital JMV" className={styles.logoImg} />
          </a>

          <nav className={styles.nav}>
            {isAuthenticated && (
              <>
                {/* Desktop: nombre + especialidad */}
                <span className={`${styles.userInfo} ${styles.userInfoDesktop}`}>
                  {user?.nombre}
                  {user?.especialidad && (
                    <span className={styles.especialidad}> • {user.especialidad}</span>
                  )}
                </span>

                {/* Mobile: icono con tooltip */}
                <div
                  ref={tooltipRef}
                  className={`${styles.userInfoMobile}`}
                  aria-label={userLabel}
                >
                  <button
                    className={styles.userIconBtn}
                    onClick={() => setTooltipOpen(v => !v)}
                    aria-expanded={tooltipOpen}
                    aria-haspopup="true"
                    type="button"
                  >
                    <UserIcon />
                  </button>
                  {tooltipOpen && (
                    <div className={styles.userTooltip} role="tooltip">
                      <span className={styles.tooltipName}>{user?.nombre}</span>
                      {user?.especialidad && (
                        <span className={styles.tooltipEspecialidad}>{user.especialidad}</span>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Cerrar Sesión">
                  <LogoutIcon />
                  <span className={styles.logoutText}>Cerrar Sesión</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>Sistema de Gestión Clínica y Administrativa - Hospital Militar Tipo I "Dr. José María Vargas"</p>
      </footer>
    </div>
  )
}
