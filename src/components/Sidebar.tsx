import { LayoutDashboard, Globe, BarChart3, User, Wallet, LogOut, X, PlusSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'overview', name: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'monetize', name: 'Sites & Zones', icon: Globe },
  { id: 'add-task', name: 'Add New Task', icon: PlusSquare },
  { id: 'deposit', name: 'Add Funds', icon: Wallet },
  { id: 'earnings', name: 'Earnings & Reports', icon: BarChart3 },
  { id: 'profile', name: 'Profile & Wallet', icon: User },
];

export function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onLogout }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:z-20",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-600/20">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AdVantage</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                activeTab === item.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                activeTab === item.id ? "text-orange-500 scale-110" : "group-hover:scale-110"
              )} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 text-white/40 cursor-default">
            <User className="w-5 h-5" />
            <div className="flex flex-col">
              <span className="text-xs text-white/80 font-medium truncate w-32">Publisher Account</span>
              <span className="text-[10px]">ID: PUB-82910</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
