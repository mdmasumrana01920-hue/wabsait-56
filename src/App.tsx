/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { SitesZones } from './components/SitesZones';
import { Reports } from './components/Reports';
import { Profile } from './components/Profile';
import { AddTask } from './components/AddTask';
import { ChatAgent } from './components/ChatAgent';
import { Deposit } from './components/Deposit';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Website, AdFormat, EarningsData, AdZone, UserTask, DepositRequest, PaymentMethod, InvestmentPlan } from './types';

const INVESTMENT_PLANS: InvestmentPlan[] = [
  { id: 'silver', name: 'Silver Plan', priceBDT: 800, priceUSD: 6.67, benefit: 'Daily 5% extra earnings', bonus: 0.05, color: 'from-slate-400 to-slate-600' },
  { id: 'gold', name: 'Gold Plan', priceBDT: 900, priceUSD: 7.50, benefit: 'Daily 7% extra earnings + Priority Support', bonus: 0.07, color: 'from-amber-400 to-amber-600' },
  { id: 'diamond', name: 'Diamond Plan', priceBDT: 1000, priceUSD: 8.33, benefit: 'Daily 10% extra earnings + Unlimited Tasks', bonus: 0.10, color: 'from-cyan-400 to-cyan-600', isRecommended: true },
];

const INITIAL_STATS: EarningsData[] = [
  { id: '1', date: '2024-05-10', earnings: 12.50, impressions: 4500, clicks: 120, websiteId: 'site1', adFormat: 'Popunder Ads' },
  { id: '2', date: '2024-05-11', earnings: 18.20, impressions: 5200, clicks: 156, websiteId: 'site1', adFormat: 'Smartlink (Direct Link)' },
  { id: '3', date: '2024-05-12', earnings: 15.10, impressions: 4800, clicks: 132, websiteId: 'site2', adFormat: 'Popunder Ads' },
  { id: '4', date: '2024-05-13', earnings: 22.45, impressions: 6100, clicks: 189, websiteId: 'site1', adFormat: 'In-Page Push' },
  { id: '5', date: '2024-05-14', earnings: 28.30, impressions: 7200, clicks: 210, websiteId: 'site2', adFormat: 'Smartlink (Direct Link)' },
  { id: '6', date: '2024-05-15', earnings: 24.15, impressions: 6800, clicks: 175, websiteId: 'site1', adFormat: 'Popunder Ads' },
  { id: '7', date: '2024-05-16', earnings: 32.10, impressions: 8500, clicks: 245, websiteId: 'site2', adFormat: 'In-Page Push' },
];

import { Auth } from './components/Auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useLocalStorage<{ email: string; name: string } | null>('adv_user_session', null);
  
  const [websites, setWebsites] = useLocalStorage<Website[]>('adv_websites', []);
  const [stats] = useLocalStorage<EarningsData[]>('adv_stats', INITIAL_STATS);
  const [userTasks, setUserTasks] = useLocalStorage<UserTask[]>('adv_user_tasks', []);
  const [userBalance, setUserBalance] = useLocalStorage<number>('adv_user_balance', 1280.45);
  const [depositRequests, setDepositRequests] = useLocalStorage<DepositRequest[]>('adv_deposit_requests', []);
  const [activePlan, setActivePlan] = useLocalStorage<string | null>('adv_active_plan', null);

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const handleAddWebsite = (url: string, category: string) => {
    const newWebsite: Website = {
      id: Math.random().toString(36).substring(2, 9),
      url,
      category,
      zones: [],
      createdAt: new Date().toISOString(),
    };
    setWebsites([...websites, newWebsite]);
  };

  const handleDeleteWebsite = (id: string) => {
    setWebsites(websites.filter(w => w.id !== id));
  };

  const handleAddZone = (websiteId: string, format: AdFormat) => {
    setWebsites(websites.map(w => {
      if (w.id === websiteId) {
        const newZone: AdZone = {
          id: Math.random().toString(36).substring(2, 9),
          format,
          status: Math.random() > 0.3 ? 'Active' : 'Pending',
          createdAt: new Date().toISOString(),
        };
        return { ...w, zones: [...w.zones, newZone] };
      }
      return w;
    }));
  };

  const handleCreateTask = (task: Omit<UserTask, 'id' | 'createdAt' | 'remaining' | 'status'>) => {
    const totalCost = task.reward * task.budget;
    if (totalCost > userBalance) return;

    const newTask: UserTask = {
      ...task,
      id: 'TASK-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      remaining: task.budget,
      status: 'Active',
    };

    setUserTasks([newTask, ...userTasks]);
    setUserBalance(prev => prev - totalCost);
  };

  const handleDepositRequest = (method: PaymentMethod, amount: number, trxId: string) => {
    const newRequest: DepositRequest = {
      id: 'DEP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      method,
      amount,
      trxId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setDepositRequests([newRequest, ...depositRequests]);
  };

  const handleApproveDeposit = (id: string) => {
    setDepositRequests(prev => prev.map(req => {
      if (req.id === id && req.status === 'Pending') {
        setUserBalance(curr => curr + req.amount);
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
  };

  const handleDeleteDeposit = (id: string) => {
    setDepositRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleBuyPlan = (plan: InvestmentPlan) => {
    if (userBalance >= plan.priceUSD) {
      setUserBalance(prev => prev - plan.priceUSD);
      setActivePlan(plan.id);
      return true;
    }
    return false;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview 
            stats={stats} 
            userTasks={userTasks} 
            userBalance={userBalance}
            activePlanId={activePlan}
            plans={INVESTMENT_PLANS}
            onBuyPlan={handleBuyPlan}
            depositRequests={depositRequests}
            onDepositRequest={handleDepositRequest}
            onApproveDeposit={handleApproveDeposit}
            onDeleteDeposit={handleDeleteDeposit}
          />
        );
      case 'monetize':
        return (
          <SitesZones 
            websites={websites} 
            onAddWebsite={handleAddWebsite} 
            onDeleteWebsite={handleDeleteWebsite} 
            onAddZone={handleAddZone}
          />
        );
      case 'add-task':
        return <AddTask userBalance={userBalance} onAddTask={handleCreateTask} />;
      case 'deposit':
        return (
          <Deposit 
            depositRequests={depositRequests} 
            onDepositRequest={handleDepositRequest} 
            onApproveDeposit={handleApproveDeposit}
            onDeleteRequest={handleDeleteDeposit}
          />
        );
      case 'earnings':
        return <Reports stats={stats} websites={websites} />;
      case 'profile':
        return <Profile userBalance={userBalance} />;
      default:
        return (
          <DashboardOverview 
            stats={stats} 
            userTasks={userTasks} 
            userBalance={userBalance}
            activePlanId={activePlan}
            plans={INVESTMENT_PLANS}
            onBuyPlan={handleBuyPlan}
            depositRequests={depositRequests}
            onDepositRequest={handleDepositRequest}
            onApproveDeposit={handleApproveDeposit}
            onDeleteDeposit={handleDeleteDeposit}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 flex overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="h-16 px-4 md:px-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Workspace</span>
              <span className="text-white/40">/</span>
              <span className="text-xs font-black text-white uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded border border-white/10">Default</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-tight">System Status: Online</span>
            </div>
            <button className="p-2 text-white/40 hover:text-white transition-colors relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#050505]" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <ChatAgent onNavigate={setActiveTab} />
    </div>
  );
}

