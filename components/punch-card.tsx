'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react'
import { 
  formatTime, 
  formatTime12h, 
  getPunchInStatus, 
  getPunchOutStatus, 
  calculateOTHours,
  getStatusColor,
  getStatusLabel,
  type PunchStatus
} from '@/lib/punch-utils'
import type { PunchRecord } from '@/lib/types'

interface PunchCardProps {
  userId: string
}

export function PunchCard({ userId }: PunchCardProps) {
  const { language, t } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayRecord, setTodayRecord] = useState<PunchRecord | null>(null)
  const [monthlyRecords, setMonthlyRecords] = useState<PunchRecord[]>([])
  const [isPunching, setIsPunching] = useState(false)
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Load records from localStorage (simulating Supabase)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem(`punch_records_${userId}`)
    if (saved) {
      const records: PunchRecord[] = JSON.parse(saved)
      const todayRec = records.find(r => r.date === today)
      setTodayRecord(todayRec || null)
      
      // Filter for current month
      const currentMonth = new Date().toISOString().slice(0, 7)
      setMonthlyRecords(records.filter(r => r.date.startsWith(currentMonth)))
    }
  }, [userId])
  
  const handlePunchIn = () => {
    setIsPunching(true)
    
    setTimeout(() => {
      const now = new Date()
      const time = formatTime(now)
      const status = getPunchInStatus(time)
      
      const newRecord: PunchRecord = {
        id: crypto.randomUUID(),
        userId,
        date: now.toISOString().split('T')[0],
        punchIn: time,
        punchOut: null,
        status,
        otHours: 0,
        createdAt: now.toISOString(),
      }
      
      setTodayRecord(newRecord)
      saveRecord(newRecord)
      setIsPunching(false)
    }, 500)
  }
  
  const handlePunchOut = () => {
    if (!todayRecord) return
    
    setIsPunching(true)
    
    setTimeout(() => {
      const now = new Date()
      const time = formatTime(now)
      const outStatus = getPunchOutStatus(time)
      
      const updatedRecord: PunchRecord = {
        ...todayRecord,
        punchOut: time,
        status: outStatus === 'ot-late' ? 'ot-late' : todayRecord.status,
        otHours: todayRecord.punchIn ? calculateOTHours(todayRecord.punchIn, time) : 0,
      }
      
      setTodayRecord(updatedRecord)
      saveRecord(updatedRecord)
      setIsPunching(false)
    }, 500)
  }
  
  const saveRecord = (record: PunchRecord) => {
    const saved = localStorage.getItem(`punch_records_${userId}`)
    const records: PunchRecord[] = saved ? JSON.parse(saved) : []
    
    const existingIndex = records.findIndex(r => r.date === record.date)
    if (existingIndex >= 0) {
      records[existingIndex] = record
    } else {
      records.push(record)
    }
    
    localStorage.setItem(`punch_records_${userId}`, JSON.stringify(records))
    
    // Update monthly records
    const currentMonth = new Date().toISOString().slice(0, 7)
    setMonthlyRecords(records.filter(r => r.date.startsWith(currentMonth)))
  }
  
  const getStatusBadge = (status: PunchStatus) => {
    const colorClass = getStatusColor(status)
    const label = getStatusLabel(status, language)
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status === 'late' && <AlertTriangle className="w-3 h-3" />}
        {(status === 'ot-early' || status === 'ot-late') && <Timer className="w-3 h-3" />}
        {status === 'normal' && <CheckCircle className="w-3 h-3" />}
        {label}
      </span>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="glass-card rounded-2xl p-6 text-center">
        <div className="text-6xl font-bold text-foreground tabular-nums">
          {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-lg text-muted-foreground mt-2">
          {currentTime.toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        {/* Working Hours Info */}
        <div className="mt-4 p-4 bg-secondary/50 rounded-xl">
          <p className="text-sm font-medium text-foreground">{t.workingHours}</p>
          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{t.wfhStart}:</span> {t.normalStart}
            </div>
            <div>
              <span className="font-medium">{t.wfhEnd}:</span> {t.normalEnd}
            </div>
          </div>
        </div>
      </div>
      
      {/* Punch Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handlePunchIn}
          disabled={!!todayRecord?.punchIn || isPunching}
          className={`btn-3d flex items-center justify-center gap-3 p-6 rounded-2xl text-xl font-bold transition-all ${
            todayRecord?.punchIn
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500'
          }`}
        >
          <LogIn className="w-8 h-8" />
          <span>{t.punchIn}</span>
          {todayRecord?.punchIn && (
            <span className="text-base font-normal ml-2">
              ({formatTime12h(todayRecord.punchIn)})
            </span>
          )}
        </button>
        
        <button
          onClick={handlePunchOut}
          disabled={!todayRecord?.punchIn || !!todayRecord?.punchOut || isPunching}
          className={`btn-3d flex items-center justify-center gap-3 p-6 rounded-2xl text-xl font-bold transition-all ${
            !todayRecord?.punchIn || todayRecord?.punchOut
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500'
          }`}
        >
          <LogOut className="w-8 h-8" />
          <span>{t.punchOut}</span>
          {todayRecord?.punchOut && (
            <span className="text-base font-normal ml-2">
              ({formatTime12h(todayRecord.punchOut)})
            </span>
          )}
        </button>
      </div>
      
      {/* Today's Record */}
      {todayRecord && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            {t.todayRecord}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground">{t.punchIn}</p>
              <p className={`text-xl font-bold ${
                todayRecord.status === 'late' ? 'text-red-600 dark:text-red-400' :
                todayRecord.status === 'ot-early' ? 'text-green-600 dark:text-green-400' :
                'text-foreground'
              }`}>
                {todayRecord.punchIn ? formatTime12h(todayRecord.punchIn) : '--:--'}
              </p>
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground">{t.punchOut}</p>
              <p className={`text-xl font-bold ${
                todayRecord.status === 'ot-late' ? 'text-green-600 dark:text-green-400' :
                'text-foreground'
              }`}>
                {todayRecord.punchOut ? formatTime12h(todayRecord.punchOut) : '--:--'}
              </p>
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground">{t.status}</p>
              <div className="mt-1">
                {getStatusBadge(todayRecord.status)}
              </div>
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-xl">
              <p className="text-sm text-muted-foreground">{t.statusOT}</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {todayRecord.otHours.toFixed(2)} {language === 'ms' ? 'jam' : 'hrs'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Monthly Records */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          {t.monthlyRecord}
        </h3>
        
        {monthlyRecords.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t.noData}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.date}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.punchIn}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.punchOut}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.status}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.statusOT}</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRecords.sort((a, b) => b.date.localeCompare(a.date)).map((record) => (
                  <tr key={record.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">
                      {new Date(record.date).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={`py-3 px-4 font-medium ${
                      record.status === 'late' ? 'text-red-600 dark:text-red-400' :
                      record.status === 'ot-early' ? 'text-green-600 dark:text-green-400' :
                      'text-foreground'
                    }`}>
                      {record.punchIn ? formatTime12h(record.punchIn) : '--:--'}
                    </td>
                    <td className={`py-3 px-4 font-medium ${
                      record.status === 'ot-late' ? 'text-green-600 dark:text-green-400' :
                      'text-foreground'
                    }`}>
                      {record.punchOut ? formatTime12h(record.punchOut) : '--:--'}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                      {record.otHours.toFixed(2)}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
