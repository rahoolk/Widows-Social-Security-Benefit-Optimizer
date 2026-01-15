
export enum FilingStatus {
  SINGLE = 'Single',
  MARRIED_JOINT = 'Married Filing Jointly',
  HEAD_OF_HOUSEHOLD = 'Head of Household'
}

export interface UserInputs {
  deceasedPIA: number;
  userPIA: number;
  currentAge: number;
  targetClaimingAge: number;
  lifeExpectancy: number;
  annualEarnings: number;
  nontaxableInterest: number;
  filingStatus: FilingStatus;
}

export interface BenefitYearResult {
  age: number;
  year: number;
  grossBenefit: number;
  workPenalty: number;
  taxablePortion: number;
  netBenefit: number;
  cumulativeNet: number;
}

export interface SimulationResult {
  monthlyBenefit: number;
  totalLifetimeValue: number;
  yearlyData: BenefitYearResult[];
  taxExposure: number; // 0 to 100 percentage
  earningsPenaltyTotal: number;
  breakEvenAge: number | null;
}
