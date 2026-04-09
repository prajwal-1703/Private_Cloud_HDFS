import { Cloud, Bell, User, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const Navbar = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between col-span-full mb-6 rounded-b-2xl">
      <div className="flex items-center gap-2 lg:hidden">
        <Cloud className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          MyCloud
        </span>
      </div>
      
      <div className="hidden lg:block"></div>

      <div className="flex items-center gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            isConnected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}
        >
          {isConnected ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          API: {isConnected ? 'Connected' : 'Disconnected'}
        </motion.div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6 cursor-pointer">
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};
