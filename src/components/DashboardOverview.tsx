import { DollarSign, MousePointer2, Eye, TrendingUp, Users, ExternalLink, Coins, Sparkles, CheckCircle2, ShieldCheck, Smartphone, Bitcoin, ArrowRight, Clock, Trash2, AlertCircle, Copy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { EarningsData, UserTask, InvestmentPlan, PaymentMethod, DepositRequest } from '../types';
import { useRef, useState, FormEvent } from 'react';
import { cn } from '@/src/lib/utils';

interface OverviewProps {
  stats: EarningsData[];
  userTasks: UserTask[];
  userBalance: number;
  activePlanId: string | null;
  plans: InvestmentPlan[];
  onBuyPlan: (plan: InvestmentPlan) => boolean;
  depositRequests: DepositRequest[];
  onDepositRequest: (method: PaymentMethod, amount: number, trxId: string) => void;
  onApproveDeposit: (id: string) => void;
  onDeleteDeposit: (id: string) => void;
}

export function DashboardOverview({ 
  stats, 
  userTasks, 
  userBalance, 
  activePlanId, 
  plans, 
  onBuyPlan,
  depositRequests,
  onDepositRequest,
  onApproveDeposit,
  onDeleteDeposit
}: OverviewProps) {
  const depositRef = useRef<HTMLDivElement>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Deposit form state (simplified for dashboard)
  const [method, setMethod] = useState<PaymentMethod>('BKash');
  const [amount, setAmount] = useState<number>(8.33); // Default to ~1000 BDT at 120 rate
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const CONVERSION_RATE = 120;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarnings = stats.reduce((acc, curr) => acc + curr.earnings, 0).toFixed(2);
  const totalImpressions = stats.reduce((acc, curr) => acc + curr.impressions, 0);
  const totalClicks = stats.reduce((acc, curr) => acc + curr.clicks, 0);
  const avgCPM = ((Number(totalEarnings) / totalImpressions) * 1000 || 0).toFixed(2);

  const handlePurchase = (plan: InvestmentPlan) => {
    setPurchaseError(null);
    setPurchaseSuccess(null);

    const success = onBuyPlan(plan);
    if (success) {
      setPurchaseSuccess(`Plan "${plan.name}" Activated Successfully!`);
      setTimeout(() => setPurchaseSuccess(null), 5000);
    } else {
      setPurchaseError('Insufficient Balance. Please Deposit funds first.');
      setTimeout(() => {
        setPurchaseError(null);
        depositRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    }
  };

  const handleDepositSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId) return;
    onDepositRequest(method, amount, trxId);
    setIsSubmitted(true);
    setAmount(8.33);
    setTrxId('');
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const metrics = [
    { label: 'Total Earnings', value: `$${totalEarnings}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Clicks', value: totalClicks.toLocaleString(), icon: MousePointer2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Avg. CPM', value: `$${avgCPM}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  const paymentMethods: { id: PaymentMethod; name: string; icon: any; color: string }[] = [
    { id: 'BKash', name: 'BKash', icon: Smartphone, color: 'bg-[#D12053]' },
    { id: 'Nagad', name: 'Nagad', icon: Smartphone, color: 'bg-[#F7941E]' },
    { id: 'Rocket', name: 'Rocket', icon: Smartphone, color: 'bg-[#8C3494]' },
    { id: 'Crypto', name: 'Crypto (USDT)', icon: Bitcoin, color: 'bg-[#26A17B]' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* 1. Investment Plans Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Premium Investment Plans</h2>
            <p className="text-white/40 text-sm font-medium">Maximize your returns with our exclusive publisher tiers.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Your Balance</span>
            <span className="text-xl font-mono font-black text-orange-500">${userBalance.toFixed(2)}</span>
          </div>
        </div>

        <AnimatePresence>
          {purchaseError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
            >
              <AlertCircle className="w-5 h-5" />
              {purchaseError}
            </motion.div>
          )}
          {purchaseSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center gap-3 text-green-500 text-sm font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              {purchaseSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -5 }}
              className={cn(
                "relative group p-8 rounded-[2.5rem] bg-[#141414] border transition-all duration-500 overflow-hidden",
                activePlanId === plan.id ? "border-orange-500 ring-4 ring-orange-500/10" : "border-white/5 hover:border-white/20",
                plan.isRecommended && "shadow-2xl shadow-orange-600/10"
              )}
            >
              {/* Background Glow */}
              <div className={cn("absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br", plan.color)} />
              
              {plan.isRecommended && (
                <div className="absolute top-6 right-6">
                  <div className="px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none">Recommended</span>
                  </div>
                </div>
              )}

              <div className="relative mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">{plan.priceBDT}</span>
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">BDT</span>
                </div>
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Approx. ${plan.priceUSD.toFixed(2)}</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-green-500/20 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  </div>
                  <p className="text-xs text-white/60 font-medium leading-relaxed">{plan.benefit}</p>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={activePlanId === plan.id}
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all flex items-center justify-center gap-2",
                  activePlanId === plan.id 
                    ? "bg-green-500 text-white cursor-default" 
                    : "bg-white text-black hover:bg-orange-600 hover:text-white"
                )}
              >
                {activePlanId === plan.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Active Plan
                  </>
                ) : (
                  <>
                    Buy Now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Deposit System Section */}
      <section ref={depositRef} className="space-y-8 bg-[#141414] border border-white/5 rounded-[3rem] p-8 md:p-12">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Deposit Funds</h2>
          <p className="text-white/40 text-sm font-medium">Add balance instantly via local payment gateways like BKash and Nagad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-black text-white/20 uppercase tracking-[0.2em] mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setMethod(pm.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all flex items-center gap-4 group relative",
                      method === pm.id 
                        ? "bg-white/10 border-orange-500/50 shadow-lg" 
                        : "bg-white/5 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", pm.color)}>
                      <pm.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{pm.name}</span>
                    {method === pm.id && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-white/5 rounded-[2rem] relative">
              <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Transfer Instructions
              </h4>
              <div className="space-y-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] text-white/40 font-black uppercase tracking-widest">
                    {method === 'Crypto' ? 'USDT (TRC20) Address' : `${method} Payment Number`}
                    {method === 'BKash' && <span className="ml-2 text-orange-500">(Send Money)</span>}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono font-black text-cyan-400 tracking-wider">
                      {method === 'Crypto' 
                        ? '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' 
                        : '01747672012'
                      }
                    </span>
                    <button 
                      onClick={() => handleCopy(method === 'Crypto' ? '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' : '01747672012')}
                      className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all group relative border border-white/5"
                    >
                      <Copy className={cn("w-5 h-5 transition-colors", copied ? "text-green-500" : "text-white/40 group-hover:text-white")} />
                      {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-black whitespace-nowrap shadow-xl">
                          COPIED!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-white/60 leading-relaxed font-bold">
                    After sending money, please provide your Transaction ID (TrxID) below for verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleDepositSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Deposit Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-orange-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="10.00"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Transaction ID (TrxID)</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    placeholder="Enter TrxID"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono shadow-inner"
                  />
                </div>
              </div>

              <div className="bg-white/5 px-6 py-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-0.5">Summary</span>
                  <span className="text-sm font-black text-white">${amount.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-0.5">Payable BDT</span>
                  <span className="text-sm font-black text-white">{(amount * CONVERSION_RATE).toLocaleString()} BDT</span>
                </div>
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-5 font-black rounded-2xl transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px] active:scale-[0.98]",
                  isSubmitted 
                    ? "bg-green-600 text-white shadow-green-600/30" 
                    : "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/30"
                )}
              >
                {isSubmitted ? 'Request Submitted!' : 'Confirm Deposit'}
              </button>

              {/* Recent Deposits List */}
              <div className="mt-12 space-y-4">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-1">Recent Deposits</h3>
                <div className="space-y-3">
                  {depositRequests.filter(r => r.status === 'Pending').length === 0 ? (
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center text-[10px] text-white/10 uppercase font-black tracking-widest">
                      No pending deposits
                    </div>
                  ) : (
                    depositRequests.filter(r => r.status === 'Pending').slice(0, 3).map(req => (
                      <div key={req.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-600/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-white uppercase">{req.method} Deposit</div>
                            <div className="text-[9px] font-mono text-white/30">{req.trxId}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-white tracking-tighter">{(req.amount * CONVERSION_RATE).toLocaleString()} BDT</div>
                          <div className="text-[8px] font-black text-orange-500 uppercase tracking-tighter bg-orange-500/10 px-1.5 py-0.5 rounded-full inline-block mt-1">Pending</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. Original Features - Stats and Tasks */}
      <div className="pt-12 border-t border-white/5">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-8">Performance Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-[2rem] bg-[#141414] border border-white/5 hover:border-white/10 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${metric.bg}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{metric.label}</p>
                  <p className="text-xl font-black text-white mt-0.5">{metric.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#141414] border border-white/5"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Earnings Performance</h3>
                <p className="text-xs text-white/40 font-medium lowercase">revenue trends for the past week</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#ffffff60' }}
                  />
                  <YAxis 
                    stroke="#ffffff40" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fill: '#ffffff60' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                    itemStyle={{ color: '#f97316' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#f97316" 
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                    strokeWidth={4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="p-8 rounded-[2.5rem] bg-[#141414] border border-white/5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Community Tasks</h3>
              <div className="px-2 py-0.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase">Live</div>
            </div>
            
            <div className="space-y-4 flex-1">
              {userTasks.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-white/10" />
                  </div>
                  <p className="text-xs text-white/20 font-bold uppercase tracking-widest">No active tasks.</p>
                </div>
              ) : (
                userTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{task.category}</span>
                      <span className="text-[9px] text-white/20 font-mono">{task.id}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-4 line-clamp-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{task.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-xs font-black text-white/80 tracking-tighter">${task.reward.toFixed(2)}</span>
                      </div>
                      <a 
                        href={task.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-orange-600 text-white text-[9px] font-black rounded-xl transition-all uppercase tracking-[0.2em]"
                      >
                        Earn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
            {userTasks.length > 4 && (
              <button className="w-full mt-6 py-4 border border-white/5 hover:border-white/10 text-[10px] font-black text-white/30 hover:text-white uppercase tracking-[0.3em] transition-all rounded-2xl">
                Explore All Tasks
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* 4. Transactions List (New Section for Overview) */}
      <div className="bg-[#141414] border border-white/5 rounded-[3rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 text-white/60">
            <Clock className="w-4 h-4" />
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          {depositRequests.length === 0 ? (
            <div className="py-20 text-center text-white/10 text-xs font-bold uppercase tracking-widest">
              No transactions found.
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">Method</th>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">TrxID</th>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[9px] uppercase font-black text-white/30 tracking-[0.2em] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {depositRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-bold text-white/40">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tighter",
                        req.method === 'BKash' ? "bg-red-500/10 text-red-500" : 
                        req.method === 'Nagad' ? "bg-orange-500/10 text-orange-500" :
                        req.method === 'Rocket' ? "bg-purple-500/10 text-purple-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {req.method}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-mono text-white/40 tracking-tighter truncate max-w-[100px]">{req.trxId}</td>
                    <td className="px-8 py-5 text-xs font-black text-white">${req.amount.toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-tighter",
                        req.status === 'Approved' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                        req.status === 'Pending' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {req.status === 'Pending' ? (
                        <button
                          onClick={() => onApproveDeposit(req.id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-[9px] font-black rounded-lg uppercase tracking-widest transition-all"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => onDeleteDeposit(req.id)}
                          className="p-2 text-white/10 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
