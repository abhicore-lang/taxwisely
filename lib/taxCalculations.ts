// ─────────────────────────────────────────────────────────────────────────────
// TaxWisely — Tax Calculation Logic
// Based on Income Tax Act 2025-26 (Budget 2025)
// ─────────────────────────────────────────────────────────────────────────────

// ─── Indian Number Formatting ────────────────────────────────────────────────
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return "₹0";
  const rounded = Math.round(amount);
  const absVal = Math.abs(rounded);
  const str = absVal.toString();
  let result = "";

  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, -3);
    let formattedRest = "";
    for (let i = rest.length - 1, count = 0; i >= 0; i--, count++) {
      if (count > 0 && count % 2 === 0) formattedRest = "," + formattedRest;
      formattedRest = rest[i] + formattedRest;
    }
    result = formattedRest + "," + last3;
  }

  return (rounded < 0 ? "-₹" : "₹") + result;
}

export function parseIndianNumber(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, "");
  return parseFloat(cleaned) || 0;
}

// ─── HRA Calculation ─────────────────────────────────────────────────────────
export interface HRAInputs {
  basicSalaryMonthly: number;
  hraReceivedMonthly: number;
  rentPaidMonthly: number;
  isMetro: boolean;
}

export interface HRAResult {
  rule1_actualHRA: number;
  rule2_percentOfBasic: number;
  rule3_rentMinusBasic: number;
  monthlyExemption: number;
  annualExemption: number;
  taxableHRAMonthly: number;
  taxableHRAannual: number;
  appliedRule: 1 | 2 | 3;
  metroPercent: number;
}

export function calculateHRA(inputs: HRAInputs): HRAResult {
  const { basicSalaryMonthly, hraReceivedMonthly, rentPaidMonthly, isMetro } = inputs;
  const metroPercent = isMetro ? 50 : 40;

  const rule1 = hraReceivedMonthly;
  const rule2 = (metroPercent / 100) * basicSalaryMonthly;
  const rule3 = Math.max(0, rentPaidMonthly - 0.1 * basicSalaryMonthly);

  const monthlyExemption = Math.min(rule1, rule2, rule3);
  const annualExemption = monthlyExemption * 12;

  const taxableHRAMonthly = hraReceivedMonthly - monthlyExemption;
  const taxableHRAannual = taxableHRAMonthly * 12;

  let appliedRule: 1 | 2 | 3 = 1;
  if (monthlyExemption === rule1) appliedRule = 1;
  else if (monthlyExemption === rule2) appliedRule = 2;
  else appliedRule = 3;

  return {
    rule1_actualHRA: rule1,
    rule2_percentOfBasic: rule2,
    rule3_rentMinusBasic: rule3,
    monthlyExemption,
    annualExemption,
    taxableHRAMonthly,
    taxableHRAannual,
    appliedRule,
    metroPercent,
  };
}

// ─── New Regime Tax Calculation (2025-26) ────────────────────────────────────
// Slabs: 0-4L=0%, 4-8L=5%, 8-12L=10%, 12-16L=15%, 16-20L=20%, 20-24L=25%, 24L+=30%
// Rebate u/s 87A: tax=0 if income ≤ 12,00,000
// Standard deduction: ₹75,000
export function calculateNewRegimeTax(grossIncome: number): {
  taxableIncome: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  rebateApplied: boolean;
} {
  const standardDeduction = 75000;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  let tax = 0;
  const slabs = [
    { from: 0, to: 400000, rate: 0 },
    { from: 400000, to: 800000, rate: 0.05 },
    { from: 800000, to: 1200000, rate: 0.10 },
    { from: 1200000, to: 1600000, rate: 0.15 },
    { from: 1600000, to: 2000000, rate: 0.20 },
    { from: 2000000, to: 2400000, rate: 0.25 },
    { from: 2400000, to: Infinity, rate: 0.30 },
  ];

  for (const slab of slabs) {
    if (taxableIncome <= slab.from) break;
    const taxableInSlab = Math.min(taxableIncome, slab.to) - slab.from;
    tax += taxableInSlab * slab.rate;
  }

  // Marginal relief for incomes just above 12L
  // Rebate u/s 87A: if taxable income ≤ 12,00,000, tax = 0
  let rebateApplied = false;
  if (taxableIncome <= 1200000) {
    tax = 0;
    rebateApplied = true;
  }

  const taxBeforeCess = tax;
  const cess = taxBeforeCess * 0.04; // 4% Health & Education Cess
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return { taxableIncome, taxBeforeCess, cess, totalTax, effectiveRate, rebateApplied };
}

