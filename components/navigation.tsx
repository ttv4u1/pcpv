'use client'

import { useLanguage } from '@/lib/language-context'
import { LayoutDashboard, Clock, Car, Receipt } from 'lucide-react'

type TabType = 'dashboard' | 'punch' | 'vehicle' | 'receipts'

interface NavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage()
  
  const tabs = [
    { id: 'dashboard' as TabType, label: t.dashboard, icon: LayoutDashboard },
    { id: 'punch' as TabType, label: t.punchCard, icon: Clock },
    { id: 'vehicle' as TabType, label: t.vehicleLog, icon: Car },
    { id: 'receipts' as TabType, label: t.receipts, icon: Receipt },
  ]
  
  return (
    <nav className="glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`btn-3d flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
