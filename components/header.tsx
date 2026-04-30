'use client'

import { useLanguage } from '@/lib/language-context'
import { Globe, LogOut, User, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  user: { name: string; email: string; avatarUrl?: string } | null
  onLogin: () => void
  onLogout: () => void
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])
  
  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }
  
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logos */}
          <div className="flex items-center gap-3">
            {/* Jata Negara Malaysia */}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-lg">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="18" fill="#FFD700" stroke="#8B4513" strokeWidth="1"/>
                <path d="M20 8 L24 16 L20 14 L16 16 Z" fill="#8B4513"/>
                <path d="M12 18 L28 18 L26 28 L14 28 Z" fill="#DC143C"/>
                <circle cx="20" cy="23" r="4" fill="#FFD700"/>
                <path d="M10 30 L30 30 L28 34 L12 34 Z" fill="#228B22"/>
              </svg>
            </div>
            
            {/* Logo Jabatan */}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <circle cx="20" cy="20" r="16" fill="#1E40AF" stroke="#60A5FA" strokeWidth="2"/>
                <path d="M20 10 L25 18 L20 16 L15 18 Z" fill="#FCD34D"/>
                <rect x="14" y="20" width="12" height="8" rx="1" fill="#60A5FA"/>
                <path d="M17 24 L23 24" stroke="#1E40AF" strokeWidth="2"/>
              </svg>
            </div>
            
            {/* Logo Penguatkuasa */}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                <polygon points="20,6 26,14 34,14 28,22 30,30 20,26 10,30 12,22 6,14 14,14" fill="#FCD34D"/>
                <circle cx="20" cy="18" r="6" fill="#DC2626"/>
                <path d="M17 18 L19 20 L23 16" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            
            {/* Title */}
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {t.systemTitle}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'ms' ? 'Jabatan Penguatkuasaan' : 'Enforcement Department'}
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ms' : 'en')}
              className="btn-3d flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'BM' : 'EN'}</span>
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-3d p-2 rounded-lg bg-secondary text-secondary-foreground"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="btn-3d flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.logout}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="btn-3d flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                <User className="w-4 h-4" />
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
