import { User, Wallet, Shield, History, ArrowUpRight, DollarSign } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ProfileProps {
  userBalance: number;
}

export function Profile({ userBalance }: ProfileProps) {
  const transactions = [
    { id: 'TX-9281', amount: 450.00, method: 'PayPal', status: 'Completed', date: '2024-05-10' },
    { id: 'TX-9275', amount: 215.50, method: 'Wire Transfer', status: 'In Progress', date: '2024-05-15' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile & Wallet</h1>
        <p className="text-white/50 text-sm">Manage your account information and withdrawal methods.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-orange-600/20 flex items-center justify-center border-2 border-orange-500 mb-4 ring-8 ring-orange-500/5">
              <User className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Publisher Account</h3>
            <p className="text-sm text-white/40 mb-6 font-medium">mdmasumrana01920@gmail.com</p>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 transition-all">
              Edit Account
            </button>
          </div>

          <div className="p-8 rounded-2xl bg-[#141414] border border-white/5">
            <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" />
              Security Settings
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">2FA Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Email Verified</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-bold">Yes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 border-none shadow-2xl shadow-orange-600/30">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-orange-100/60 text-xs font-bold uppercase tracking-widest mb-1">Available Profit</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">
                  <span className="text-3xl font-bold opacity-60 mr-1">$</span>
                  {userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-4 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                Withdraw Now
                <ArrowUpRight className="w-5 h-5" />
              </button>
              <button className="px-6 py-4 bg-orange-950/20 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-sm transition-all hover:bg-orange-900/30 text-sm">
                Pricing
              </button>
            </div>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-white/40" />
                Recent Withdrawals
              </h3>
            </div>
            <div className="p-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-600/10 rounded-lg text-orange-500">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">{tx.method} Withdrawal</p>
                      <p className="text-[10px] text-white/30 font-medium">{tx.id} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white tracking-tight">${tx.amount.toFixed(2)}</p>
                    <p className={cn(
                      "text-[10px] font-bold uppercase",
                      tx.status === 'Completed' ? "text-green-500" : "text-yellow-500"
                    )}>{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
