// src/lib/fees/nepse-fees.ts
// (your existing file – keep it exactly like this)

export interface BuyFeeBreakdown {
  transactionValue: number;
  brokerCommission: number;
  sebonFee: number;
  dpCharge: number;
  totalFees: number;
  totalCost: number;
  commissionRatePercent: number;
}

export function calculateBuyFees(units: number, price: number): BuyFeeBreakdown {
  const value = units * price;

  if (value <= 0) {
    return {
      transactionValue: 0,
      brokerCommission: 0,
      sebonFee: 0,
      dpCharge: 25,
      totalFees: 25,
      totalCost: 0,
      commissionRatePercent: 0,
    };
  }

  let commissionRate = 0.0036;

  if (value <= 50000) {
    commissionRate = 0.0036;
  } else if (value <= 500000) {
    commissionRate = 0.0033;
  } else if (value <= 20000000) {
    commissionRate = 0.0031;
  } else if (value <= 100000000) {
    commissionRate = 0.0027;
  } else {
    commissionRate = 0.0024;
  }

  const brokerCommission = value * commissionRate;
  const sebonFee = value * 0.00015;
  const dpCharge = 25;

  const totalFees = brokerCommission + sebonFee + dpCharge;
  const totalCost = value + totalFees;

  return {
    transactionValue: value,
    brokerCommission,
    sebonFee,
    dpCharge,
    totalFees,
    totalCost,
    commissionRatePercent: commissionRate * 100,
  };
}