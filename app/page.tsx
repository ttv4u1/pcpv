'use client';

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Navigation, type TabType } from '@/components/navigation'
import { Dashboard } from '@/components/dashboard'
import { PunchCard } from '@/components/punch-card'
import { VehicleLogBook } from '@/components/vehicle-log'
import { ReceiptManagement } from '@/components/receipt-management'
import { ThemeProvider } from '@/components/theme-provider'

// Default user ID for demo
const DEFAULT_USER_ID = 'demo-user'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate user login - in production, this would come from Supabase Auth
    const savedUser = localStorage.getItem('pcpv_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      // Auto-login with demo user for now
      const demoUser = { name: 'Pengguna', email: 'demo@example.com' }
      localStorage.setItem('pcpv_user', JSON.stringify(demoUser))
      setUser(demoUser)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    const demoUser = { name: 'Pengguna', email: 'demo@example.com' }
    localStorage.setItem('pcpv_user', JSON.stringify(demoUser))
    setUser(demoUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('pcpv_user')
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Sistem Pengurusan Kenderaan & Kehadiran
            </h1>
            <p className="text-muted-foreground mb-6">
              Sila log masuk untuk mengakses sistem.
            </p>
            <button
              onClick={handleLogin}
              className="btn-3d w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Log Masuk
            </button>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  // Get user ID - use a consistent ID
  const userId = user.email.split('@')[0]

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header user={user} onLogin={handleLogin} onLogout={handleLogout} />
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 py-6">
          {activeTab === 'dashboard' && <Dashboard userId={userId} />}
          {activeTab === 'punch' && <PunchCard userId={userId} />}
          {activeTab === 'vehicle' && <VehicleLogBook userId={userId} />}
          {activeTab === 'receipts' && <ReceiptManagement userId={userId} />}
        </main>
      </div>
    </ThemeProvider>
  )
}
