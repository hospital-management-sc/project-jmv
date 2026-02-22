/**
 * PatientHistoryView - Vista de historia clínica completa con timeline
 *
 * Thin wrapper that delegates to the shared PatientHistory component
 * from DoctorDashboard, ensuring a single source of truth and consistent
 * glassmorphism UI across all dashboards.
 */
import PatientHistory from '@/pages/DoctorDashboard/components/PatientHistory'

interface PatientHistoryViewProps {
  patient: any
  onBack: () => void
}

export function PatientHistoryView({ patient, onBack }: PatientHistoryViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PatientHistory patient={patient as any} onBack={onBack} />
}

export default PatientHistoryView
