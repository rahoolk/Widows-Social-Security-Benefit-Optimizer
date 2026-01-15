
import { UserInputs, SimulationResult, BenefitYearResult } from '../types';
import { SSA_2026, TAX_THRESHOLDS } from '../constants';

export const calculateBenefitAtAge = (pia: number, claimAge: number, fra: number): number => {
  if (claimAge >= fra) return pia;
  // Approximation for survivor benefits: linear reduction between 60 (71.5% of PIA) and FRA (100% of PIA)
  const monthsBeforeFra = (fra - claimAge) * 12;
  const totalMonthsRange = (fra - 60) * 12;
  const reductionFactor = (monthsBeforeFra / totalMonthsRange) * SSA_2026.SURVIVOR_EARLY_REDUCTION_MAX;
  return pia * (1 - reductionFactor);
};

export const calculateEarningsPenalty = (annualEarnings: number, age: number, fra: number): number => {
  if (age >= fra) return 0;
  const excess = Math.max(0, annualEarnings - SSA_2026.EARNINGS_LIMIT);
  return excess / 2; // $1 withheld for every $2 over limit
};

export const calculateTaxableSS = (ssBenefit: number, otherIncome: number, nontaxableInterest: number, filingStatus: string): number => {
  const combinedIncome = otherIncome + nontaxableInterest + (0.5 * ssBenefit);
  const thresholds = TAX_THRESHOLDS[filingStatus as keyof typeof TAX_THRESHOLDS] || TAX_THRESHOLDS['Single'];

  if (combinedIncome <= thresholds.low) return 0;
  
  if (combinedIncome <= thresholds.high) {
    // 50% taxable rule
    return Math.min(0.5 * ssBenefit, 0.5 * (combinedIncome - thresholds.low));
  } else {
    // 85% taxable rule
    const firstTier = 0.5 * (thresholds.high - thresholds.low);
    const secondTier = 0.85 * (combinedIncome - thresholds.high);
    return Math.min(0.85 * ssBenefit, firstTier + secondTier);
  }
};

export const runSimulation = (inputs: UserInputs): SimulationResult => {
  const yearlyData: BenefitYearResult[] = [];
  let cumulativeNet = 0;
  let earningsPenaltyTotal = 0;
  
  const monthlyGross = calculateBenefitAtAge(inputs.deceasedPIA, inputs.targetClaimingAge, SSA_2026.FRA);
  const annualGross = monthlyGross * 12;

  for (let age = inputs.currentAge; age <= inputs.lifeExpectancy; age++) {
    const isClaiming = age >= inputs.targetClaimingAge;
    const yearGross = isClaiming ? annualGross : 0;
    const penalty = isClaiming ? calculateEarningsPenalty(inputs.annualEarnings, age, SSA_2026.FRA) : 0;
    const netAfterPenalty = Math.max(0, yearGross - penalty);
    
    // Simple tax simulation (assuming 20% effective tax on taxable portion for demo)
    const taxablePortion = calculateTaxableSS(netAfterPenalty, inputs.annualEarnings, inputs.nontaxableInterest, inputs.filingStatus);
    const estimatedTax = taxablePortion * 0.20; 
    const finalNet = netAfterPenalty - estimatedTax;

    cumulativeNet += finalNet;
    earningsPenaltyTotal += penalty;

    yearlyData.push({
      age,
      year: new Date().getFullYear() + (age - inputs.currentAge),
      grossBenefit: yearGross,
      workPenalty: penalty,
      taxablePortion,
      netBenefit: finalNet,
      cumulativeNet
    });
  }

  // Calculate tax exposure heuristic for thermometer
  const combinedIncomeBase = inputs.annualEarnings + inputs.nontaxableInterest + (0.5 * annualGross);
  const thresholds = TAX_THRESHOLDS[inputs.filingStatus] || TAX_THRESHOLDS['Single'];
  const taxExposure = Math.min(100, Math.max(0, ((combinedIncomeBase - (thresholds.low - 5000)) / (thresholds.high + 10000 - (thresholds.low - 5000))) * 100));

  return {
    monthlyBenefit: monthlyGross,
    totalLifetimeValue: cumulativeNet,
    yearlyData,
    taxExposure,
    earningsPenaltyTotal,
    breakEvenAge: null // Calculated by comparing paths elsewhere if needed
  };
};
