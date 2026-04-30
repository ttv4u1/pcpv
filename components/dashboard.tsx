'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { 
  Clock, 
  Car, 
  Receipt,
  TrendingUp,
  Calendar,
  Fuel,
  Timer,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import type { PunchRecord, VehicleLog, Receipt as ReceiptType } from '@/lib/types'

interface DashboardProps {
  userId: string
}

export function Dashboard({ userId }: DashboardProps) {
  const { language, t } = useLanguage()
  const [punchRecords, setPunchRecords] = useState<PunchRecord[]>([])
  const [vehicleLogs, setVehicleLogs] = useState<VehicleLog[]>([])
  const [receipts, setReceipts] = useState<ReceiptType[]>([])
  
  useEffect(() => {
    // Load punch records
    const savedPunch = localStorage.getItem(`punch_records_${userId}`)
    if (savedPunch) {
      setPunchRecords(JSON.parse(savedPunch))
    }
    
    // Load vehicle logs
    const savedVehicle = localStorage.getItem(`vehicle_logs_${userId}`)
    if (savedVehicle) {
      setVehicleLogs(JSON.parse(savedVehicle))
    }
    
    // Load receipts
    const savedReceipts = localStorage.getItem(`receipts_${userId}`)
    if (savedReceipts) {
      setReceipts(JSON.parse(savedReceipts))
    }
  }, [userId])
  
  // Get current month data
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyPunch = punchRecords.filter(r => r.date.startsWith(currentMonth))
  const monthlyVehicle = vehicleLogs.filter(l => l.date.startsWith(currentMonth))
  const monthlyReceipts = receipts.filter(r => r.date.startsWith(currentMonth))
  
  // Calculate statistics
  const totalOTHours = monthlyPunch.reduce((sum, r) => sum + r.otHours, 0)
  const lateDays = monthlyPunch.filter(r => r.status === 'late').length
  const normalDays = monthlyPunch.filter(r => r.status === 'normal').length
  const otDays = monthlyPunch.filter(r => r.status === 'ot-early' || r.status === 'ot-late').length
  
  const totalDistance = monthlyVehicle.reduce((sum, l) => sum + l.distanceKm, 0)
  const totalFuelCost = monthlyVehicle.reduce((sum, l) => sum + l.fuelTotalRM, 0)
  const totalTNG = monthlyVehicle.reduce((sum, l) => sum + l.tngAmount, 0)
  const totalReceiptAmount = monthlyReceipts.reduce((sum, r) => sum + r.amount, 0)
  
  // Recent activities
  const recentPunch = punchRecords.slice(-5).reverse()
  const recentVehicle = vehicleLogs.slice(-5).reverse()
  
  const stats = [
    {
      title: language === 'ms' ? 'Hari Bekerja' : 'Working Days',
      value: monthlyPunch.length,
      subtitle: language === 'ms' ? 'bulan ini' : 'this month',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: language === 'ms' ? 'Jumlah OT' : 'Total OT',
      value: `${totalOTHours.toFixed(1)}h`,
      subtitle: language === 'ms' ? 'jam lebih masa' : 'overtime hours',
      icon: Timer,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: language === 'ms' ? 'Hari Lewat' : 'Late Days',
      value: lateDays,
      subtitle: language === 'ms' ? 'bulan ini' : 'this month',
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: language === 'ms' ? 'Jumlah Perjalanan' : 'Total Trips',
      value: monthlyVehicle.length,
      subtitle: `${totalDistance.toLocaleString()} KM`,
      icon: Car,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: language === 'ms' ? 'Kos Minyak' : 'Fuel Cost',
      value: `RM ${totalFuelCost.toFixed(0)}`,
      subtitle: language === 'ms' ? 'bulan ini' : 'this month',
      icon: Fuel,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      title: language === 'ms' ? 'Jumlah Resit' : 'Total Receipts',
      value: `RM ${totalReceiptAmount.toFixed(0)}`,
      subtitle: `${monthlyReceipts.length} ${language === 'ms' ? 'resit' : 'receipts'}`,
      icon: Receipt,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.welcome}! 
        </h2>
        <p className="text-muted-foreground">
          {language === 'ms' 
            ? 'Berikut adalah ringkasan aktiviti anda untuk bulan ini.'
            : 'Here is your activity summary for this month.'}
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="glass-card rounded-xl p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </div>
          )
        })}
      </div>
      
      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Punch Status Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" />
            {language === 'ms' ? 'Status Kehadiran' : 'Attendance Status'}
          </h3>
          
          <div className="space-y-4">
            {/* Normal */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {language === 'ms' ? 'Normal' : 'Normal'}
                </span>
                <span className="font-medium">{normalDays} {language === 'ms' ? 'hari' : 'days'}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${monthlyPunch.length > 0 ? (normalDays / monthlyPunch.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            {/* OT */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-foreground">
                  <Timer className="w-4 h-4 text-green-600" />
                  {language === 'ms' ? 'Lebih Masa (OT)' : 'Overtime (OT)'}
                </span>
                <span className="font-medium">{otDays} {language === 'ms' ? 'hari' : 'days'}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${monthlyPunch.length > 0 ? (otDays / monthlyPunch.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            {/* Late */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {language === 'ms' ? 'Lewat' : 'Late'}
                </span>
                <span className="font-medium">{lateDays} {language === 'ms' ? 'hari' : 'days'}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${monthlyPunch.length > 0 ? (lateDays / monthlyPunch.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Punch Records */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            {language === 'ms' ? 'Rekod Kehadiran Terkini' : 'Recent Attendance'}
          </h3>
          
          {recentPunch.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t.noData}</p>
          ) : (
            <div className="space-y-3">
              {recentPunch.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(record.date).toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.punchIn || '--:--'} - {record.punchOut || '--:--'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'late' 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : record.status === 'ot-early' || record.status === 'ot-late'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {record.status === 'late' 
                      ? (language === 'ms' ? 'Lewat' : 'Late')
                      : record.status === 'ot-early' || record.status === 'ot-late'
                        ? 'OT'
                        : (language === 'ms' ? 'Normal' : 'Normal')
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Vehicle Logs */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Car className="w-5 h-5" />
          {language === 'ms' ? 'Log Kenderaan Terkini' : 'Recent Vehicle Logs'}
        </h3>
        
        {recentVehicle.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t.noData}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.date}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.vehicleNumber}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.destination}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">KM</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.fuelTotal}</th>
                </tr>
              </thead>
              <tbody>
                {recentVehicle.map((log) => (
                  <tr key={log.id} className="border-b border-border/50">
                    <td className="py-3 px-4">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium">{log.vehicleNumber}</td>
                    <td className="py-3 px-4">{log.destination}</td>
                    <td className="py-3 px-4">{log.distanceKm}</td>
                    <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                      RM {log.fuelTotalRM.toFixed(2)}
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
