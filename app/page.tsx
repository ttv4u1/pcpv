'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Navigation, type TabType } from '@/components/navigation';
import { Dashboard } from '@/components/dashboard';
import { PunchCard } from '@/components/punch-card';
import { VehicleLogBook } from '@/components/vehicle-log';
import { ReceiptManagement } from '@/components/receipt-management';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/lib/language-context'; // LANGKAH 1: IMPORT INI

const DEFAULT_USER_ID = 'demo-user';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('pcpv_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const demoUser = { id: DEFAULT_USER_ID, name: 'Pengguna', email: 'demo@example.com' };
      localStorage.setItem('pcpv_user', JSON.stringify(demoUser));
      setUser(demoUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const demoUser = { id: DEFAULT_USER_ID, name: 'Pengguna', email: 'demo@example.com' };
    localStorage.setItem('pcpv_user', JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('pcpv_user');
    setUser(null);
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    /* LANGKAH 2: BALUT SEMUA KOD DENGAN LanguageProvider */
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          {/* @ts-ignore */}
          <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />
          
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="container mx-auto py-6 px-4">
            {(activeTab as any) === 'dashboard' && <Dashboard userId={DEFAULT_USER_ID} />}
            {(activeTab as any) === 'punch-card' && <PunchCard userId={DEFAULT_USER_ID} />}
            {(activeTab as any) === 'vehicle-log' && <VehicleLogBook userId={DEFAULT_USER_ID} />}
            {(activeTab as any) === 'receipts' && <ReceiptManagement userId={DEFAULT_USER_ID} />}
          </main>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}