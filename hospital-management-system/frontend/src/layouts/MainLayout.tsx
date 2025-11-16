import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1>Hospital Management System</h1>
          <nav className={styles.nav}>
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  )
}