// ─── Old Regime Tax Calculation (2025-26) ────────────────────────────────────
// Slabs: 0-2.5L=0%, 2.5-5L=5%, 5-10L=20%, 10L+=30%
// Rebate u/s 87A: tax=0 if income ≤ 5,00,000
// Standard deduction: ₹50,000
export interface OldRegimeInputs {
  grossIncome: number;
  hraExemption: number;
  section80C: number;        // max 1,50,000
  section80D: number;        // max 25,000
  homeLoanInterest24b: number; // max 2,00,000
  nps80CCD: number;          // max 50,000
  otherDeductions: number;
}

export function calculateOldRegimeTax(inputs: OldRegimeInputs): {
  taxableIncome: number;
  totalDeductions: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  rebateApplied: boolean;
  deductionBreakup: Record<string, number>;
} {
  const {
    grossIncome,
    hraExemption,
    section80C,
    section80D,
    homeLoanInterest24b,
    nps80CCD,
    otherDeductions,
  } = inputs;

  const standardDeduction = 50000;
  const capped80C = Math.min(section80C, 150000);
  const capped80D = Math.min(section80D, 25000);
  const cappedHomeLoan = Math.min(homeLoanInterest24b, 200000);
  const cappedNPS = Math.min(nps80CCD, 50000);

  const totalDeductions =
    standardDeduction +
    hraExemption +
    capped80C +
    capped80D +
    cappedHomeLoan +
    cappedNPS +
    otherDeductions;

  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  let tax = 0;
  const slabs = [
    { from: 0, to: 250000, rate: 0 },
    { from: 250000, to: 500000, rate: 0.05 },
    { from: 500000, to: 1000000, rate: 0.20 },
    { from: 1000000, to: Infinity, rate: 0.30 },
  ];

  for (const slab of slabs) {
    if (taxableIncome <= slab.from) break;
    const taxableInSlab = Math.min(taxableIncome, slab.to) - slab.from;
    tax += taxableInSlab * slab.rate;
  }

  // Rebate u/s 87A: if taxable income ≤ 5,00,000, tax = 0
  let rebateApplied = false;
  if (taxableIncome <= 500000) {
    tax = 0;
    rebateApplied = true;
  }

  const taxBeforeCess = tax;
  const cess = taxBeforeCess * 0.04;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  const deductionBreakup = {
    "Standard Deduction": standardDeduction,
    "HRA Exemption": hraExemption,
    "Section 80C": capped80C,
    "Section 80D": capped80D,
    "Home Loan Interest (24b)": cappedHomeLoan,
    "NPS 80CCD(1B)": cappedNPS,
    "Other Deductions": otherDeductions,
  };

  return {
    taxableIncome,
    totalDeductions,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
    rebateApplied,
    deductionBreakup,
  };
}

// ─── Salary Breakup Calculation ──────────────────────────────────────────────
export interface SalaryInputs {
  annualCTC: number;
  basicPercent: number;   // % of CTC (default 40)
  hraPercent: number;     // % of basic (default 50)
  professionalTaxMonthly: number; // default 200
  isMetro: boolean;
  useNewRegime: boolean;
  otherDeductions80C: number;
  otherDeductions80D: number;
}

