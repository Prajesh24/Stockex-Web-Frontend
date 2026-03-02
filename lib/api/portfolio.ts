import axiosInstance from './axios';

export interface PortfolioStock {
  _id: string;
  userId: string;
  symbol: string;
  name: string;
  sector?: string;
  transactionType: "secondary" | "ipo" | "fpo" | "right" | "bonus";
  units: number;
  soldUnits: number;
  buyPrice: number;
  ltp: number;
  buyDate: string;
  previousClose?: number;
  open?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioOverview {
  totalUnits: number;
  totalSoldUnits: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  totalStocks: number;
}

export interface AddStockData {
  symbol: string;
  name: string;
  sector?: string;
  transactionType: "secondary" | "ipo" | "fpo" | "right" | "bonus";
  units: number;
  buyPrice: number;
  buyDate: string;
}



// DEBUG: Log the actual URL being called
const debugRequest = async (method: string, url: string, data?: any) => {
  const baseURL = (axiosInstance.defaults.baseURL || 'http://localhost:5050');
  console.log(`🔍 ${method} ${baseURL}${url}`);
  console.log('Headers:', axiosInstance.defaults.headers);
};

export const getPortfolioApi = async (): Promise<PortfolioStock[]> => {
  await debugRequest('GET', '/portfolio');
  const res = await axiosInstance.get("/portfolio");
  return res.data.data;
};

export const addStockApi = async (data: AddStockData): Promise<PortfolioStock> => {
  await debugRequest('POST', '/portfolio', data);
  const res = await axiosInstance.post("/portfolio", data);
  return res.data.data;
};

export const removeStockApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/portfolio/${id}`);
};

export const getPortfolioOverviewApi = async (): Promise<PortfolioOverview> => {
  const res = await axiosInstance.get("/portfolio/overview");
  return res.data.data;
};

// lib/api/portfolio.ts
export interface SellStockData {
  units: number;
  sellPrice: number;
  sellDate: string;
}

export interface SellResult {
  stock: PortfolioStock;
  realizedPL: number;
  realizedPLPercent: number;
  soldUnits: number;
  sellPrice: number;
  sellDate: string;
}

// Sell stock API
export const sellStockApi = async (id: string, data: SellStockData): Promise<SellResult> => {
  const res = await axiosInstance.post(`/portfolio/${id}/sell`, data);
  return res.data.data;
};

// Get sell history
export const getSellHistoryApi = async () => {
  const res = await axiosInstance.get("/portfolio/sell-history");
  return res.data.data;
};