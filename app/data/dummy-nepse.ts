

export interface NepseIndex {
  symbol: string;
  value: number;
  pointChange: number;
  percentChange: number;
  isPositive: boolean;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  ltp: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  pointChange: number;
  percentChange: number;
  volume: number;
  turnover: number;       // in NPR
  trades: number;
}

export interface MarketSummary {
  date: string;
  time: string;
  status: "Open" | "Closed" | "Pre-Open" | "After Hours";
  nepse: NepseIndex;
  turnoverInArba: number;
  totalTrades: number;
  totalVolume: number;
  totalTurnover: number;
  advance: number;
  decline: number;
  unchanged: number;
}

export const dummyMarketSummary: MarketSummary = {
  date: "2026-02-15",
  time: "14:45 NPT",
  status: "Open",
  nepse: {
    symbol: "NEPSE",
    value: 2187.64,
    pointChange: -18.92,
    percentChange: -0.86,
    isPositive: false,
  },
  turnoverInArba: 3.87,
  totalTrades: 48712,
  totalVolume: 12456789,
  totalTurnover: 3870000000,
  advance: 68,
  decline: 142,
  unchanged: 31,
};

export const dummySubIndices: NepseIndex[] = [
  { symbol: "Banking", value: 1423.45, pointChange: -9.12, percentChange: -0.64, isPositive: false },
  { symbol: "Development Bank", value: 3987.21, pointChange: 45.67, percentChange: 1.16, isPositive: true },
  { symbol: "Finance", value: 1678.90, pointChange: -21.34, percentChange: -1.26, isPositive: false },
  { symbol: "Hotels & Tourism", value: 5123.78, pointChange: 78.92, percentChange: 1.56, isPositive: true },
  { symbol: "HydroPower", value: 2894.56, pointChange: -34.78, percentChange: -1.19, isPositive: false },
  { symbol: "Life Insurance", value: 11245.33, pointChange: -156.45, percentChange: -1.37, isPositive: false },
  { symbol: "Microfinance", value: 4567.89, pointChange: 23.45, percentChange: 0.52, isPositive: true },
  { symbol: "Non Life Insurance", value: 9345.67, pointChange: -89.12, percentChange: -0.95, isPositive: false },
  { symbol: "Others", value: 1789.01, pointChange: 12.34, percentChange: 0.69, isPositive: true },
  { symbol: "Manufacturing & Processing", value: 5678.90, pointChange: -45.67, percentChange: -0.80, isPositive: false },
  { symbol: "Commercial Banks", value: 1389.22, pointChange: -14.56, percentChange: -1.04, isPositive: false },
  { symbol: "Hydropower", value: 2956.78, pointChange: -28.90, percentChange: -0.97, isPositive: false },
];

