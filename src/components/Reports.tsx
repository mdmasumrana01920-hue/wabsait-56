import { useState, useMemo } from 'react';
import { Download, Calendar, Filter, ChevronUp, ChevronDown, Search, X } from 'lucide-react';
import { EarningsData, Website, AdFormat } from '../types';
import { cn } from '@/src/lib/utils';

interface ReportsProps {
  stats: EarningsData[];
  websites: Website[];
}

type SortField = 'date' | 'earnings' | 'impressions' | 'clicks';
type SortOrder = 'asc' | 'desc';

export function Reports({ stats, websites }: ReportsProps) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedWebsite, setSelectedWebsite] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const adFormats: AdFormat[] = ['Popunder Ads', 'Smartlink (Direct Link)', 'In-Page Push'];

  const filteredAndSortedStats = useMemo(() => {
    let result = [...stats];

    // Filtering
    if (dateRange.start) {
      result = result.filter(item => item.date >= dateRange.start);
    }
    if (dateRange.end) {
      result = result.filter(item => item.date <= dateRange.end);
    }
    if (selectedWebsite !== 'all') {
      result = result.filter(item => item.websiteId === selectedWebsite);
    }
    if (selectedFormat !== 'all') {
      result = result.filter(item => item.adFormat === selectedFormat);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = (a[sortField] as number) - (b[sortField] as number);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [stats, dateRange, selectedWebsite, selectedFormat, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getWebsiteUrl = (id: string) => {
    return websites.find(w => w.id === id)?.url || 'Unknown Site';
  };

  const resetFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedWebsite('all');
    setSelectedFormat('all');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4 opacity-20"><ChevronUp className="w-4 h-4" /></div>;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-orange-500" />;
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Earnings & Reports</h1>
          <p className="text-white/50 text-sm">Detailed performance breakdown and exportable reports.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all",
              showFilters ? "bg-orange-600 border-orange-500 text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            )}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-600/20 active:scale-95">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-6 bg-[#141414] border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <button 
            onClick={resetFilters}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Start Date</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">End Date</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Website</label>
            <select
              value={selectedWebsite}
              onChange={(e) => setSelectedWebsite(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-orange-500/50"
            >
              <option value="all" className="bg-[#1a1a1a]">All Websites</option>
              {websites.map(w => <option key={w.id} value={w.id} className="bg-[#1a1a1a]">{w.url}</option>)}
              {/* Mock items for current stats if user hasn't added them yet */}
              {websites.length === 0 && (
                <>
                  <option value="site1" className="bg-[#1a1a1a]">site1 (Demo)</option>
                  <option value="site2" className="bg-[#1a1a1a]">site2 (Demo)</option>
                </>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Ad Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-orange-500/50"
            >
              <option value="all" className="bg-[#1a1a1a]">All Formats</option>
              {adFormats.map(f => <option key={f} value={f} className="bg-[#1a1a1a]">{f}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Historical Performance</h3>
          <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-tighter">
            {filteredAndSortedStats.length} Results found
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20">
              <tr>
                <th 
                  className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest">Website & Format</th>
                <th 
                  className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('impressions')}
                >
                  <div className="flex items-center gap-1">
                    Impressions <SortIcon field="impressions" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest cursor-pointer hover:text-white transition-colors group"
                  onClick={() => handleSort('clicks')}
                >
                  <div className="flex items-center gap-1">
                    Clicks <SortIcon field="clicks" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-[10px] uppercase font-bold text-white/40 tracking-widest cursor-pointer hover:text-white transition-colors group text-right"
                  onClick={() => handleSort('earnings')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Earnings <SortIcon field="earnings" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAndSortedStats.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-white/80 group-hover:text-white">
                    {new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white/80">{getWebsiteUrl(row.websiteId)}</span>
                      <span className="text-[10px] text-white/30 uppercase tracking-tighter">{row.adFormat}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-white/50">{row.impressions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-mono text-white/50">{row.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-orange-500">${row.earnings.toFixed(2)}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 uppercase font-black">Paid</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedStats.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-white/10" />
                      <p className="text-white/30 font-medium">No results found matching your filters.</p>
                      <button 
                        onClick={resetFilters}
                        className="text-xs text-orange-500 font-bold hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-6 bg-black/10 flex items-center justify-between">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              Totals
            </p>
            <div className="flex gap-8 text-right">
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-tighter font-bold">Impressions</p>
                <p className="text-sm font-bold text-white/60">{filteredAndSortedStats.reduce((a, b) => a + b.impressions, 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/30 uppercase tracking-tighter font-bold">Earnings</p>
                <p className="text-sm font-black text-orange-500">${filteredAndSortedStats.reduce((a, b) => a + b.earnings, 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
