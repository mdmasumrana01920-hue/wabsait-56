import { useState, FormEvent } from 'react';
import { Plus, Trash2, Code, ExternalLink, ShieldCheck, Clock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Website, AdFormat } from '../types';
import { cn } from '@/src/lib/utils';

interface SitesZonesProps {
  websites: Website[];
  onAddWebsite: (url: string, category: string) => void;
  onDeleteWebsite: (id: string) => void;
  onAddZone: (websiteId: string, format: AdFormat) => void;
}

export function SitesZones({ websites, onAddWebsite, onDeleteWebsite, onAddZone }: SitesZonesProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Blog');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>('Popunder Ads');

  const categories = ['Blog', 'Entertainment', 'Faucet', 'Social', 'Other'];
  const adFormats: AdFormat[] = ['Popunder Ads', 'Smartlink (Direct Link)', 'In-Page Push'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onAddWebsite(url, category);
    setUrl('');
  };

  const getFormatIcon = (format: AdFormat) => {
    switch (format) {
      case 'Popunder Ads': return <ShieldCheck className="w-4 h-4" />;
      case 'Smartlink (Direct Link)': return <ExternalLink className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Sites & Ad Zones</h1>
        <p className="text-white/50 text-sm">Monetize your traffic by adding websites and generating tags.</p>
      </div>

      <div className="p-8 rounded-2xl bg-[#141414] border border-white/5 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-6">Add New Asset</h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Website URL</label>
            <input
              type="text"
              placeholder="e.g. mysite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 transition-all font-sans"
            />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 ml-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
            </select>
          </div>
          <button
            type="submit"
            className="mt-6 md:mt-auto px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Site
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Your Websites 
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{websites.length}</span>
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {websites.map((site) => (
              <motion.div
                key={site.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-sm"
              >
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-600/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{site.url}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider text-white/50">{site.category}</span>
                        <span className="text-[10px] text-white/30">•</span>
                        <span className="text-[10px] text-white/30">Added on {new Date(site.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowModal(site.id)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 transition-all tracking-tight font-medium text-sm flex items-center gap-2 ring-1 ring-white/10"
                    >
                      <Plus className="w-4 h-4" />
                      Add Ad Zone
                    </button>
                    <button
                      onClick={() => onDeleteWebsite(site.id)}
                      className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-black/20">
                  {site.zones.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-white/20 text-sm font-medium">No ad zones generated for this site.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {site.zones.map((zone) => (
                        <div key={zone.id} className="p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-all">
                          <div className="flex items-center justify-between mb-3 text-sm font-bold text-white tracking-tight">
                            <div className="flex items-center gap-2">
                              {getFormatIcon(zone.format)}
                              {zone.format}
                            </div>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter",
                              zone.status === 'Active' ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"
                            )}>
                              {zone.status}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFormat(zone.format);
                              setShowModal('TAG_' + zone.id);
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 group-hover:bg-orange-600/20 group-hover:text-orange-500 border border-white/10 rounded-lg text-xs font-bold text-white/60 transition-all active:scale-95"
                          >
                            <Code className="w-4 h-4" />
                            Get Tag
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal for Ad Zone Selection */}
      {showModal && !showModal.startsWith('TAG_') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Select Ad Format</h2>
            <div className="space-y-3">
              {adFormats.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={cn(
                    "w-full p-4 rounded-2xl border flex flex-col items-start gap-1 transition-all text-left",
                    selectedFormat === format 
                      ? "bg-orange-600 border-orange-500 shadow-lg shadow-orange-600/20" 
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <span className={cn("text-sm font-bold uppercase tracking-tight", selectedFormat === format ? "text-white" : "text-white/80")}>
                    {format}
                  </span>
                  <p className={cn("text-xs", selectedFormat === format ? "text-white/70" : "text-white/40")}>
                    {format === 'Popunder Ads' ? 'Best for high CPM and visibility.' : format === 'Smartlink (Direct Link)' ? 'Monetize simple button clicks.' : 'Non-intrusive native push ads.'}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddZone(showModal, selectedFormat);
                  setShowModal(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold text-white transition-all shadow-lg shadow-orange-600/20"
              >
                Create Zone
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal for Tag Code */}
      {showModal && showModal.startsWith('TAG_') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Integration Script</h2>
            <p className="text-sm text-white/40 mb-6 font-medium">Copy and paste this script before the &lt;/body&gt; tag of your website.</p>
            
            <div className="relative group">
              <pre className="p-6 bg-black rounded-2xl border border-white/10 text-xs font-mono text-orange-500 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {`<script src="https://adv-network.com/sdk.js"></script>
<script>
  window.AdvNet = window.AdvNet || [];
  AdvNet.push({
    zoneId: "${showModal.replace('TAG_', '')}",
    format: "${selectedFormat.toLowerCase().replace(/\s+/g, '_')}",
    secure: true
  });
</script>`}
              </pre>
              <button 
                onClick={() => {
                  const code = `https://adv-network.com/sdk.js integration code for ${selectedFormat}`;
                  navigator.clipboard.writeText(code);
                  alert('Integration code copied to clipboard!');
                }}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-orange-500 hover:text-white rounded-lg text-white/40 border border-white/10 transition-all active:scale-95"
              >
                <Code className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowModal(null)}
                className="w-full px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
