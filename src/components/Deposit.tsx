import { useState, FormEvent } from 'react';
import { Wallet, Smartphone, Landmark, Bitcoin, ArrowRight, CheckCircle2, Clock, ShieldCheck, AlertCircle, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentMethod, DepositRequest } from '../types';
import { cn } from '@/src/lib/utils';

interface DepositProps {
  depositRequests: DepositRequest[];
  onDepositRequest: (method: PaymentMethod, amount: number, trxId: string) => void;
  onApproveDeposit: (id: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function Deposit({ depositRequests, onDepositRequest, onApproveDeposit, onDeleteRequest }: DepositProps) {
  const [method, setMethod] = useState<PaymentMethod>('BKash');
  const [amount, setAmount] = useState<number>(8.33);
  const [trxId, setTrxId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const CONVERSION_RATE = 120; // 1 USD = 120 BDT

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentMethods: { id: PaymentMethod; name: string; icon: any; color: string }[] = [
    { id: 'BKash', name: 'BKash', icon: Smartphone, color: 'bg-[#D12053]' },
    { id: 'Nagad', name: 'Nagad', icon: Smartphone, color: 'bg-[#F7941E]' },
    { id: 'Rocket', name: 'Rocket', icon: Smartphone, color: 'bg-[#8C3494]' },
    { id: 'Crypto', name: 'Crypto (USDT)', icon: Bitcoin, color: 'bg-[#26A17B]' },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !trxId) return;

    onDepositRequest(method, amount, trxId);
    setIsSubmitted(true);
    setAmount(8.33);
    setTrxId('');
    setTimeout(() => {
      setIsSubmitted(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Add Funds</h1>
        <p className="text-white/50 text-sm">Deposit balance to create tasks and promote your content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 shadow-xl">
            <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6">Select Payment Method</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 group relative",
                    method === pm.id 
                      ? "bg-white/10 border-orange-500 shadow-lg shadow-orange-500/10" 
                      : "bg-white/5 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", pm.color)}>
                    <pm.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white">{pm.name}</span>
                  {method === pm.id && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 fill-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-8 bg-[#1a1a1a] border border-white/5 rounded-2xl mb-8 relative">
              <h4 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Payment Instructions
              </h4>
              <div className="space-y-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
                    {method === 'Crypto' ? 'USDT (TRC20) Address' : `${method} Payment Number`}
                    {method === 'BKash' && <span className="ml-2 text-orange-500/80">(Send Money)</span>}
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
                      className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group relative border border-white/5"
                    >
                      <Copy className={cn("w-5 h-5 transition-colors", copied ? "text-green-500" : "text-white/40 group-hover:text-white")} />
                      {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-xl">
                          COPIED!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-sm text-white/60 leading-relaxed font-bold italic">
                    After sending money, please provide your Transaction ID (TrxID) below for verification.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Deposit Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-orange-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 10.00"
                      value={amount || ''}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Transaction ID (TrxID)</label>
                  <div className="relative text-white/20">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Paste TrxID here"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-1">
                Conversion: ${amount || 0} = {(amount * CONVERSION_RATE).toLocaleString()} BDT
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-4 font-black rounded-xl transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2",
                   isSubmitted 
                    ? "bg-green-600 text-white shadow-green-600/30" 
                    : "bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20"
                )}
              >
                {isSubmitted ? 'Request Submitted!' : 'Submit Deposit Request'}
                {!isSubmitted && <ArrowRight className="w-4 h-4" />}
                {isSubmitted && <CheckCircle2 className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Deposit Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Fee (0%)</span>
                <span className="text-green-500 font-bold">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Net Amount</span>
                <span className="text-white font-bold">${amount.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center font-black">
                <span className="text-white/60">Payable BDT</span>
                <span className="text-orange-500">{(amount * CONVERSION_RATE).toLocaleString()} BDT</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Help Center</h4>
              <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                Deposits are usually processed within 5-30 minutes. If your request is pending for more than 2 hours, please contact support with your TrxID.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            Transaction History
          </h3>
        </div>
        <div className="overflow-x-auto">
          {depositRequests.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-white/10" />
              </div>
              <p className="text-sm text-white/20 font-medium">No deposit history found.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">Method</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">TrxID</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {depositRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-xs font-medium text-white/40">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-black uppercase",
                        req.method === 'BKash' ? "bg-red-500/10 text-red-500" : 
                        req.method === 'Nagad' ? "bg-orange-500/10 text-orange-500" :
                        req.method === 'Rocket' ? "bg-purple-500/10 text-purple-500" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {req.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-white/60">{req.trxId}</td>
                    <td className="px-6 py-4 text-sm font-black text-white">${req.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter",
                        req.status === 'Approved' ? "bg-green-500/10 text-green-500" :
                        req.status === 'Pending' ? "bg-yellow-500/10 text-yellow-500" :
                        "bg-red-500/10 text-red-500"
                      )}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => onApproveDeposit(req.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black rounded uppercase tracking-tighter transition-all"
                            title="Mock Approve (For Testing)"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteRequest(req.id)}
                          className="p-1 text-white/10 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
