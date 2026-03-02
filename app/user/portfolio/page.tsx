"use client";

import { Plus, X, Search, Trash2, TrendingUp, TrendingDown, Calculator, AlertTriangle, RefreshCw, DollarSign, PieChart } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { dummyStocks, Stock } from "@/app/data/dummy-nepse";
import { 
  addStockApi, 
  getPortfolioApi, 
  removeStockApi, 
  sellStockApi,
  getPortfolioOverviewApi,
  PortfolioStock,
  PortfolioOverview,
} from "@/lib/api/portfolio";
import { calculateBuyFees } from "@/app/data/sebon_charge";

type TransactionType = "ipo" | "fpo" | "secondary" | "right" | "bonus";

interface SymbolSummary {
  symbol: string;
  name: string;
  totalUnits: number;
  soldUnits: number;
  remainingUnits: number;
  wacc: number;
  avgBuyPrice: number;
  totalCost: number;
  currentLTP: number;
  storedLTP: number;
  currentValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  isProfit: boolean;
  totalFees: number;
  stockIds: string[];
  individualStocks: PortfolioStock[];
}

const SECTOR_COLORS: Record<string, string> = {
  "Commercial Banks": "#3B82F6",
  "Development Bank": "#8B5CF6",
  "Finance": "#F59E0B",
  "Hotels & Tourism": "#EC4899",
  "HydroPower": "#10B981",
  "Life Insurance": "#EF4444",
  "Microfinance": "#06B6D4",
  "Non Life Insurance": "#F97316",
  "Others": "#6B7280",
  "Manufacturing & Processing": "#84CC16",
  "default": "#6366F1"
};

