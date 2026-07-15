/**
 * Librería de iconos SVG compartida para toda la aplicación.
 * Todos usan stroke="currentColor" para heredar el color del contexto.
 */

interface IconProps {
  size?: number
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ── Acciones generales ──────────────────────────────────────────────────────

export function IconCheck({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M5 13l4 4L19 7" /></svg>
}

export function IconX({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M18 6L6 18M6 6l12 12" /></svg>
}

export function IconPlus({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>
}

export function IconEdit({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
}

export function IconSave({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
}

export function IconTrash({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
}

export function IconSearch({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
}

export function IconRefresh({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></svg>
}

export function IconEye({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
}

export function IconInfo({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
}

export function IconAlertTriangle({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
}

export function IconAlertCircle({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
}

export function IconChevronLeft({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><polyline points="15 18 9 12 15 6" /></svg>
}

export function IconClock({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
}

export function IconPause({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
}

export function IconConstruction({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M2 20h20M4 20V10M20 20V10M8 20v-5h8v5M8 10V4h8v6" /><path d="M12 4v6" /></svg>
}

// ── Médico / Hospital ────────────────────────────────────────────────────────

export function IconEmergency({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
}

export function IconHospital({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
}

export function IconBed({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M3 9v11M3 13h18M21 9v11" /><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" /><path d="M5 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
}

export function IconStethoscope({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" /><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" /></svg>
}

export function IconHeartPulse({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /><path d="M18.5 8.5a2.5 2.5 0 0 0-5 0c0 1.5 1 3 2.5 4.5C17.5 11.5 18.5 10 18.5 8.5z" /></svg>
}

export function IconHeart({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
}

export function IconPill({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M10.5 20.5 3.5 13.5a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7z" /><path d="M7 7l10 10" /></svg>
}

export function IconMicroscope({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
}

export function IconFlask({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M6 22h12a2 2 0 0 0 1.8-2.8L14 8V4h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2h1v4L4.2 19.2A2 2 0 0 0 6 22z" /><path d="M6.7 15h10.6" /></svg>
}

export function IconBloodDrop({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M12 2C6 9 4 13.5 4 16a8 8 0 0 0 16 0c0-2.5-2-7-8-14z" /></svg>
}

export function IconBrain({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z" /></svg>
}

export function IconLungs({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M12 2v10M12 12a5 5 0 0 1 5 5v2a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3v-2a5 5 0 0 1 5-5z" /><path d="M7 12a5 5 0 0 0-5 5v1a3 3 0 0 0 3 3h1" /><path d="M17 12a5 5 0 0 1 5 5v1a3 3 0 0 1-3 3h-1" /></svg>
}

export function IconRadiation({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><circle cx="12" cy="12" r="2" /><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" /><path d="M12 14l-3.2 5.5M12 14l3.2 5.5M12 10l-3.2-5.5M12 10l3.2-5.5M10 12H4.3M13.7 12H20" /></svg>
}

export function IconXRay({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" /><circle cx="12" cy="12" r="3" fill="none" /></svg>
}

export function IconUltrasound({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M8 14A6 6 0 0 0 14 8" /><path d="M5 17A10 10 0 0 0 17 5" /><circle cx="4" cy="20" r="1" fill="currentColor" stroke="none" /><path d="M4 20V10" /></svg>
}

export function IconEcg({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M2 12h3l2-7 4 14 3-11 2 4h6" /></svg>
}

export function IconThermometer({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>
}

export function IconNotes({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
}

export function IconClipboard({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
}

export function IconCalendar({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}

export function IconUser({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
}

export function IconUsers({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}

export function IconUserPlus({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
}

export function IconDoctor({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><path d="M12 11v4M10 13h4" /></svg>
}

export function IconPhone({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.03a16 16 0 0 0 6.06 6.06l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
}

export function IconFile({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
}

export function IconChartBar({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M4 20V10M12 20V4M20 20v-7" /><path d="M2 20h20" /></svg>
}

export function IconSend({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
}

export function IconInbox({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><polyline points="22 13 16 13 14 16 10 16 8 13 2 13" /><path d="M5.47 5.19L2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.47-7.81A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.83 1.19z" /></svg>
}

export function IconMail({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
}

export function IconMessageSquare({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
}

export function IconLoader({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></svg>
}

export function IconTag({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
}

export function IconBook({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
}

export function IconActivity({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
}

export function IconZap({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
}

export function IconCamera({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
}

export function IconUtensilsCrossed({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></svg>
}

export function IconWrench({ size = 16, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...base} className={className}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
}

// Dot indicators for priority
export function IconDotRed({ size = 12, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 12 12" className={className}><circle cx="6" cy="6" r="5" fill="#ef4444" stroke="none" /></svg>
}
export function IconDotOrange({ size = 12, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 12 12" className={className}><circle cx="6" cy="6" r="5" fill="#f97316" stroke="none" /></svg>
}
export function IconDotYellow({ size = 12, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 12 12" className={className}><circle cx="6" cy="6" r="5" fill="#eab308" stroke="none" /></svg>
}
export function IconDotGreen({ size = 12, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 12 12" className={className}><circle cx="6" cy="6" r="5" fill="#22c55e" stroke="none" /></svg>
}
