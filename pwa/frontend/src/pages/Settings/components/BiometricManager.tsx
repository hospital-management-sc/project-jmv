/**
 * Componente de Gestión de Acceso Biométrico
 * Permite registrar, renombrar y revocar dispositivos biométricos con WebAuthn/FIDO2
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  startWebAuthnRegistration,
  getWebAuthnErrorMessage,
  getDefaultDeviceName,
  getTransportsFromCredential,
} from '@/utils/webauthn';
import styles from './BiometricManager.module.css';

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6zM12 14v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.3 3.8 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeviceIcon({ isPlatform }: { isPlatform: boolean }) {
  if (isPlatform) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
        <path
          d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm4 15h2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <path
        d="M3 7h18v10H3zM8 17v3m8-3v3M9 11h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface BiometricDevice {
  id: number;
  credentialId: string;
  deviceName: string;
  deviceType: string;
  lastAccessedAt?: string;
  isActive: boolean;
  createdAt: string;
  transports: string[];
}

interface BiometricManagerProps {
  onRegistrationStart?: () => void;
  onRegistrationComplete?: () => void;
}

export default function BiometricManager({
  onRegistrationStart,
  onRegistrationComplete,
}: BiometricManagerProps) {
  const { user } = useAuth();
  const [devices, setDevices] = useState<BiometricDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);
  const [platformAuthAvailable, setPlatformAuthAvailable] = useState(false);

  // Check WebAuthn support
  useEffect(() => {
    const checkSupport = async () => {
      setWebAuthnSupported(isWebAuthnSupported());
      if (isWebAuthnSupported()) {
        const available = await isPlatformAuthenticatorAvailable();
        setPlatformAuthAvailable(available);
      }
    };
    checkSupport();
  }, []);

  // Fetch biometric devices
  useEffect(() => {
    const fetchDevices = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const response = await fetch('/api/biometric/credentials', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch devices');

        const data = await response.json();
        setDevices(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar dispositivos');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user?.id]);

  // Handle biometric registration
  const handleRegisterBiometric = async () => {
    if (!user?.id) {
      setError('User ID not found');
      return;
    }

    if (!webAuthnSupported) {
      setError(
        'WebAuthn no está soportado en tu navegador. Por favor, usa un navegador moderno.'
      );
      return;
    }

    if (!platformAuthAvailable) {
      setError('Tu dispositivo no tiene autenticación biométrica disponible.');
      return;
    }

    setRegistering(true);
    setError(null);
    onRegistrationStart?.();

    try {
      // Step 1: Initiate registration (get challenge)
      const initiateResponse = await fetch('/api/biometric/register/initiate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate biometric registration');
      }

      const initiateData = await initiateResponse.json();
      const registrationOptions = initiateData.data;

      // Step 2: Use WebAuthn API to create credential
      let attestationResponse;
      try {
        attestationResponse = await startWebAuthnRegistration(registrationOptions);
      } catch (webAuthnError) {
        throw new Error(getWebAuthnErrorMessage(webAuthnError));
      }

      // Step 3: Get device info
      const deviceName = getDefaultDeviceName();
      const transports = getTransportsFromCredential(attestationResponse);

      // Step 4: Verify credential with backend
      const verifyResponse = await fetch('/api/biometric/register/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialResponse: attestationResponse,
          deviceName,
          deviceType: 'platform',
          transports,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Failed to verify biometric credential');
      }

      const verifyData = await verifyResponse.json();

      // Update devices list
      setDevices([...devices, verifyData.data]);
      setShowModal(false);

      // Show success message
      setError(null);
      onRegistrationComplete?.();

      // Show temporary success notification
      setTimeout(() => {
        setError(null);
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error durante el registro biométrico';
      setError(errorMsg);
      console.error('Biometric registration error:', err);
    } finally {
      setRegistering(false);
    }
  };

  // Handle rename device
  const handleRenameDevice = async (credentialId: string) => {
    if (!newName.trim()) return;

    try {
      const response = await fetch(`/api/biometric/credentials/${credentialId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceName: newName }),
      });

      if (!response.ok) throw new Error('Failed to rename device');

      const data = await response.json();
      setDevices(
        devices.map((d) =>
          d.credentialId === credentialId
            ? { ...d, deviceName: data.data.deviceName }
            : d
        )
      );
      setRenamingId(null);
      setNewName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al renombrar dispositivo');
    }
  };

  // Handle delete device
  const handleDeleteDevice = async (credentialId: string, deviceId: number) => {
    if (!confirm('¿Seguro que deseas revocar este dispositivo?')) return;

    setDeleting(deviceId);
    try {
      const response = await fetch(`/api/biometric/credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete device');

      setDevices(devices.filter((d) => d.credentialId !== credentialId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar dispositivo');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!webAuthnSupported) {
    return (
      <div className={styles.biometricContainer}>
        <div className={styles.header}>
          <h3>
            <span className={styles.headerIcon}><LockIcon /></span>
            Acceso Biométrico
          </h3>
          <p className={styles.subtitle}>Gestiona tus dispositivos biométricos de acceso</p>
        </div>

        <div className={styles.errorAlert}>
          <p>
            <span className={styles.alertIcon}><WarningIcon /></span>
            Tu navegador no soporta WebAuthn/FIDO2. Por favor, usa un navegador
            moderno como Chrome, Safari, Firefox o Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.biometricContainer}>
      <div className={styles.header}>
        <h3>
          <span className={styles.headerIcon}><LockIcon /></span>
          Acceso Biométrico
        </h3>
        <p className={styles.subtitle}>Gestiona tus dispositivos biométricos de acceso</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <p><span className={styles.alertIcon}><WarningIcon /></span>{error}</p>
        </div>
      )}

      <div className={styles.actionBar}>
        <button
          className={styles.registerBtn}
          onClick={() => setShowModal(true)}
          disabled={registering || !platformAuthAvailable}
          title={
            !platformAuthAvailable
              ? 'Tu dispositivo no tiene autenticación biométrica'
              : 'Registrar nuevo dispositivo biométrico'
          }
        >
          {registering ? (
            'Registrando...'
          ) : (
            <>
              Registrar Nuevo Dispositivo
            </>
          )}
        </button>
      </div>

      {!platformAuthAvailable && (
        <div className={styles.infoAlert}>
          <p>
            <span className={styles.alertIcon}><InfoIcon /></span>
            Tu dispositivo no tiene autenticación biométrica disponible. Por favor,
            usa otro dispositivo para registrar acceso biométrico.
          </p>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <p>Cargando dispositivos...</p>
        </div>
      ) : devices.length === 0 ? (
        <div className={styles.empty}>
          <p>No tienes dispositivos biométricos registrados aún</p>
          <p className={styles.emptySubtitle}>
            Registra tu primer dispositivo para acceder más rápidamente
          </p>
        </div>
      ) : (
        <div className={styles.devicesList}>
          {devices.map((device) => (
            <div key={device.id} className={styles.deviceCard}>
              <div className={styles.deviceHeader}>
                <span className={styles.deviceIcon}>
                  <DeviceIcon isPlatform={device.deviceType === 'platform'} />
                </span>
                <div className={styles.deviceInfo}>
                  {renamingId === device.id ? (
                    <div className={styles.renameInput}>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nuevo nombre"
                        autoFocus
                      />
                      <button
                        className={styles.saveBtn}
                        onClick={() => handleRenameDevice(device.credentialId)}
                      >
                        Guardar
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          setRenamingId(null);
                          setNewName('');
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4>{device.deviceName}</h4>
                      <p className={styles.deviceType}>
                        {device.deviceType === 'platform' ? 'Dispositivo Local' : 'Dispositivo Remoto'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.deviceDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Registrado:</span>
                  <span>{formatDate(device.createdAt)}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Último acceso:</span>
                  <span>{formatDate(device.lastAccessedAt)}</span>
                </div>
                {device.transports && device.transports.length > 0 && (
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Transportes:</span>
                    <span>{device.transports.join(', ')}</span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.label}>Estado:</span>
                  <span className={device.isActive ? styles.active : styles.inactive}>
                    {device.isActive ? '✓ Activo' : '✕ Inactivo'}
                  </span>
                </div>
              </div>

              <div className={styles.deviceActions}>
                {renamingId !== device.id && (
                  <>
                    <button
                      className={styles.renameBtn}
                      onClick={() => {
                        setRenamingId(device.id);
                        setNewName(device.deviceName);
                      }}
                    >
                      Renombrar
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteDevice(device.credentialId, device.id)}
                      disabled={deleting === device.id}
                    >
                      {deleting === device.id ? 'Eliminando...' : 'Revocar'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para registro biométrico */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Registrar Dispositivo Biométrico</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div>
                  <p className={styles.stepTitle}>Verifica tu identidad</p>
                  <p className={styles.stepDesc}>Coloca tu dedo en el sensor o mira la cámara</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div>
                  <p className={styles.stepTitle}>Confirma el registro</p>
                  <p className={styles.stepDesc}>El dispositivo será añadido a tu cuenta</p>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div>
                  <p className={styles.stepTitle}>Listo</p>
                  <p className={styles.stepDesc}>Podrás usar este dispositivo para acceder rápidamente</p>
                </div>
              </div>

              {error && (
                <div className={styles.modalError}>
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setShowModal(false)}
                disabled={registering}
              >
                Cancelar
              </button>
              <button
                className={styles.modalRegisterBtn}
                onClick={handleRegisterBiometric}
                disabled={registering}
              >
                {registering ? 'Registrando...' : 'Iniciar Registro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
