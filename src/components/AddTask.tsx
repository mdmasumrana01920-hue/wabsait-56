import { useState, FormEvent } from 'react';
import { PlusSquare, AlertCircle, CheckCircle2, Coins, Target, Link as LinkIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { TaskCategory, UserTask } from '../types';

interface AddTaskProps {
  userBalance: number;
  onAddTask: (task: Omit<UserTask, 'id' | 'createdAt' | 'remaining' | 'status'>) => void;
}

export function AddTask({ userBalance, onAddTask }: AddTaskProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TaskCategory>('YouTube Video');
  const [url, setUrl] = useState('');
  const [reward, setReward] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories: TaskCategory[] = ['YouTube Video', 'Website Visit', 'Social Media Follow'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const totalCost = reward * budget;

    if (!name || !url || reward <= 0 || budget <= 0) {
      setError('Please fill all fields correctly.');
      return;
    }

    if (totalCost > userBalance) {
      setError('Insufficient balance to create task. You need $' + totalCost.toFixed(2));
      return;
    }

    onAddTask({
      name,
      category,
      url,
      reward,
      budget,
    });

    setSuccess(true);
    setName('');
    setUrl('');
    setReward(0);
    setBudget(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Task</h1>
        <p className="text-white/50 text-sm">Create a task for the community to complete and grow your presence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Task Name</label>
                  <div className="relative">
                    <PlusSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      placeholder="e.g. Watch my Video"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Task Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-orange-500/50 transition-all"
                  >
                    {categories.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Target URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Reward (Coins/$) per completion</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.05"
                      value={reward || ''}
                      onChange={(e) => setReward(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Total Quantity (Users)</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="number"
                      placeholder="100"
                      value={budget || ''}
                      onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Task submitted successfully! Other users can now see it.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 uppercase tracking-widest text-sm"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-[#141414] border border-white/5">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Your Balance</span>
                <span className="text-white font-bold">${userBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Total Task Cost</span>
                <span className="text-orange-500 font-bold">${(reward * budget).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center font-bold">
                <span className="text-white/60">Final Balance</span>
                <span className={userBalance - (reward * budget) < 0 ? 'text-red-500' : 'text-green-500'}>
                  ${(userBalance - (reward * budget)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-orange-600/5 border border-orange-500/10">
            <h4 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] mb-4">Pro Tip</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              Higher rewards attract more users and get your task completed faster. Ensure your URL is accessible to avoid task rejection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