export interface SalaryResult {
  // Monthly
  basicMonthly: number;
  hraMonthly: number;
  specialAllowanceMonthly: number;
  grossMonthly: number;
  pfDeductionMonthly: number;
  professionalTaxMonthly: number;
  incomeTaxMonthly: number;
  totalDeductionsMonthly: number;
  netTakeHomeMonthly: number;
  // Annual
  basicAnnual: number;
  hraAnnual: number;
  specialAllowanceAnnual: number;
  grossAnnual: number;
  pfDeductionAnnual: number;
  professionalTaxAnnual: number;
  incomeTaxAnnual: number;
  totalDeductionsAnnual: number;
  netTakeHomeAnnual: number;
  // Employer contribution
  employerPFAnnual: number;
  employerPFMonthly: number;
}

export function calculateSalaryBreakup(inputs: SalaryInputs): SalaryResult {
  const {
    annualCTC,
    basicPercent,
    hraPercent,
    professionalTaxMonthly,
    isMetro,
    useNewRegime,
    otherDeductions80C,
    otherDeductions80D,
  } = inputs;

  const basicAnnual = (basicPercent / 100) * annualCTC;
  const basicMonthly = basicAnnual / 12;

  const hraAnnual = (hraPercent / 100) * basicAnnual;
  const hraMonthly = hraAnnual / 12;

  // PF = 12% of basic (employee) + 12% employer
  const employeePFAnnual = Math.min(basicAnnual * 0.12, 21600); // PF wage ceiling ₹15,000/month → annual ₹1,80,000 basic cap → 21600
  const employeePFMonthly = employeePFAnnual / 12;
  const employerPFAnnual = employeePFAnnual;
  const employerPFMonthly = employerPFAnnual / 12;

  // Gross salary = CTC - employer PF (since employer PF is included in CTC)
  const grossAnnual = annualCTC - employerPFAnnual;
  const grossMonthly = grossAnnual / 12;

  const specialAllowanceAnnual = grossAnnual - basicAnnual - hraAnnual;
  const specialAllowanceMonthly = specialAllowanceAnnual / 12;

  const professionalTaxAnnual = professionalTaxMonthly * 12;

  // HRA exemption for tax calculation
  const hraExemptionResult = calculateHRA({
    basicSalaryMonthly: basicMonthly,
    hraReceivedMonthly: hraMonthly,
    rentPaidMonthly: hraMonthly, // assume rent = HRA for basic calc
    isMetro,
  });

  let incomeTaxAnnual = 0;
  if (useNewRegime) {
    const { totalTax } = calculateNewRegimeTax(grossAnnual);
    incomeTaxAnnual = totalTax;
  } else {
    const { totalTax } = calculateOldRegimeTax({
      grossIncome: grossAnnual,
      hraExemption: hraExemptionResult.annualExemption,
      section80C: otherDeductions80C,
      section80D: otherDeductions80D,
      homeLoanInterest24b: 0,
      nps80CCD: 0,
      otherDeductions: 0,
    });
    incomeTaxAnnual = totalTax;
  }

  const incomeTaxMonthly = incomeTaxAnnual / 12;

  const totalDeductionsAnnual = employeePFAnnual + professionalTaxAnnual + incomeTaxAnnual;
  const totalDeductionsMonthly = totalDeductionsAnnual / 12;

  const netTakeHomeAnnual = grossAnnual - totalDeductionsAnnual;
  const netTakeHomeMonthly = netTakeHomeAnnual / 12;

  return {
    basicMonthly,
    hraMonthly,
    specialAllowanceMonthly,
    grossMonthly,
    pfDeductionMonthly: employeePFMonthly,
    professionalTaxMonthly,
    incomeTaxMonthly,
    totalDeductionsMonthly,
    netTakeHomeMonthly,
    basicAnnual,
    hraAnnual,
    specialAllowanceAnnual,
    grossAnnual,
    pfDeductionAnnual: employeePFAnnual,
    professionalTaxAnnual,
    incomeTaxAnnual,
    totalDeductionsAnnual,
    netTakeHomeAnnual,
    employerPFAnnual,
    employerPFMonthly,
  };
}
