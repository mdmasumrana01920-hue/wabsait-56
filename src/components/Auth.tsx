import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock registered users in local storage
  const [registeredUsers, setRegisteredUsers] = useLocalStorage<{ email: string; password: string; name: string }[]>('adv_registered_users', [
    { email: 'demo@example.com', password: 'password123', name: 'Demo Publisher' }
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (isLogin) {
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        if (user) {
          onLogin({ email: user.email, name: user.name });
        } else {
          setError('Invalid credentials. Please try again.');
          setIsLoading(false);
        }
      } else {
        if (!email || !password || !name) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        if (registeredUsers.some(u => u.email === email)) {
          setError('Email already registered.');
          setIsLoading(false);
          return;
        }
        
        const newUser = { email, password, name };
        setRegisteredUsers([...registeredUsers, newUser]);
        onLogin({ email, name });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-3xl text-white shadow-2xl shadow-orange-600/40 mb-4 animate-bounce-slow">
            A
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">AdVantage</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mt-1">Publisher Network</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/50">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <div className="px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Security v2.0</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Password</label>
                {isLogin && <button type="button" className="text-[10px] text-orange-500 font-bold hover:underline">Forgot?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold leading-tight"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-4 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/40 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="ml-2 text-white font-bold hover:text-orange-500 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        <p className="text-[10px] text-center text-white/20 mt-8 font-bold uppercase tracking-[0.2em] leading-relaxed">
          &copy; 2024 AdVantage Global Network.<br />
          All Rights Reserved. Secure Cloud Integration.
        </p>
      </motion.div>
    </div>
  );
}
