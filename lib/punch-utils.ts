// WFH Government working hours
// Normal start: 7:30 AM - 9:00 AM
// Normal end: 4:30 PM - 6:00 PM

export const WORK_HOURS = {
  earlyStart: { hour: 7, minute: 0 },   // Before 7:00 AM = OT
  normalStart: { hour: 7, minute: 30 }, // 7:30 AM
  lateThreshold: { hour: 9, minute: 0 }, // After 9:00 AM = Late
  normalEnd: { hour: 16, minute: 30 },  // 4:30 PM
  maxEnd: { hour: 18, minute: 0 },      // 6:00 PM
}

export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

export function formatTime12h(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`
}

export type PunchStatus = 'normal' | 'late' | 'ot-early' | 'ot-late'

export function getPunchInStatus(time: string): PunchStatus {
  const minutes = parseTimeToMinutes(time)
  const earlyStart = WORK_HOURS.earlyStart.hour * 60 + WORK_HOURS.earlyStart.minute
  const lateThreshold = WORK_HOURS.lateThreshold.hour * 60 + WORK_HOURS.lateThreshold.minute
  
  if (minutes < earlyStart) {
    return 'ot-early' // Before 7:00 AM = OT
  } else if (minutes > lateThreshold) {
    return 'late' // After 9:00 AM = Late
  }
  return 'normal'
}

export function getPunchOutStatus(time: string): PunchStatus {
  const minutes = parseTimeToMinutes(time)
  const maxEnd = WORK_HOURS.maxEnd.hour * 60 + WORK_HOURS.maxEnd.minute
  
  if (minutes > maxEnd) {
    return 'ot-late' // After 6:00 PM = OT
  }
  return 'normal'
}

export function calculateOTHours(punchIn: string, punchOut: string): number {
  const punchInMinutes = parseTimeToMinutes(punchIn)
  const punchOutMinutes = parseTimeToMinutes(punchOut)
  
  const earlyStart = WORK_HOURS.earlyStart.hour * 60 + WORK_HOURS.earlyStart.minute
  const normalStart = WORK_HOURS.normalStart.hour * 60 + WORK_HOURS.normalStart.minute
  const maxEnd = WORK_HOURS.maxEnd.hour * 60 + WORK_HOURS.maxEnd.minute
  
  let otMinutes = 0
  
  // Early OT (before 7:00 AM)
  if (punchInMinutes < earlyStart) {
    otMinutes += Math.min(normalStart, earlyStart) - punchInMinutes
  }
  
  // Late OT (after 6:00 PM)
  if (punchOutMinutes > maxEnd) {
    otMinutes += punchOutMinutes - maxEnd
  }
  
  return Math.round((otMinutes / 60) * 100) / 100
}

export function getStatusColor(status: PunchStatus): string {
  switch (status) {
    case 'late':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950'
    case 'ot-early':
    case 'ot-late':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950'
    default:
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950'
  }
}

export function getStatusLabel(status: PunchStatus, lang: 'en' | 'ms'): string {
  const labels = {
    en: {
      normal: 'Normal',
      late: 'Late',
      'ot-early': 'OT (Early)',
      'ot-late': 'OT (Late)',
    },
    ms: {
      normal: 'Normal',
      late: 'Lewat',
      'ot-early': 'OT (Awal)',
      'ot-late': 'OT (Lewat)',
    },
  }
  return labels[lang][status]
}
