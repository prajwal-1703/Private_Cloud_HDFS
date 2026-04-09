import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { fetchStats } from '../lib/api';

export function Layout() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // Just a quick ping to see if backend is up
      fetchStats().then(() => setIsConnected(true)).catch(() => setIsConnected(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background flex text-foreground overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto px-4 lg:px-8 pb-8 relative z-10 w-full">
        <Navbar isConnected={isConnected} />
        
        <div className="max-w-7xl mx-auto w-full space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}