import { Cloud, LayoutDashboard, BarChart3, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BarChart3, label: 'Stats', path: '/stats' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <aside className="glass hidden lg:flex flex-col w-64 h-[calc(100vh-2rem)] sticky top-4 rounded-2xl ml-4 overflow-hidden border border-border">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <Cloud className="h-6 w-6 text-primary" />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          MyCloud
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-2">
        {items.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-start gap-4 p-4 w-full rounded-2xl transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 relative z-10 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="relative text-base z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="p-6 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-muted-foreground hover:text-red-400 transition-colors w-full p-4 hover:bg-red-500/10 rounded-2xl group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-base font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
};
