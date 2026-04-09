import { useEffect, useState } from 'react';
import { fetchStats } from '../lib/api';
import { Activity, Database, Lock, Network, HardDrive, FileText, Server } from 'lucide-react';

export function Stats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await fetchStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statCards = [
    { label: 'Total Files', value: stats?.totalFiles || 0, icon: FileText },
    { label: 'Total Storage Used', value: formatBytes(stats?.totalStorage || 0), icon: HardDrive },
    { label: 'API Uptime', value: stats?.apiUptime || '99.9%', icon: Activity },
    { label: 'Active Connections', value: stats?.activeConnections || 0, icon: Network },
    { label: 'API Calls', value: stats?.apiCalls || 0, icon: Server },
    { label: 'Encryption Status', value: stats?.encryptionStatus || 'Offline', icon: Lock },
    { label: 'HDFS Status', value: stats?.hdfsStatus || 'Offline', icon: Database },
  ];

  return (
    <div className="mt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">System Statistics</h1>
        <p className="text-muted-foreground mt-2">Overview of API calls, metadata, and storage stats.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="h-32 bg-card border border-border rounded-xl animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-card text-card-foreground border border-border rounded-xl p-6 transition-all hover:border-primary/50 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5">
                <stat.icon className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}