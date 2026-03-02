// app/market/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Zap,
  DollarSign,
  Layers,
  Percent
} from "lucide-react";
import {
  dummyMarketSummary,
  dummyStocks,
  dummyTopGainers,
  dummyTopLosers,
  dummySubIndices,
} from "@/app/data/dummy-nepse";

// Types
type Stock = typeof dummyStocks[0];
type ViewMode = "overview" | "stocks" | "sectors" | "heatmap";

export default function MarketPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { nepse } = dummyMarketSummary;
  const isPositive = nepse.isPositive;

  // Filter stocks
  const filteredStocks = useMemo(() => {
    return dummyStocks.filter((stock) => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    });
  }, [searchQuery, selectedSector]);

  // Market stats
  const marketStats = useMemo(() => {
    const advanced = dummyStocks.filter((s) => s.percentChange > 0).length;
    const declined = dummyStocks.filter((s) => s.percentChange < 0).length;
    const unchanged = dummyStocks.filter((s) => s.percentChange === 0).length;
    const totalMarketCap = dummyStocks.reduce((sum, s) => sum + (s.ltp * s.volume), 0);
    
    return { advanced, declined, unchanged, totalMarketCap };
  }, []);

  // Top performers
  const topDemand = useMemo(() => 
    [...dummyStocks].sort((a, b) => b.turnover - a.turnover).slice(0, 5),
  []);
  
  const topVolume = useMemo(() => 
    [...dummyStocks].sort((a, b) => b.volume - a.volume).slice(0, 5),
  []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Navigation */}
        <header className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                NEPSE Market
              </h1>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <Clock size={14} />
                Last updated: {dummyMarketSummary.time} • {dummyMarketSummary.date}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw size={20} className="text-gray-400" />
              </button>
              
              {/* <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                {(["overview", "stocks", "sectors"] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      viewMode === mode
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div> */}
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search stocks, symbols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div> */}
        </header>

        {/* Main Index Card */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
            
            <div className="relative p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${isPositive ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                      {isPositive ? (
                        <TrendingUp className="text-emerald-400" size={32} />
                      ) : (
                        <TrendingDown className="text-rose-400" size={32} />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">NEPSE Index</p>
                      <p className="text-xs text-gray-500">Main Benchmark</p>
                    </div>
                  </div>
                  <h2 className="text-6xl lg:text-7xl font-bold tracking-tight">
                    {nepse.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isPositive ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                    {isPositive ? (
                      <ArrowUpRight className="text-emerald-400" size={20} />
                    ) : (
                      <ArrowDownRight className="text-rose-400" size={20} />
                    )}
                    <span className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? "+" : ""}{nepse.pointChange.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-medium ${isPositive ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                      {isPositive ? "+" : ""}{nepse.percentChange.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">vs Previous Close</p>
                  </div>
                </div>
              </div>

              {/* Mini Chart Visualization */}
              {/* <div className="mt-8 flex items-end gap-1 h-16 opacity-50">
                {Array.from({ length: 50 }).map((_, i) => {
                  const height = Math.random() * 100;
                  const isUp = Math.random() > 0.5;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${isUp ? 'bg-emerald-500/60' : 'bg-rose-500/60'}`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div> */}
            </div>
          </div>
        </section>

        {/* Market Overview Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity size={20} />}
            label="Market Status"
            value={dummyMarketSummary.status}
            subValue="Open for trading"
            color="blue"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            label="Turnover"
            value={`${dummyMarketSummary.turnoverInArba.toFixed(2)} Arba`}
            subValue={`${(dummyMarketSummary.totalTurnover / 1000000000).toFixed(2)}B NPR`}
            color="purple"
          />
          <StatCard
            icon={<BarChart3 size={20} />}
            label="Volume"
            value={(dummyMarketSummary.totalVolume / 1000000).toFixed(2) + "M"}
            subValue="Shares traded"
            color="orange"
          />
          <StatCard
            icon={<Layers size={20} />}
            label="Active Scripts"
            value={dummyStocks.length.toString()}
            subValue={`${marketStats.advanced} ↑ ${marketStats.declined} ↓`}
            color="pink"
          />
        </section>

        {/* Market Breadth */}
        <section className="mb-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart size={18} className="text-gray-400" />
              Market Breadth
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500"
                    style={{ width: `${(marketStats.advanced / dummyStocks.length) * 100}%` }}
                  />
                  <div 
                    className="bg-gray-500"
                    style={{ width: `${(marketStats.unchanged / dummyStocks.length) * 100}%` }}
                  />
                  <div 
                    className="bg-rose-500"
                    style={{ width: `${(marketStats.declined / dummyStocks.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-emerald-400 font-medium">{marketStats.advanced} Advanced</span>
                  <span className="text-gray-400">{marketStats.unchanged} Unchanged</span>
                  <span className="text-rose-400 font-medium">{marketStats.declined} Declined</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-indices */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            Sector Indices
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {dummySubIndices.map((index) => (
              <div
                key={index.symbol}
                className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{index.symbol}</span>
                  {index.isPositive ? (
                    <TrendingUp size={16} className="text-emerald-400" />
                  ) : (
                    <TrendingDown size={16} className="text-rose-400" />
                  )}
                </div>
                <p className="text-xl font-bold text-white">{index.value.toLocaleString()}</p>
                <p className={`text-sm ${index.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {index.isPositive ? "+" : ""}{index.percentChange.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Leaderboards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Leaderboard
            title="Top Gainers"
            icon={<TrendingUp size={18} className="text-emerald-400" />}
            data={dummyTopGainers}
            color="emerald"
            showChange={true}
          />
          <Leaderboard
            title="Top Losers"
            icon={<TrendingDown size={18} className="text-rose-400" />}
            data={dummyTopLosers}
            color="rose"
            showChange={true}
          />
          <Leaderboard
            title="By Turnover"
            icon={<DollarSign size={18} className="text-blue-400" />}
            data={topDemand}
            color="blue"
            metric="turnover"
          />
          <Leaderboard
            title="By Volume"
            icon={<BarChart3 size={18} className="text-purple-400" />}
            data={topVolume}
            color="purple"
            metric="volume"
          />
        </section>

        {/* All Stocks Table */}
        {viewMode === "stocks" && (
          <section className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Stocks</h3>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white"
                >
                  <option value="all">All Sectors</option>
                  {[...new Set(dummyStocks.map(s => s.sector))].map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Symbol</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">LTP</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Change</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Volume</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Turnover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredStocks.map((stock) => (
                    <tr key={stock.symbol} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-8 rounded-full ${stock.percentChange >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <div>
                            <p className="font-semibold text-white">{stock.symbol}</p>
                            <p className="text-xs text-gray-500">{stock.sector}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{stock.name}</td>
                      <td className="p-4 text-right font-medium text-white">
                        Rs {stock.ltp.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                          stock.percentChange >= 0 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400">
                        {(stock.volume / 1000).toFixed(1)}K
                      </td>
                      <td className="p-4 text-right text-gray-400">
                        {(stock.turnover / 10000000).toFixed(2)} Cr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>Data provided for educational purposes • NEPSE Official Website</p>
          <p className="mt-2 text-xs">© 2026 StockEx. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// Component: Stat Card
function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subValue: string;
  color: "blue" | "purple" | "orange" | "pink";
}) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
    pink: "from-pink-500/20 to-pink-600/5 border-pink-500/20",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border p-5 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-white/10 text-${color === 'blue' ? 'blue' : color === 'purple' ? 'purple' : color === 'orange' ? 'orange' : 'pink'}-400`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subValue}</p>
    </div>
  );
}

// Component: Leaderboard
function Leaderboard({
  title,
  icon,
  data,
  color,
  showChange,
  metric,
}: {
  title: string;
  icon: React.ReactNode;
  data: Stock[];
  color: "emerald" | "rose" | "blue" | "purple";
  showChange?: boolean;
  metric?: "turnover" | "volume";
}) {
  const colorClasses = {
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20",
    rose: "from-rose-500/10 to-transparent border-rose-500/20",
    blue: "from-blue-500/10 to-transparent border-blue-500/20",
    purple: "from-purple-500/10 to-transparent border-purple-500/20",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <MoreHorizontal size={18} className="text-gray-400" />
        </button>
      </div>
      
      <div className="divide-y divide-white/10">
        {data.map((stock, index) => (
          <div 
            key={stock.symbol} 
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-xs font-medium text-gray-400">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {stock.symbol}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{stock.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-medium text-white">Rs {stock.ltp.toFixed(2)}</p>
              
              {showChange && (
                <p className={`text-sm flex items-center justify-end gap-1 ${
                  stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {stock.percentChange >= 0 ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {Math.abs(stock.percentChange).toFixed(2)}%
                </p>
              )}
              
              {metric === "turnover" && (
                <p className="text-xs text-gray-400">
                  {(stock.turnover / 10000000).toFixed(2)} Cr
                </p>
              )}
              
              {metric === "volume" && (
                <p className="text-xs text-gray-400">
                  {(stock.volume / 1000).toFixed(1)}K
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10">
        View All
      </button>
    </div>
  );
}