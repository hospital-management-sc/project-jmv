import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import styles from './MainLayout.module.css'

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const handleLogoClick = () => {
    const dashboardPath = user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico'

    if (location.pathname === dashboardPath) {
      window.dispatchEvent(new CustomEvent('dashboard:go-main'))
    }

    navigate(dashboardPath)
  }

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
    ? `Bienvenidx, ${user.nombre}`
    : ''

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <button
            onClick={handleLogoClick}
            className={styles.logoLink}
            aria-label="Hospital JMV — Inicio"
            type="button"
          >
            <img src="/main_icon.svg" alt="Hospital JMV" className={styles.logoImg} />
          </button>

          <nav className={styles.nav}>
            {isAuthenticated && (
              <>
                {/* Desktop: nombre sin especialidad */}
                <span className={`${styles.userInfo} ${styles.userInfoDesktop}`}>
                  Bienvenidx, {user?.nombre}
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
                      <span className={styles.tooltipName}>Bienvenidx, {user?.nombre}</span>
                    </div>
                  )}
                </div>

                <div className={styles.settingsWrapper}>
                  <button 
                    onClick={() => navigate('/settings')} 
                    className={styles.settingsBtn} 
                    aria-label="Ajustes"
                  >
                    <SettingsIcon />
                  </button>
                  <div className={styles.settingsTooltip}>Ajustes</div>
                </div>

                <div className={styles.logoutWrapper}>
                  <button onClick={handleLogout} className={styles.logoutBtn} aria-label="Cerrar Sesión">
                    <LogoutIcon />
                  </button>
                  <div className={styles.logoutTooltip}>Cerrar Sesión</div>
                </div>
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
