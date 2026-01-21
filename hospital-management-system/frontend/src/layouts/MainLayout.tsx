import { type ReactElement as JSX } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import styles from './MainLayout.module.css';

import { SidebarProvider, SidebarTrigger } from '@components/ui/sidebar';

function MainLayout(): JSX {

  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* <SidebarProvider className="flex flex-col"> */}
        <header className={styles.header}>
          <div className={styles.container}>
            {/* <SidebarTrigger className="md:hidden hover:bg-gray-300 rounded-full cursor-pointer" /> */}
            <h1 className={styles.logo}>Hospital JMV</h1>
            <nav className={styles.nav}>
              {isAuthenticated && (
                <>
                  <span className={styles.userInfo}>
                    {user?.nombre}
                  </span>
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Cerrar Sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2025 Hospital JMV. Todos los derechos reservados.</p>
        </footer>
      {/* </SidebarProvider> */}
    </div>
  )
}

export default MainLayout;