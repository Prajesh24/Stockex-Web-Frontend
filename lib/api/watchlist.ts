import axiosInstance from "@/lib/api/axios";
import { Stock } from "@/app/data/dummy-nepse";

export interface WatchlistItem extends Stock {
  _id: string;
}

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const res = await axiosInstance.get("/api/watchlist");
  return res.data.data || res.data;
};

export const addToWatchlistApi = async (stock: Stock): Promise<WatchlistItem> => {
  const res = await axiosInstance.post("/api/watchlist", stock);
  return res.data.data || res.data;
};

export const removeFromWatchlistApi = async (symbol: string): Promise<void> => {
  await axiosInstance.delete(`/api/watchlist/${symbol}`);
};
