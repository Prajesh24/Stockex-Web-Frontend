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

export const getPortfolioApi = async (): Promise<PortfolioStock[]> => {
  const res = await axiosInstance.get("/api/portfolio");  // fixed: was "api/portfolio" (missing slash)
  return res.data.data;
};

export const addStockApi = async (data: AddStockData): Promise<PortfolioStock> => {
  const res = await axiosInstance.post("/api/portfolio", data);
  return res.data.data;
};

export const removeStockApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/portfolio/${id}`);
};

export const getPortfolioOverviewApi = async (): Promise<PortfolioOverview> => {
  const res = await axiosInstance.get("/api/portfolio/overview");
  return res.data.data;
};

export const sellStockApi = async (id: string, data: SellStockData): Promise<SellResult> => {
  const res = await axiosInstance.post(`/api/portfolio/${id}/sell`, data);  // fixed: was /portfolio/
  return res.data.data;
};

export const getSellHistoryApi = async () => {
  const res = await axiosInstance.get("/api/portfolio/sell-history");  // fixed: was /portfolio/
  return res.data.data;
};