/**
 * Dashboard para Médicos y Coordinadores de Área
 * Vista especializada para profesionales médicos
 */


import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

import { LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';

import useAuth from '@hooks/useAuth';

import styles from './DoctorDashboard.module.css'

export default function DoctorDashboard() {

  const navigate = useNavigate();
  const { user, logout } = useAuth();
    
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full text-foreground overflow-hidden">
      {/* <Sidebar> */}
        <div className="flex flex-col h-full sidebar w-[20%] border-r-1 border-gray-600">
          <div className="p-10 border-b border-gray-600" style={{ padding: '10px' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 bg-white">
                  <AvatarImage src="" alt={user?.nombre}/>
                  <AvatarFallback className="border-1 border-gray-300">
                    {user?.nombre.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-white">
                  {user?.nombre}
                </span>
              </div> 
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ background: 'transparent' }}
                  onClick={handleLogout}
                  className="h-8 w-8 hover:bg-gray-300 rounded-full cursor-pointer"
                >
                  <LogOut className="h-5 w-5 text-(--color-primary)" />
                  <span className="sr-only">Logout</span>
                </Button>
            </div>
          </div>
          <ul>
            <li className="flex items-center justify-between gap-3 border-b border-gray-600" style={{ padding: '10px' }}>
              <a onClick={() => void 0} className="flex items-center gap-3 relative w-full cursor-pointer">
                <span className="text-sm font-semibold text-white">
                  Ver Pacientes
                </span>
                <ArrowRight className="h-5 w-5 text-(--color-primary) absolute right-0" />
                <span className="sr-only">Logout</span>
              </a> 
            </li>
            <li className="flex items-center justify-between gap-3 border-b border-gray-600" style={{ padding: '10px' }}>
              <a onClick={() => void 0} className="flex items-center gap-3 relative w-full cursor-pointer">
                <span className="text-sm font-semibold text-white">
                  Nueva Admisión
                </span>
                <ArrowRight className="h-5 w-5 text-(--color-primary) absolute right-0" />
                <span className="sr-only">Logout</span>
              </a> 
            </li>
            <li className="flex items-center justify-between gap-3 border-b border-gray-600" style={{ padding: '10px' }}>
              <a onClick={() => void 0} className="flex items-center gap-3 relative w-full cursor-pointer">
                <span className="text-sm font-semibold text-white">
                  Registrar Encuentro
                </span>
                <ArrowRight className="h-5 w-5 text-(--color-primary) absolute right-0" />
                <span className="sr-only">Logout</span>
              </a> 
            </li>
            <li className="flex items-center justify-between gap-3 border-b border-gray-600" style={{ padding: '10px' }}>
              <a onClick={() => void 0} className="flex items-center gap-3 relative w-full cursor-pointer">
                <span className="text-sm font-semibold text-white">
                  Ver Reportes
                </span>
                <ArrowRight className="h-5 w-5 text-(--color-primary) absolute right-0" />
                <span className="sr-only">Logout</span>
              </a> 
            </li>
          </ul>
        </div>
      {/* </Sidebar> */}
      {/* <SidebarInset> */}
        {/* <div className={styles['dashboard-container']}> */}
        <div className="content w-[80%]" style={{ padding: '10px' }}>
          <header className={styles['dashboard-header']}>
            <h1>Dashboard Médico</h1>
            <p className={styles.subtitle}>Panel de control para médicos y coordinadores</p>
          </header>

          <main className={styles['dashboard-main']}>
            {/* Sección de Información Rápida */}
            <section className={styles['quick-info']}>
              <div className={styles.card}>
                <h2>Pacientes Activos</h2>
                <div className={styles['stat-value']}>0</div>
              </div>
              <div className={styles.card}>
                <h2>Admisiones Hoy</h2>
                <div className={styles['stat-value']}>0</div>
              </div>
              <div className={styles.card}>
                <h2>Altas Pendientes</h2>
                <div className={styles['stat-value']}>0</div>
              </div>
              <div className={styles.card}>
                <h2>Consultas Pendientes</h2>
                <div className={styles['stat-value']}>0</div>
              </div>
            </section>

            {/* Sección de Acciones Principales */}
            <section className={styles['main-actions']}>
              <h2>Acciones Disponibles</h2>
              <div className={styles['action-grid']}>
                <button className={styles['action-btn']}>
                  <span className={styles.icon}>📋</span>
                  <span>Ver Pacientes</span>
                </button>
                <button className={styles['action-btn']}>
                  <span className={styles.icon}>➕</span>
                  <span>Nueva Admisión</span>
                </button>
                <button className={styles['action-btn']}>
                  <span className={styles.icon}>📝</span>
                  <span>Registrar Encuentro</span>
                </button>
                <button className={styles['action-btn']}>
                  <span className={styles.icon}>📊</span>
                  <span>Ver Reportes</span>
                </button>
              </div>
            </section>

            {/* Sección de Pacientes Recientes */}
            <section className={styles['recent-patients']}>
              <h2>Pacientes Asignados Recientemente</h2>
              <div className={styles['table-placeholder']}>
                <p>Tabla de pacientes asignados se mostrará aquí</p>
              </div>
            </section>
          </main>
        </div>
      {/* </SidebarInset> */}
    </div>
  );
}
