import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@services/auth'
import { apiService } from '@services/api'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        navigate('/login')
        return
      }

      try {
        const response = await apiService.get('/auth/me')
        console.log('User data:', response)
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user:', error)
        authService.logout()
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1>Cargando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>Bienvenido, {user?.nombre || 'Usuario'}</h1>
        <p>Sistema de Gestión Hospitalaria</p>
        <div style={{ marginTop: '1rem' }}>
          <p>Email: {user?.email}</p>
          <p>Rol: {user?.role}</p>
          <button 
            onClick={handleLogout}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Gestión de Pacientes</h3>
            <p>Administra registros de pacientes, citas e historia médica eficientemente.</p>
          </div>
          <div className={styles.card}>
            <h3>Agenda de Médicos</h3>
            <p>Programa citas con profesionales de la salud fácilmente.</p>
          </div>
          <div className={styles.card}>
            <h3>Registros Médicos</h3>
            <p>Registros médicos seguros y accesibles para todos los pacientes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