export const dummyStocks: Stock[] = [
  { symbol: "NABIL", name: "Nabil Bank Ltd.", sector: "Commercial Banks", ltp: 512.40, previousClose: 515.80, open: 516.00, high: 520.00, low: 510.00, pointChange: -3.40, percentChange: -0.66, volume: 245678, turnover: 125890000, trades: 1345 },
  { symbol: "GBIME", name: "Global IME Bank Ltd.", sector: "Commercial Banks", ltp: 198.70, previousClose: 196.20, open: 197.00, high: 200.50, low: 196.00, pointChange: 2.50, percentChange: 1.27, volume: 189432, turnover: 37650000, trades: 987 },
  { symbol: "UPPER", name: "Upper Tamakoshi Hydropower Ltd.", sector: "HydroPower", ltp: 245.20, previousClose: 250.60, open: 251.00, high: 252.00, low: 243.00, pointChange: -5.40, percentChange: -2.16, volume: 321456, turnover: 78900000, trades: 1654 },
  { symbol: "NTC", name: "Nepal Telecom", sector: "Others", ltp: 1452.00, previousClose: 1445.50, open: 1448.00, high: 1460.00, low: 1440.00, pointChange: 6.50, percentChange: 0.45, volume: 87654, turnover: 127300000, trades: 678 },
  { symbol: "NRIC", name: "Nepal Reinsurance Company Ltd.", sector: "Non Life Insurance", ltp: 889.50, previousClose: 899.60, open: 900.00, high: 902.00, low: 885.00, pointChange: -10.10, percentChange: -1.12, volume: 112345, turnover: 99980000, trades: 912 },
  { symbol: "HBL", name: "Himalayan Bank Ltd.", sector: "Commercial Banks", ltp: 321.80, previousClose: 311.10, open: 312.00, high: 323.00, low: 310.00, pointChange: 10.70, percentChange: 3.44, volume: 56789, turnover: 18290000, trades: 543 },
  { symbol: "API", name: "API Power Company Ltd.", sector: "HydroPower", ltp: 177.90, previousClose: 186.60, open: 187.00, high: 188.00, low: 176.00, pointChange: -8.70, percentChange: -4.66, volume: 234567, turnover: 41780000, trades: 1456 },
  { symbol: "CHCL", name: "Chilime Hydropower Company Ltd.", sector: "HydroPower", ltp: 457.20, previousClose: 447.80, open: 448.00, high: 460.00, low: 445.00, pointChange: 9.40, percentChange: 2.10, volume: 98765, turnover: 45120000, trades: 789 },
  { symbol: "PRVU", name: "Prabhu Bank Ltd.", sector: "Commercial Banks", ltp: 209.80, previousClose: 211.80, open: 212.00, high: 213.00, low: 208.00, pointChange: -2.00, percentChange: -0.94, volume: 145678, turnover: 30560000, trades: 876 },
  { symbol: "NIFRA", name: "Nepal Infrastructure Bank Ltd.", sector: "Development Bank", ltp: 286.10, previousClose: 280.90, open: 281.00, high: 288.00, low: 279.00, pointChange: 5.20, percentChange: 1.85, volume: 198765, turnover: 56890000, trades: 1123 },
  { symbol: "KBL", name: "Kumari Bank Ltd.", sector: "Commercial Banks", ltp: 178.40, previousClose: 175.60, open: 176.00, high: 180.00, low: 175.00, pointChange: 2.80, percentChange: 1.59, volume: 134567, turnover: 24010000, trades: 654 },
  { symbol: "PCBL", name: "Prime Commercial Bank Ltd.", sector: "Commercial Banks", ltp: 234.50, previousClose: 238.90, open: 239.00, high: 240.00, low: 232.00, pointChange: -4.40, percentChange: -1.84, volume: 98765, turnover: 23180000, trades: 543 },
  { symbol: "NMB", name: "NMB Bank Ltd.", sector: "Commercial Banks", ltp: 245.60, previousClose: 242.30, open: 243.00, high: 247.00, low: 241.00, pointChange: 3.30, percentChange: 1.36, volume: 176543, turnover: 43370000, trades: 987 },
  { symbol: "SHIVM", name: "Shivam Cements Ltd.", sector: "Manufacturing & Processing", ltp: 567.80, previousClose: 578.90, open: 580.00, high: 582.00, low: 565.00, pointChange: -11.10, percentChange: -1.92, volume: 87654, turnover: 49780000, trades: 654 },
  { symbol: "MPCL", name: "Multipurpose Finance Company Ltd.", sector: "Finance", ltp: 456.20, previousClose: 467.80, open: 468.00, high: 470.00, low: 453.00, pointChange: -11.60, percentChange: -2.48, volume: 54321, turnover: 24780000, trades: 432 },
  { symbol: "CZBIL", name: "Citizens Bank International Ltd.", sector: "Commercial Banks", ltp: 189.30, previousClose: 187.50, open: 188.00, high: 191.00, low: 187.00, pointChange: 1.80, percentChange: 0.96, volume: 156789, turnover: 29670000, trades: 765 },
  { symbol: "SANIMA", name: "Sanima Bank Ltd.", sector: "Commercial Banks", ltp: 267.40, previousClose: 270.10, open: 271.00, high: 272.00, low: 265.00, pointChange: -2.70, percentChange: -1.00, volume: 123456, turnover: 33020000, trades: 890 },
  { symbol: "RMDC", name: "RMDC Laghubitta Bittiya Sanstha Ltd.", sector: "Microfinance", ltp: 1234.50, previousClose: 1210.80, open: 1215.00, high: 1245.00, low: 1205.00, pointChange: 23.70, percentChange: 1.96, volume: 45678, turnover: 56430000, trades: 567 },
  { symbol: "FOWAD", name: "Forward Microfinance Laghubitta Bittiya Sanstha Ltd.", sector: "Microfinance", ltp: 3456.70, previousClose: 3500.20, open: 3510.00, high: 3520.00, low: 3430.00, pointChange: -43.50, percentChange: -1.24, volume: 23456, turnover: 81090000, trades: 345 },
  { symbol: "CBBL", name: "Chhimek Laghubitta Bittiya Sanstha Ltd.", sector: "Microfinance", ltp: 890.20, previousClose: 875.40, open: 878.00, high: 895.00, low: 872.00, pointChange: 14.80, percentChange: 1.69, volume: 67890, turnover: 60450000, trades: 789 },
  { symbol: "MEGA", name: "Mega Bank Nepal Ltd.", sector: "Commercial Banks", ltp: 210.90, previousClose: 208.70, open: 209.00, high: 212.50, low: 207.00, pointChange: 2.20, percentChange: 1.05, volume: 167890, turnover: 35420000, trades: 912 },
  { symbol: "SBL", name: "Siddhartha Bank Ltd.", sector: "Commercial Banks", ltp: 298.70, previousClose: 302.40, open: 303.00, high: 304.00, low: 296.00, pointChange: -3.70, percentChange: -1.22, volume: 134567, turnover: 40210000, trades: 876 },
  { symbol: "NBL", name: "Nepal Bank Ltd.", sector: "Commercial Banks", ltp: 345.60, previousClose: 350.20, open: 351.00, high: 352.00, low: 342.00, pointChange: -4.60, percentChange: -1.31, volume: 98765, turnover: 34120000, trades: 654 },
  { symbol: "RBBL", name: "Rastriya Beema Sansthan (RBSL)", sector: "Life Insurance", ltp: 8900.00, previousClose: 9120.50, open: 9150.00, high: 9180.00, low: 8850.00, pointChange: -220.50, percentChange: -2.42, volume: 34567, turnover: 307800000, trades: 432 },
  { symbol: "NLIC", name: "Nepal Life Insurance Company Ltd.", sector: "Life Insurance", ltp: 678.90, previousClose: 690.20, open: 692.00, high: 695.00, low: 675.00, pointChange: -11.30, percentChange: -1.64, volume: 87654, turnover: 59560000, trades: 765 },
  { symbol: "SICL", name: "Shikhar Insurance Company Ltd.", sector: "Non Life Insurance", ltp: 890.40, previousClose: 912.30, open: 915.00, high: 918.00, low: 885.00, pointChange: -21.90, percentChange: -2.40, volume: 45678, turnover: 40670000, trades: 543 },
  { symbol: "NICL", name: "Nepal Insurance Company Ltd.", sector: "Non Life Insurance", ltp: 567.80, previousClose: 556.90, open: 558.00, high: 570.00, low: 555.00, pointChange: 10.90, percentChange: 1.96, volume: 65432, turnover: 37180000, trades: 678 },
  { symbol: "PMLI", name: "Premier Insurance Ltd.", sector: "Non Life Insurance", ltp: 456.20, previousClose: 467.80, open: 468.00, high: 470.00, low: 453.00, pointChange: -11.60, percentChange: -2.48, volume: 54321, turnover: 24780000, trades: 432 },
  { symbol: "BNT", name: "Bottlers Nepal (Terai) Ltd.", sector: "Manufacturing & Processing", ltp: 8900.00, previousClose: 9120.00, open: 9150.00, high: 9200.00, low: 8850.00, pointChange: -220.00, percentChange: -2.41, volume: 12345, turnover: 109900000, trades: 210 },
  { symbol: "UNL", name: "Unilever Nepal Ltd.", sector: "Manufacturing & Processing", ltp: 24500.00, previousClose: 23800.00, open: 23900.00, high: 24650.00, low: 23750.00, pointChange: 700.00, percentChange: 2.94, volume: 5678, turnover: 139200000, trades: 189 },
  { symbol: "OHL", name: "Oriental Hotels Ltd.", sector: "Hotels & Tourism", ltp: 567.90, previousClose: 556.40, open: 558.00, high: 570.00, low: 555.00, pointChange: 11.50, percentChange: 2.07, volume: 34567, turnover: 19630000, trades: 456 },
  { symbol: "TRH", name: "Taragaon Regency Hotel Ltd.", sector: "Hotels & Tourism", ltp: 456.70, previousClose: 467.20, open: 468.00, high: 470.00, low: 453.00, pointChange: -10.50, percentChange: -2.25, volume: 23456, turnover: 10710000, trades: 321 },
  { symbol: "CORBL", name: "Citizen Investment Trust", sector: "Others", ltp: 890.20, previousClose: 875.40, open: 878.00, high: 895.00, low: 872.00, pointChange: 14.80, percentChange: 1.69, volume: 67890, turnover: 60450000, trades: 789 },
  { symbol: "NHPC", name: "National Hydro Power Company Ltd.", sector: "HydroPower", ltp: 234.50, previousClose: 245.60, open: 246.00, high: 248.00, low: 232.00, pointChange: -11.10, percentChange: -4.52, volume: 123456, turnover: 28940000, trades: 987 },
  { symbol: "PPCL", name: "Panchakanya Mai Hydropower Ltd.", sector: "HydroPower", ltp: 189.30, previousClose: 187.50, open: 188.00, high: 191.00, low: 187.00, pointChange: 1.80, percentChange: 0.96, volume: 156789, turnover: 29670000, trades: 765 },
  { symbol: "MHNL", name: "Mountain Hydro Nepal Ltd.", sector: "HydroPower", ltp: 267.40, previousClose: 270.10, open: 271.00, high: 272.00, low: 265.00, pointChange: -2.70, percentChange: -1.00, volume: 123456, turnover: 33020000, trades: 890 },
  { symbol: "AKPL", name: "Arun Valley Hydropower Development Company Ltd.", sector: "HydroPower", ltp: 198.70, previousClose: 196.20, open: 197.00, high: 200.50, low: 196.00, pointChange: 2.50, percentChange: 1.27, volume: 189432, turnover: 37650000, trades: 987 },
  { symbol: "BPCL", name: "Butwal Power Company Ltd.", sector: "HydroPower", ltp: 321.80, previousClose: 311.10, open: 312.00, high: 323.00, low: 310.00, pointChange: 10.70, percentChange: 3.44, volume: 56789, turnover: 18290000, trades: 543 },
  { symbol: "UMHL", name: "United Modi Hydropower Ltd.", sector: "HydroPower", ltp: 245.20, previousClose: 250.60, open: 251.00, high: 252.00, low: 243.00, pointChange: -5.40, percentChange: -2.16, volume: 321456, turnover: 78900000, trades: 1654 },
  { symbol: "SPDL", name: "Shivam Power Development Ltd.", sector: "HydroPower", ltp: 178.40, previousClose: 175.60, open: 176.00, high: 180.00, low: 175.00, pointChange: 2.80, percentChange: 1.59, volume: 134567, turnover: 24010000, trades: 654 },
  { symbol: "KPCL", name: "Khani Khola Hydropower Company Ltd.", sector: "HydroPower", ltp: 234.50, previousClose: 238.90, open: 239.00, high: 240.00, low: 232.00, pointChange: -4.40, percentChange: -1.84, volume: 98765, turnover: 23180000, trades: 543 },
  { symbol: "MHNL", name: "Mountain Energy Nepal Ltd.", sector: "HydroPower", ltp: 189.30, previousClose: 187.50, open: 188.00, high: 191.00, low: 187.00, pointChange: 1.80, percentChange: 0.96, volume: 156789, turnover: 29670000, trades: 765 },
  { symbol: "SJCL", name: "Sanjen Jalvidhyut Company Ltd.", sector: "HydroPower", ltp: 267.40, previousClose: 270.10, open: 271.00, high: 272.00, low: 265.00, pointChange: -2.70, percentChange: -1.00, volume: 123456, turnover: 33020000, trades: 890 },
  { symbol: "RADHI", name: "Radhi Power Company Ltd.", sector: "HydroPower", ltp: 198.70, previousClose: 196.20, open: 197.00, high: 200.50, low: 196.00, pointChange: 2.50, percentChange: 1.27, volume: 189432, turnover: 37650000, trades: 987 },
  { symbol: "NYADI", name: "Nyadi Hydropower Company Ltd.", sector: "HydroPower", ltp: 321.80, previousClose: 311.10, open: 312.00, high: 323.00, low: 310.00, pointChange: 10.70, percentChange: 3.44, volume: 56789, turnover: 18290000, trades: 543 },
  { symbol: "MHNL", name: "Manakamana Smart Hydropower Ltd.", sector: "HydroPower", ltp: 245.20, previousClose: 250.60, open: 251.00, high: 252.00, low: 243.00, pointChange: -5.40, percentChange: -2.16, volume: 321456, turnover: 78900000, trades: 1654 },
  { symbol: "SPDL", name: "Sagarmatha Power Development Ltd.", sector: "HydroPower", ltp: 178.40, previousClose: 175.60, open: 176.00, high: 180.00, low: 175.00, pointChange: 2.80, percentChange: 1.59, volume: 134567, turnover: 24010000, trades: 654 },
  { symbol: "KPCL", name: "Khumbila Power Company Ltd.", sector: "HydroPower", ltp: 234.50, previousClose: 238.90, open: 239.00, high: 240.00, low: 232.00, pointChange: -4.40, percentChange: -1.84, volume: 98765, turnover: 23180000, trades: 543 },
];

export const dummyTopGainers = [...dummyStocks]
  .filter(s => s.percentChange > 0)
  .sort((a, b) => b.percentChange - a.percentChange)
  .slice(0, 10);

export const dummyTopLosers = [...dummyStocks]
  .filter(s => s.percentChange < 0)
  .sort((a, b) => a.percentChange - b.percentChange)
  .slice(0, 10);