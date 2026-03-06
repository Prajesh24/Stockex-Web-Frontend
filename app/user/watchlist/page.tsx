"use client";

import { Plus, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { dummyStocks, Stock } from "@/app/data/dummy-nepse"; 
import { useAuth } from "@/context/AuthContext";
import { getWatchlist, addToWatchlistApi, removeFromWatchlistApi } from "@/lib/api/watchlist";

interface WatchlistItem extends Stock {
  _id: string; // MongoDB _id
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    if (!user) return;

    getWatchlist()
      .then((data: WatchlistItem[]) => {
        console.log("Fetched watchlist:", data);
        setWatchlist(data);
      })
      .catch((err) => {
        console.error(err);
        setWatchlist([]);
      });
  }, [user]);

  // Search dummy stocks
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = dummyStocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 6));
  }, [query]);

  const addToWatchlist = async (stock: Stock) => {
    try {
      const added = await addToWatchlistApi(stock);
      setWatchlist((prev) => [...prev, added]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this stock from your watchlist?"
    );
    if (!confirmed) return;

    try {
      await removeFromWatchlistApi(symbol);
      setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
    } catch (err) {
      console.error(err);
    }
  };

  const getBgColor = (pointChange: number) => {
    if (pointChange > 0) return "bg-green-300 border-green-200";
    if (pointChange < 0) return "bg-red-300 border-red-200";
    return "bg-blue-50 border-blue-200";
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">
            Search NEPSE stocks and add to watchlist
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 max-w-xl">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search stock symbol or name (e.g. NABIL, NTC)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-black outline-none"
            />
          </div>

          {results.length > 0 && (
            <div className="mt-3 divide-y">
              {results.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium text-black">{stock.symbol}</p>
                    <p className="text-xs text-gray-500">{stock.name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-medium ${
                        stock.percentChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stock.ltp} ({stock.percentChange}%)
                    </span>
                    <button
                      onClick={() => addToWatchlist(stock)}
                      className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {watchlist.map((stock, index) => (
            <div
              key={stock._id || stock.symbol || index}
              className={`rounded-xl p-4 shadow-sm space-y-2 border transition hover:scale-[1.01] ${getBgColor(
                stock.pointChange
              )}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-black">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs text-gray-500">{stock.name}</p>
                </div>
                <button
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <span className="font-medium">LTP:</span> {stock.ltp}
                </p>
                <p>
                  <span className="font-medium">High:</span> {stock.high}
                </p>
                <p>
                  <span className="font-medium">Low:</span> {stock.low}
                </p>
                <p>
                  <span className="font-medium">Ch:</span>{" "}
                  <span
                    className={
                      stock.pointChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stock.pointChange}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Ch%:</span>{" "}
                  <span
                    className={
                      stock.percentChange >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stock.percentChange}%
                  </span>
                </p>
                <p>
                  <span className="font-medium">Prev Close:</span>{" "}
                  {stock.previousClose}
                </p>
                <p>
                  <span className="font-medium">Prev Open:</span>{" "}
                  {stock.open}
                </p>
              </div>
            </div>
          ))}

          {watchlist.length === 0 && (
            <p className="text-gray-400 text-sm">
              No stocks in watchlist yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
