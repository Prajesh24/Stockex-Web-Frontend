"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  MoreHorizontal,
  DollarSign,
  Layers,
  Zap
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

export default function AdminDashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { nepse } = dummyMarketSummary;
  const isPositive = nepse.isPositive;

  // Market stats
  const marketStats = useMemo(() => {
    const advanced = dummyStocks.filter((s) => s.percentChange > 0).length;
    const declined = dummyStocks.filter((s) => s.percentChange < 0).length;
    const unchanged = dummyStocks.filter((s) => s.percentChange === 0).length;
    const totalMarketCap = dummyStocks.reduce((sum, s) => sum + (s.ltp * s.volume), 0);
    return { advanced, declined, unchanged, totalMarketCap };
  }, []);

  const topDemand = useMemo(() => [...dummyStocks].sort((a, b) => b.turnover - a.turnover).slice(0,5), []);
  const topVolume = useMemo(() => [...dummyStocks].sort((a, b) => b.volume - a.volume).slice(0,5), []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white relative z-10 px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* NEPSE Index Card */}
      <section className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-blue-600/10 to-transparent border border-white/10 backdrop-blur-xl p-8">
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
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Activity size={20} />} label="Market Status" value={dummyMarketSummary.status} subValue="Open for trading" color="blue" />
        <StatCard icon={<DollarSign size={20} />} label="Turnover" value={`${dummyMarketSummary.turnoverInArba.toFixed(2)} Arba`} subValue={`${(dummyMarketSummary.totalTurnover / 1000000000).toFixed(2)}B NPR`} color="purple" />
        <StatCard icon={<BarChart3 size={20} />} label="Volume" value={(dummyMarketSummary.totalVolume / 1000000).toFixed(2) + "M"} subValue="Shares traded" color="orange" />
        <StatCard icon={<Layers size={20} />} label="Active Scripts" value={dummyStocks.length.toString()} subValue={`${marketStats.advanced} ↑ ${marketStats.declined} ↓`} color="pink" />
      </section>

      {/* Sector Indices */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" />
          Sector Indices
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {dummySubIndices.map((index) => (
            <div key={index.symbol} className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer group">
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

    </div>
  );
}

// Reuse StatCard component from MarketPage
function StatCard({ 
  icon, label, value, subValue, color 
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
        <div className={`p-2 rounded-lg text-${color}-400`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subValue}</p>
    </div>
  );
}