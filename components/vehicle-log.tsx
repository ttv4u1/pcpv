'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { 
  Car, 
  Plus, 
  X, 
  Save,
  Fuel,
  MapPin,
  Clock,
  Calculator,
  FileText,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import type { VehicleLog } from '@/lib/types'

interface VehicleLogBookProps {
  userId: string
}

const FUEL_TYPES = [
  { value: 'RON95', label: 'RON 95' },
  { value: 'RON97', label: 'RON 97' },
  { value: 'DIESEL', label: 'Diesel' },
]

const VEHICLE_TYPES = [
  { value: 'kereta', label: { en: 'Car', ms: 'Kereta' } },
  { value: 'van', label: { en: 'Van', ms: 'Van' } },
  { value: 'mpv', label: { en: 'MPV', ms: 'MPV' } },
  { value: 'motosikal', label: { en: 'Motorcycle', ms: 'Motosikal' } },
  { value: 'lori', label: { en: 'Truck', ms: 'Lori' } },
]

export function VehicleLogBook({ userId }: VehicleLogBookProps) {
  const { language, t } = useLanguage()
  const [logs, setLogs] = useState<VehicleLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<VehicleLog | null>(null)
  const [viewingLog, setViewingLog] = useState<VehicleLog | null>(null)
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicleNumber: '',
    vehicleType: 'kereta',
    driver: '',
    destination: '',
    purpose: '',
    departureTime: '',
    returnTime: '',
    odometerBefore: '',
    odometerAfter: '',
    fuelType: 'RON95',
    fuelLiters: '',
    fuelPricePerLiter: '',
    tngAmount: '',
    parkingAmount: '',
    tollAmount: '',
    remarks: '',
  })
  
  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`vehicle_logs_${userId}`)
    if (saved) {
      setLogs(JSON.parse(saved))
    }
  }, [userId])
  
  // Calculate distance
  const distanceKm = formData.odometerAfter && formData.odometerBefore
    ? Math.max(0, Number(formData.odometerAfter) - Number(formData.odometerBefore))
    : 0
  
  // Calculate fuel total
  const fuelTotalRM = formData.fuelLiters && formData.fuelPricePerLiter
    ? Number(formData.fuelLiters) * Number(formData.fuelPricePerLiter)
    : 0
  
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vehicleNumber: '',
      vehicleType: 'kereta',
      driver: '',
      destination: '',
      purpose: '',
      departureTime: '',
      returnTime: '',
      odometerBefore: '',
      odometerAfter: '',
      fuelType: 'RON95',
      fuelLiters: '',
      fuelPricePerLiter: '',
      tngAmount: '',
      parkingAmount: '',
      tollAmount: '',
      remarks: '',
    })
    setEditingLog(null)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newLog: VehicleLog = {
      id: editingLog?.id || crypto.randomUUID(),
      userId,
      date: formData.date,
      vehicleNumber: formData.vehicleNumber,
      vehicleType: formData.vehicleType,
      driver: formData.driver,
      destination: formData.destination,
      purpose: formData.purpose,
      departureTime: formData.departureTime,
      returnTime: formData.returnTime,
      odometerBefore: Number(formData.odometerBefore),
      odometerAfter: Number(formData.odometerAfter),
      distanceKm,
      fuelType: formData.fuelType,
      fuelLiters: Number(formData.fuelLiters) || 0,
      fuelPricePerLiter: Number(formData.fuelPricePerLiter) || 0,
      fuelTotalRM,
      tngAmount: Number(formData.tngAmount) || 0,
      parkingAmount: Number(formData.parkingAmount) || 0,
      tollAmount: Number(formData.tollAmount) || 0,
      remarks: formData.remarks,
      createdAt: editingLog?.createdAt || new Date().toISOString(),
    }
    
    let updatedLogs: VehicleLog[]
    if (editingLog) {
      updatedLogs = logs.map(log => log.id === editingLog.id ? newLog : log)
    } else {
      updatedLogs = [...logs, newLog]
    }
    
    setLogs(updatedLogs)
    localStorage.setItem(`vehicle_logs_${userId}`, JSON.stringify(updatedLogs))
    
    resetForm()
    setShowForm(false)
  }
  
  const handleEdit = (log: VehicleLog) => {
    setFormData({
      date: log.date,
      vehicleNumber: log.vehicleNumber,
      vehicleType: log.vehicleType,
      driver: log.driver,
      destination: log.destination,
      purpose: log.purpose,
      departureTime: log.departureTime,
      returnTime: log.returnTime,
      odometerBefore: log.odometerBefore.toString(),
      odometerAfter: log.odometerAfter.toString(),
      fuelType: log.fuelType,
      fuelLiters: log.fuelLiters.toString(),
      fuelPricePerLiter: log.fuelPricePerLiter.toString(),
      tngAmount: log.tngAmount.toString(),
      parkingAmount: log.parkingAmount.toString(),
      tollAmount: log.tollAmount.toString(),
      remarks: log.remarks,
    })
    setEditingLog(log)
    setShowForm(true)
  }
  
  const handleDelete = (id: string) => {
    if (confirm(language === 'ms' ? 'Adakah anda pasti mahu memadam log ini?' : 'Are you sure you want to delete this log?')) {
      const updatedLogs = logs.filter(log => log.id !== id)
      setLogs(updatedLogs)
      localStorage.setItem(`vehicle_logs_${userId}`, JSON.stringify(updatedLogs))
    }
  }
  
  // Calculate totals
  const totalFuel = logs.reduce((sum, log) => sum + log.fuelTotalRM, 0)
  const totalTNG = logs.reduce((sum, log) => sum + log.tngAmount, 0)
  const totalParking = logs.reduce((sum, log) => sum + log.parkingAmount, 0)
  const totalToll = logs.reduce((sum, log) => sum + log.tollAmount, 0)
  const totalDistance = logs.reduce((sum, log) => sum + log.distanceKm, 0)
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calculator className="w-4 h-4" />
            <span className="text-sm">{language === 'ms' ? 'Jumlah Jarak' : 'Total Distance'}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalDistance.toLocaleString()} KM</p>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Fuel className="w-4 h-4" />
            <span className="text-sm">{language === 'ms' ? 'Jumlah Minyak' : 'Total Fuel'}</span>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">RM {totalFuel.toFixed(2)}</p>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">TNG</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">RM {totalTNG.toFixed(2)}</p>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">{language === 'ms' ? 'Parking' : 'Parking'}</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">RM {totalParking.toFixed(2)}</p>
        </div>
        
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-sm">{language === 'ms' ? 'Tol' : 'Toll'}</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">RM {totalToll.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Add Button */}
      <button
        onClick={() => { resetForm(); setShowForm(true) }}
        className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
      >
        <Plus className="w-5 h-5" />
        {t.addNewLog}
      </button>
      
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Car className="w-6 h-6" />
                {editingLog ? (language === 'ms' ? 'Sunting Log' : 'Edit Log') : t.addNewLog}
              </h2>
              <button
                onClick={() => { resetForm(); setShowForm(false) }}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.vehicleNumber}</label>
                  <input
                    type="text"
                    value={formData.vehicleNumber}
                    onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="WPL 1234"
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.vehicleType}</label>
                  <select
                    value={formData.vehicleType}
                    onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  >
                    {VEHICLE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Driver & Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.driver}</label>
                  <input
                    type="text"
                    value={formData.driver}
                    onChange={e => setFormData({ ...formData, driver: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.destination}</label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={e => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
              </div>
              
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.purpose}</label>
                <textarea
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground resize-none"
                  required
                />
              </div>
              
              {/* Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.departureTime}</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.returnTime}</label>
                  <input
                    type="time"
                    value={formData.returnTime}
                    onChange={e => setFormData({ ...formData, returnTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
              </div>
              
              {/* Odometer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.odometerBefore}</label>
                  <input
                    type="number"
                    value={formData.odometerBefore}
                    onChange={e => setFormData({ ...formData, odometerBefore: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.odometerAfter}</label>
                  <input
                    type="number"
                    value={formData.odometerAfter}
                    onChange={e => setFormData({ ...formData, odometerAfter: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.distanceTraveled}</label>
                  <div className="px-4 py-3 rounded-xl bg-secondary text-foreground font-bold">
                    {distanceKm.toLocaleString()} KM
                  </div>
                </div>
              </div>
              
              {/* Fuel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.fuelType}</label>
                  <select
                    value={formData.fuelType}
                    onChange={e => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  >
                    {FUEL_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.fuelLiters}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuelLiters}
                    onChange={e => setFormData({ ...formData, fuelLiters: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.fuelPrice}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fuelPricePerLiter}
                    onChange={e => setFormData({ ...formData, fuelPricePerLiter: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.fuelTotal}</label>
                  <div className="px-4 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
                    RM {fuelTotalRM.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Other Costs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.tngAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tngAmount}
                    onChange={e => setFormData({ ...formData, tngAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.parkingAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.parkingAmount}
                    onChange={e => setFormData({ ...formData, parkingAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.tollAmount}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tollAmount}
                    onChange={e => setFormData({ ...formData, tollAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground"
                  />
                </div>
              </div>
              
              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t.remarks}</label>
                <textarea
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground resize-none"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false) }}
                  className="btn-3d px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  <Save className="w-5 h-5" />
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {language === 'ms' ? 'Butiran Log' : 'Log Details'}
              </h2>
              <button
                onClick={() => setViewingLog(null)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.date}</p>
                  <p className="font-medium">{new Date(viewingLog.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.vehicleNumber}</p>
                  <p className="font-medium">{viewingLog.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.driver}</p>
                  <p className="font-medium">{viewingLog.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.destination}</p>
                  <p className="font-medium">{viewingLog.destination}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{t.purpose}</p>
                <p className="font-medium">{viewingLog.purpose}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t.distanceTraveled}</p>
                  <p className="font-bold text-xl">{viewingLog.distanceKm} KM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.fuelTotal}</p>
                  <p className="font-bold text-xl text-green-600">RM {viewingLog.fuelTotalRM.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.total}</p>
                  <p className="font-bold text-xl text-blue-600">
                    RM {(viewingLog.fuelTotalRM + viewingLog.tngAmount + viewingLog.parkingAmount + viewingLog.tollAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setViewingLog(null)}
              className="btn-3d w-full mt-6 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium"
            >
              {language === 'ms' ? 'Tutup' : 'Close'}
            </button>
          </div>
        </div>
      )}
      
      {/* Logs Table */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          {language === 'ms' ? 'Senarai Log Kenderaan' : 'Vehicle Log List'}
        </h3>
        
        {logs.length === 0 ? (
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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{language === 'ms' ? 'Minyak' : 'Fuel'}</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {logs.sort((a, b) => b.date.localeCompare(a.date)).map((log) => (
                  <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-3 px-4">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-medium">{log.vehicleNumber}</td>
                    <td className="py-3 px-4">{log.destination}</td>
                    <td className="py-3 px-4 font-medium">{log.distanceKm}</td>
                    <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                      RM {log.fuelTotalRM.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingLog(log)}
                          className="p-2 rounded-lg hover:bg-secondary text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(log)}
                          className="p-2 rounded-lg hover:bg-secondary text-yellow-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-2 rounded-lg hover:bg-secondary text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