export default function PortfolioPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSellForm, setShowSellForm] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [activeSector, setActiveSector] = useState<string | null>(null);

  const [sellUnits, setSellUnits] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellDate, setSellDate] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const [transactionType, setTransactionType] = useState<TransactionType>("secondary");
  const [units, setUnits] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [date, setDate] = useState("");

  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const [stocks, stats] = await Promise.all([
        getPortfolioApi(),
        getPortfolioOverviewApi()
      ]);
      setPortfolio(stocks);
      setOverview(stats);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load portfolio");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLTP = (symbol: string): number => {
    return dummyStocks.find(s => s.symbol === symbol)?.ltp ?? 0;
  };

  const symbolSummaries: SymbolSummary[] = useMemo(() => {
    const map = new Map<string, SymbolSummary>();

    portfolio.forEach(stock => {
      const remaining = stock.units - (stock.soldUnits || 0);
      if (remaining <= 0 && (stock.soldUnits || 0) === 0) return;

      const currentLTP = getCurrentLTP(stock.symbol);

      if (!map.has(stock.symbol)) {
        map.set(stock.symbol, {
          symbol: stock.symbol,
          name: stock.name,
          totalUnits: 0,
          soldUnits: 0,
          remainingUnits: 0,
          wacc: 0,
          avgBuyPrice: 0,
          totalCost: 0,
          currentLTP,
          storedLTP: stock.ltp,
          currentValue: 0,
          unrealizedPL: 0,
          unrealizedPLPercent: 0,
          isProfit: false,
          totalFees: 0,
          stockIds: [],
          individualStocks: []
        });
      }

      const summary = map.get(stock.symbol)!;
      const stockWACC = (stock as any).wacc || stock.buyPrice;
      const stockCost = remaining * stockWACC;
      const stockValue = remaining * currentLTP;
      const fees =
        ((stock as any).fees?.brokerCommission || 0) +
        ((stock as any).fees?.nepseCommission || 0) +
        ((stock as any).fees?.sebonFee || 0) +
        ((stock as any).fees?.dpCharge || 0);

      summary.totalUnits += stock.units;
      summary.soldUnits += stock.soldUnits || 0;
      summary.remainingUnits += remaining;
      summary.totalCost += stockCost;
      summary.currentValue += stockValue;
      summary.totalFees += fees;
      summary.stockIds.push(stock._id!);
      summary.individualStocks.push(stock);
    });

    return Array.from(map.values()).map(summary => {
      const wacc = summary.remainingUnits > 0 ? summary.totalCost / summary.remainingUnits : 0;
      const avgBuyPrice = summary.remainingUnits > 0 ? wacc - (summary.totalFees / summary.totalUnits) : 0;
      const unrealizedPL = summary.currentValue - summary.totalCost;
      const unrealizedPLPercent = summary.totalCost > 0 ? (unrealizedPL / summary.totalCost) * 100 : 0;

      return {
        ...summary,
        wacc,
        avgBuyPrice,
        unrealizedPL,
        unrealizedPLPercent,
        isProfit: unrealizedPL >= 0
      };
    });
  }, [portfolio]);

  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, { value: number; percentage: number; color: string }>();

    symbolSummaries.forEach(stock => {
      const sector =
        stock.individualStocks[0]?.sector ||
        dummyStocks.find(s => s.symbol === stock.symbol)?.sector ||
        "Others";

      const currentValue = stock.currentValue;

      if (sectorMap.has(sector)) {
        sectorMap.get(sector)!.value += currentValue;
      } else {
        sectorMap.set(sector, {
          value: currentValue,
          percentage: 0,
          color: SECTOR_COLORS[sector] || SECTOR_COLORS.default
        });
      }
    });

    const totalValue = Array.from(sectorMap.values()).reduce((sum, s) => sum + s.value, 0);

    const data = Array.from(sectorMap.entries()).map(([name, data]) => ({
      name,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      color: data.color
    })).sort((a, b) => b.value - a.value);

    return { data, totalValue };
  }, [symbolSummaries]);

  const createPieChart = (data: typeof sectorData.data) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    let currentAngle = -90;

    return data.map(sector => {
      const angle = (sector.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      currentAngle += angle;

      return { ...sector, path: pathData };
    });
  };

  const pieChartData = createPieChart(sectorData.data);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = dummyStocks.filter(
      s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 6));
  }, [query]);

  const handleAddStock = async () => {
    if (!selectedStock || !units || !date) return;

    try {
      const added = await addStockApi({
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        sector: selectedStock.sector,
        transactionType,
        units: Number(units),
        buyPrice: Number(buyPrice) || 0,
        buyDate: date,
      });

      setPortfolio(prev => [added, ...prev]);
      setOverview(await getPortfolioOverviewApi());

      resetForm();
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add stock");
    }
  };

  const handleSellClick = (stockId: string) => {
    const stock = portfolio.find(s => s._id === stockId);
    if (stock) {
      setSellPrice(getCurrentLTP(stock.symbol).toString());
      setSellDate(new Date().toISOString().split('T')[0]);
      setShowSellForm(stockId);
    }
  };

  const handleSellStock = async () => {
    if (!showSellForm || !sellUnits || !sellPrice || !sellDate) return;

    setSellLoading(true);
    try {
      const result = await sellStockApi(showSellForm, {
        units: Number(sellUnits),
        sellPrice: Number(sellPrice),
        sellDate
      });

      alert(
        `Sold ${result.soldUnits} units!\nRealized P/L: ${result.realizedPL >= 0 ? '+' : ''}${result.realizedPL.toFixed(2)} (${result.realizedPLPercent.toFixed(2)}%)`
      );

      const [stocks, stats] = await Promise.all([getPortfolioApi(), getPortfolioOverviewApi()]);
      setPortfolio(stocks);
      setOverview(stats);

      setShowSellForm(null);
      setSellUnits("");
      setSellPrice("");
      setSellDate("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to sell stock");
    } finally {
      setSellLoading(false);
    }
  };

  const handleDeleteClick = (symbol: string) => setShowDeleteConfirm(symbol);

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;
    const symbol = showDeleteConfirm;
    const summary = symbolSummaries.find(s => s.symbol === symbol);

    if (!summary || !summary.stockIds.length) {
      setShowDeleteConfirm(null);
      return;
    }

    setDeleteLoading(true);
    try {
      await Promise.all(summary.stockIds.map(id => removeStockApi(id)));
      const [stocks, stats] = await Promise.all([getPortfolioApi(), getPortfolioOverviewApi()]);
      setPortfolio(stocks);
      setOverview(stats);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to remove stock");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setSelectedStock(null);
    setQuery("");
    setResults([]);
    setTransactionType("secondary");
    setUnits("");
    setBuyPrice("");
    setDate("");
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 2
    }).format(value);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading portfolio...
      </div>
    );
  }

  const totalInvestment = symbolSummaries.reduce((sum, s) => sum + s.totalCost, 0);
  const currentValue = symbolSummaries.reduce((sum, s) => sum + s.currentValue, 0);
  const totalFees = symbolSummaries.reduce((sum, s) => sum + s.totalFees, 0);
  const profitLoss = currentValue - totalInvestment;

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Portfolio</h1>
            <p className="text-gray-400 mt-1">
              {symbolSummaries.length} stocks • {overview?.totalUnits.toLocaleString() ?? 0} units
              {overview?.totalSoldUnits ? ` • ${overview.totalSoldUnits} sold` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadPortfolio}
              className="p-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Plus size={20} /> Add Stock
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Investment</p>
            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalInvestment)}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Current Value</p>
            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(currentValue)}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Unrealized P/L</p>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-2xl font-bold ${profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(profitLoss)}
              </p>
              {profitLoss >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Fees</p>
            <p className="text-2xl font-bold text-yellow-500 mt-1">{formatCurrency(totalFees)}</p>
          </div>
        </div>

        {sectorData.data.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
              <PieChart className="text-purple-500" size={20} /> Sector Allocation
            </h2>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                  {pieChartData.map(sector => (
                    <path
                      key={sector.name}
                      d={sector.path}
                      fill={sector.color}
                      stroke="#1f2937"
                      strokeWidth="2"
                      className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      onMouseEnter={() => setActiveSector(sector.name)}
                      onMouseLeave={() => setActiveSector(null)}
                    />
                  ))}
                  <circle cx="100" cy="100" r="50" fill="#111827" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(sectorData.totalValue)}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sectorData.data.map(sector => (
                    <div
                      key={sector.name}
                      className={`p-3 rounded-lg transition-all ${activeSector === sector.name ? "bg-white/10" : "bg-gray-800/50"}`}
                      onMouseEnter={() => setActiveSector(sector.name)}
                      onMouseLeave={() => setActiveSector(null)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sector.color }} />
                        <span className="text-sm text-gray-300">{sector.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{formatCurrency(sector.value)}</p>
                        <p className="text-xs text-gray-500">{sector.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellForm && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-green-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="text-green-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Sell Stock</h3>
              </div>

              {portfolio.find(s => s._id === showSellForm) && (stock => (
                <>
                  <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Symbol</span>
                      <span className="text-white font-semibold">{stock.symbol}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Available Units</span>
                      <span className="text-green-400 font-semibold">
                        {stock.units - (stock.soldUnits || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">WACC</span>
                      <span className="text-blue-400 font-semibold">
                        {formatCurrency((stock as any).wacc || stock.buyPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Units to Sell</label>
                      <input
                        type="number"
                        min="1"
                        max={stock.units - (stock.soldUnits || 0)}
                        value={sellUnits}
                        onChange={e => setSellUnits(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white"
                        placeholder="Enter units"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sell Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={sellPrice}
                        onChange={e => setSellPrice(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white"
                        placeholder={getCurrentLTP(stock.symbol).toString()}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sell Date</label>
                      <input
                        type="date"
                        value={sellDate}
                        onChange={e => setSellDate(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {sellUnits && sellPrice && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      Number(sellPrice) >= ((stock as any).wacc || stock.buyPrice)
                        ? "bg-green-500/10 border border-green-500/30"
                        : "bg-red-500/10 border border-red-500/30"
                    }`}>
                      <p className="text-sm text-gray-400 mb-1">Estimated P/L</p>
                      <p className={`text-2xl font-bold ${
                        Number(sellPrice) >= ((stock as any).wacc || stock.buyPrice)
                          ? "text-green-400"
                          : "text-red-400"
                      }`}>
                        {(() => {
                          const wacc = (stock as any).wacc || stock.buyPrice;
                          const pl = (Number(sellPrice) - wacc) * Number(sellUnits);
                          return `${pl >= 0 ? '+' : ''}${formatCurrency(pl)}`;
                        })()}
                      </p>
                    </div>
                  )}
                </>
              ))(portfolio.find(s => s._id === showSellForm)! )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSellForm(null);
                    setSellUnits("");
                    setSellPrice("");
                    setSellDate("");
                  }}
                  className="flex-1 border border-gray-600 text-gray-300 p-3 rounded-lg hover:bg-gray-800"
                  disabled={sellLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellStock}
                  disabled={sellLoading || !sellUnits || !sellPrice || !sellDate}
                  className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  {sellLoading ? "Processing..." : <>Confirm Sell <DollarSign size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-red-500/50">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Remove {showDeleteConfirm}?</h3>
                  <p className="text-gray-400 text-sm">This cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 border border-gray-600 text-gray-300 p-3 rounded-lg hover:bg-gray-800"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  {deleteLoading ? "Deleting..." : <>Remove <Trash2 size={18} /></>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Holdings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calculator className="text-blue-500" size={20} /> Holdings
          </h2>

          {symbolSummaries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-900/30 rounded-xl border border-gray-800 border-dashed">
              <p className="text-xl">Your portfolio is empty</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {symbolSummaries.map(stock => (
                <div
                  key={stock.symbol}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">{stock.symbol}</h3>
                        {stock.remainingUnits > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                              stock.isProfit ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {stock.isProfit ? "PROFIT" : "LOSS"}
                          </span>
                        )}
                        {stock.soldUnits > 0 && (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-yellow-500/20 text-yellow-400">
                            PARTIAL SELL
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{stock.name}</p>
                    </div>

                    <div className="flex gap-2">
                      {stock.remainingUnits > 0 && (
                        <button
                          onClick={() => {
                            const avail = stock.individualStocks.find(s => (s.units - (s.soldUnits || 0)) > 0);
                            if (avail) handleSellClick(avail._id!);
                          }}
                          className="p-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500 hover:text-white"
                        >
                          <DollarSign size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteClick(stock.symbol)}
                        className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-gray-800/50 p-2 rounded-lg">
                      <p className="text-gray-500 text-xs">Total</p>
                      <p className="text-white font-semibold">{stock.totalUnits}</p>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <p className="text-green-400 text-xs">Remaining</p>
                      <p className="text-green-400 font-semibold">{stock.remainingUnits}</p>
                    </div>
                    <div className="bg-yellow-500/10 p-2 rounded-lg">
                      <p className="text-yellow-400 text-xs">Sold</p>
                      <p className="text-yellow-400 font-semibold">{stock.soldUnits}</p>
                    </div>
                  </div>

                  {stock.remainingUnits > 0 && (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className={`p-3 rounded-lg border ${stock.isProfit ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                          <p className="text-gray-500 text-xs mb-1">LTP</p>
                          <p className={`text-xl font-bold ${stock.isProfit ? "text-green-400" : "text-red-400"}`}>
                            {formatCurrency(stock.currentLTP)}
                          </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                          <p className="text-gray-500 text-xs mb-1">WACC</p>
                          <p className="text-xl font-bold text-blue-400">{formatCurrency(stock.wacc)}</p>
                        </div>
                      </div>

                      <div className={`p-4 rounded-lg mb-4 ${stock.isProfit ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${stock.isProfit ? "text-green-400" : "text-red-400"}`}>
                            Unrealized P/L
                          </span>
                          <span className={`text-lg font-bold ${stock.isProfit ? "text-green-400" : "text-red-400"}`}>
                            {stock.isProfit ? "+" : ""}{formatCurrency(stock.unrealizedPL)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Stock Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-xl w-full text-black">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-xl">Add Stock</h2>
                <button onClick={() => { resetForm(); setShowForm(false); }}>
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 relative">
                <label className="block text-sm font-medium mb-2">Search Stock</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    className="w-full border p-2 pl-10 rounded-lg"
                    placeholder="Search symbol or name..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>

                {results.length > 0 && (
                  <div className="absolute w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-auto z-10">
                    {results.map(s => (
                      <div
                        key={s.symbol}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                        onClick={() => {
                          setSelectedStock(s);
                          setQuery(`${s.symbol} - ${s.name}`);
                          setResults([]);
                        }}
                      >
                        <div className="font-semibold">{s.symbol}</div>
                        <div className="text-sm text-gray-600">{s.name}</div>
                        <div className="text-xs text-gray-500">LTP: {formatCurrency(s.ltp)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Transaction Type</label>
                  <select
                    value={transactionType}
                    onChange={e => setTransactionType(e.target.value as TransactionType)}
                    className="w-full border p-2 rounded-lg"
                  >
                    <option value="ipo">IPO</option>
                    <option value="fpo">FPO</option>
                    <option value="secondary">Secondary Market</option>
                    <option value="right">Right Share</option>
                    <option value="bonus">Bonus Share</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Buy Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Units</label>
                  <input
                    type="number"
                    min="1"
                    value={units}
                    onChange={e => setUnits(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Buy Price (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={buyPrice}
                    onChange={e => setBuyPrice(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {Number(units) > 0 && Number(buyPrice) > 0 && selectedStock && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6 text-sm">
                  <p className="font-semibold text-blue-800 mb-3">Estimated Cost Breakdown</p>

                  {(() => {
                    const fees = calculateBuyFees(Number(units), Number(buyPrice));

                    return (
                      <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                          <span>Transaction Value</span>
                          <span className="font-medium">{formatCurrency(fees.transactionValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Broker Commission ({fees.commissionRatePercent.toFixed(2)}%)</span>
                          <span>{formatCurrency(fees.brokerCommission)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SEBON Fee (0.015%)</span>
                          <span>{formatCurrency(fees.sebonFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>DP Charge</span>
                          <span>{formatCurrency(fees.dpCharge)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-blue-200 font-semibold text-blue-900">
                          <span>Total Cost</span>
                          <span className="text-lg">{formatCurrency(fees.totalCost)}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <p className="text-xs text-gray-600 mt-4">
                    Note: Based on current SEBON broker slabs & standard DP charge (NPR 25).
                    Actual amount may vary slightly by broker.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="flex-1 border border-gray-300 p-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  disabled={!selectedStock || !units || !date || Number(units) <= 0 || Number(buyPrice) <= 0}
                  className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Add to Portfolio
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}