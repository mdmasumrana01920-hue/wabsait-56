import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Trash2, Github, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ChatRole } from '../types';
import { cn } from '@/src/lib/utils';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ChatAgentProps {
  onNavigate: (tab: string) => void;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I am your AdVantage AI Assistant. How can I help you manage your publisher dashboard today?',
  timestamp: new Date().toISOString(),
};

export function ChatAgent({ onNavigate }: ChatAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('adv_chat_history', [WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock Gemini API Response Logic
    setTimeout(() => {
      const response = generateMockResponse(inputValue.toLowerCase());
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      if (response.tab) {
        setTimeout(() => {
          onNavigate(response.tab!);
        }, 1500);
      }
    }, 1500);
  };

  const generateMockResponse = (input: string): { text: string; tab?: string } => {
    if (input.includes('how to earn') || input.includes('monetize') || input.includes('coins')) {
      return { 
        text: 'To earn or monetize, you can add your websites in the "Sites & Zones" section. After adding a site, generate an ad tag and place it on your website. You can also view available community tasks in the Dashboard Overview.' 
      };
    }
    if (input.includes('add a task') || input.includes('create task') || input.includes('submit task')) {
      return { 
        text: 'Sure! I can help you with that. I am redirecting you to the "Add New Task" page right now.',
        tab: 'add-task'
      };
    }
    if (input.includes('dashboard') || input.includes('overview')) {
      return { 
        text: 'Taking you to the Dashboard Overview where you can see your earnings summary.',
        tab: 'overview'
      };
    }
    if (input.includes('sites') || input.includes('websites')) {
      return { 
        text: 'Navigating to the Sites & Zones management area.',
        tab: 'monetize'
      };
    }
    if (input.includes('earnings') || input.includes('report')) {
      return { 
        text: 'Opening your Earnings & Reports section.',
        tab: 'earnings'
      };
    }
    if (input.includes('profile') || input.includes('wallet') || input.includes('withdraw')) {
      return { 
        text: 'Heading to the Profile & Wallet section for balance management.',
        tab: 'profile'
      };
    }
    if (input.includes('hello') || input.includes('hi')) {
      return { text: 'Hello! How can I assist you with your publisher account today?' };
    }
    
    return { text: "I'm your AdVantage assistant! You can ask me about earning coins, adding sites, or navigating the platform. For example, try saying 'Add a task for me'." };
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-orange-600 text-white shadow-2xl shadow-orange-600/30 hover:bg-orange-500 hover:scale-110 transition-all active:scale-95 group",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="relative">
          <Sparkles className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-4 border-orange-600 animate-pulse" />
        </div>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-full max-w-[400px] h-[600px] flex flex-col bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase">AI Assistant</h3>
                  <div className="flex items-center gap-1.5 leading-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  className="p-2 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/30 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-orange-600 text-white rounded-tr-none" 
                      : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-bold text-white/20 mt-1 uppercase tracking-widest px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col max-w-[85%] mr-auto items-start">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center border border-white/5 shadow-inner">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all shadow-inner"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 disabled:bg-white/5 disabled:text-white/10 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-600/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-white/20 mt-3 font-bold uppercase tracking-[0.1em]">
                AdVantage AI Agent v1.0 • Built for AI Studio
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
