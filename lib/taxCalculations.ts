// ─────────────────────────────────────────────────────────────────────────────
// TaxWisely — Tax Calculation Logic
// Based on Income Tax Act 2026-27 (Budget 2026)
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
  age: number;                    // default 30 if not provided; gates senior limits
  hraExemption: number;
  ltaExemption: number;           // Section 10(5) — no cap
  section80C: number;             // max 1,50,000
  section80D: number;             // max 25,000 (<60) or 50,000 (60+)
  homeLoanInterest24b: number;    // max 2,00,000
  section80EEA: number;           // max 1,50,000 — affordable housing extra
  nps80CCD: number;               // max 50,000
  section80E: number;             // education loan interest — no cap
  section80TTA: number;           // savings interest <60 — max 50,000 (Budget 2026)
  section80TTB: number;           // savings/FD interest 60+ — max 1,00,000 (Budget 2026)
  section80GG_monthlyRent: number;// rent without HRA — 3-way min calculated inside
  section80G: number;             // donations — 50% applied conservatively
  section80DD: number;            // disabled dependent — max 1,25,000
  section80DDB: number;           // specified disease — max 40,000 (<60) or 1,00,000 (60+)
  section80U: number;             // self disability — max 1,25,000
  otherDeductions: number;
}

// Helper: 80GG three-way minimum
function calc80GG(monthlyRent: number, grossIncome: number): number {
  if (monthlyRent <= 0) return 0;
  const annualRent = monthlyRent * 12;
  const cap1 = 5000 * 12;                                    // ₹60,000/year
  const cap2 = 0.25 * grossIncome;                           // 25% of gross
  const cap3 = Math.max(0, annualRent - 0.10 * grossIncome); // rent - 10% income
  return Math.min(cap1, cap2, cap3);
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
    age = 30,
    hraExemption,
    ltaExemption,
    section80C,
    section80D,
    homeLoanInterest24b,
    section80EEA,
    nps80CCD,
    section80E,
    section80TTA,
    section80TTB,
    section80GG_monthlyRent,
    section80G,
    section80DD,
    section80DDB,
    section80U,
    otherDeductions,
  } = inputs;

  const isSenior = age >= 60;

  const standardDeduction = 50000;
  const capped80C = Math.min(section80C, 150000);
  const max80D = isSenior ? 50000 : 25000;
  const capped80D = Math.min(section80D, max80D);
  const cappedHomeLoan = Math.min(homeLoanInterest24b, 200000);
  const capped80EEA = Math.min(section80EEA, 150000);
  const cappedNPS = Math.min(nps80CCD, 50000);
  const capped80E = section80E;                              // no cap
  // 80TTA vs 80TTB — use the applicable one based on age (guard: never use both)
  const capped80TTA = isSenior ? 0 : Math.min(section80TTA, 50000);
  const capped80TTB = isSenior ? Math.min(section80TTB, 100000) : 0;
  // 80GG — only if no HRA (guard enforced here too)
  const capped80GG = hraExemption > 0 ? 0 : calc80GG(section80GG_monthlyRent, grossIncome);
  const capped80G = section80G * 0.50;                       // conservative 50% deduction
  const capped80DD = Math.min(section80DD, 125000);
  const max80DDB = isSenior ? 100000 : 40000;
  const capped80DDB = Math.min(section80DDB, max80DDB);
  const capped80U = Math.min(section80U, 125000);

  const totalDeductions =
    standardDeduction +
    hraExemption +
    ltaExemption +
    capped80C +
    capped80D +
    cappedHomeLoan +
    capped80EEA +
    cappedNPS +
    capped80E +
    capped80TTA +
    capped80TTB +
    capped80GG +
    capped80G +
    capped80DD +
    capped80DDB +
    capped80U +
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

  const deductionBreakup: Record<string, number> = {
    "Standard Deduction": standardDeduction,
    "HRA Exemption [10(13A)]": hraExemption,
    "LTA Exemption [10(5)]": ltaExemption,
    "Section 80C": capped80C,
    [`Section 80D${isSenior ? " (Senior)" : ""}`]: capped80D,
    "Home Loan Interest (24b)": cappedHomeLoan,
    "Affordable Housing 80EEA": capped80EEA,
    "NPS 80CCD(1B)": cappedNPS,
    "Education Loan Interest 80E": capped80E,
    ...(isSenior
      ? { "Savings/FD Interest 80TTB": capped80TTB }
      : { "Savings Interest 80TTA": capped80TTA }),
    "Rent Without HRA (80GG)": capped80GG,
    "Donations 80G (50%)": capped80G,
    "Disabled Dependent 80DD": capped80DD,
    "Specified Disease 80DDB": capped80DDB,
    "Self Disability 80U": capped80U,
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
      age: 30,
      hraExemption: hraExemptionResult.annualExemption,
      ltaExemption: 0,
      section80C: otherDeductions80C,
      section80D: otherDeductions80D,
      homeLoanInterest24b: 0,
      section80EEA: 0,
      nps80CCD: 0,
      section80E: 0,
      section80TTA: 0,
      section80TTB: 0,
      section80GG_monthlyRent: 0,
      section80G: 0,
      section80DD: 0,
      section80DDB: 0,
      section80U: 0,
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
