// ** Dependencies
import { Outlet } from 'react-router-dom';

// ** Styles
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
