"use client";

import { useState, useEffect } from "react";
import {
  calculateNewRegimeTax,
  calculateOldRegimeTax,
  formatIndianCurrency,
} from "@/lib/taxCalculations";
import { TrendingUp, CheckCircle, Info } from "lucide-react";

function fireGA(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

interface CompareResult {
  newRegime: {
    taxableIncome: number;
    taxBeforeCess: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    rebateApplied: boolean;
  };
  oldRegime: {
    taxableIncome: number;
    totalDeductions: number;
    taxBeforeCess: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    rebateApplied: boolean;
    deductionBreakup: Record<string, number>;
  };
  winner: "new" | "old" | "tie";
  savings: number;
}

export default function RegimeComparator() {
  const [inputs, setInputs] = useState({
    annualCTC: "",
    hraExemption: "",
    section80C: "",
    section80D: "",
    homeLoanInterest: "",
    nps80CCD: "",
    otherDeductions: "",
  });
  const [result, setResult] = useState<CompareResult | null>(null);
  const [thirtySecFired, setThirtySecFired] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thirtySecFired) {
        fireGA("page_time_30s", { tool: "regime_comparator" });
        setThirtySecFired(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [thirtySecFired]);

  const handleChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompare = () => {
    const ctc = parseFloat(inputs.annualCTC) || 0;
    if (ctc <= 0) return;

    const newRes = calculateNewRegimeTax(ctc);
    const oldRes = calculateOldRegimeTax({
      grossIncome: ctc,
      hraExemption: parseFloat(inputs.hraExemption) || 0,
      section80C: parseFloat(inputs.section80C) || 0,
      section80D: parseFloat(inputs.section80D) || 0,
      homeLoanInterest24b: parseFloat(inputs.homeLoanInterest) || 0,
      nps80CCD: parseFloat(inputs.nps80CCD) || 0,
      otherDeductions: parseFloat(inputs.otherDeductions) || 0,
    });

    const diff = newRes.totalTax - oldRes.totalTax;
    let winner: "new" | "old" | "tie" = "tie";
    if (diff < -100) winner = "new";
    else if (diff > 100) winner = "old";

    setResult({
      newRegime: newRes,
      oldRegime: oldRes,
      winner,
      savings: Math.abs(diff),
    });

    fireGA("regime_compared", { annual_ctc: inputs.annualCTC });
  };

  const maxTax = result
    ? Math.max(result.newRegime.totalTax, result.oldRegime.totalTax, 1)
    : 1;

  return (
    <div>
      <div className="card">
        {/* Annual income */}
        <div className="mb-5">
          <label className="label">Annual CTC / Gross Income (₹)</label>
          <input
            type="number"
            className="input-field max-w-xs"
            placeholder="e.g. 1200000"
            value={inputs.annualCTC}
            onChange={(e) => handleChange("annualCTC", e.target.value)}
          />
        </div>

        {/* Deductions (Old Regime) */}
        <div className="border border-[#2D3748] rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Old Regime Deductions
            </span>
            <span className="text-xs text-[#6B7280]">— leave blank if not applicable</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="label">HRA Exemption (₹)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Annual HRA exempt"
                value={inputs.hraExemption}
                onChange={(e) => handleChange("hraExemption", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Section 80C (₹){" "}
                <span className="text-[#6B7280] font-normal">max ₹1,50,000</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="PF, PPF, ELSS, LIC..."
                value={inputs.section80C}
                onChange={(e) => handleChange("section80C", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Section 80D (₹){" "}
                <span className="text-[#6B7280] font-normal">max ₹25,000</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="Health insurance premium"
                value={inputs.section80D}
                onChange={(e) => handleChange("section80D", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Home Loan Interest 24b (₹){" "}
                <span className="text-[#6B7280] font-normal">max ₹2,00,000</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="Annual interest paid"
                value={inputs.homeLoanInterest}
                onChange={(e) => handleChange("homeLoanInterest", e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                NPS 80CCD(1B) (₹){" "}
                <span className="text-[#6B7280] font-normal">max ₹50,000</span>
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="NPS contribution"
                value={inputs.nps80CCD}
                onChange={(e) => handleChange("nps80CCD", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Other Deductions (₹)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Any other deductions"
                value={inputs.otherDeductions}
                onChange={(e) => handleChange("otherDeductions", e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCompare}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <TrendingUp size={18} />
          Compare Tax Regimes
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 animate-slide-up space-y-4">
          {/* Winner banner */}
          <div
            className={`rounded-xl px-5 py-4 flex items-center gap-3 border ${
              result.winner === "new"
                ? "bg-[#3B82F6]/10 border-[#3B82F6]/30"
                : result.winner === "old"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-[#1A1D27] border-[#2D3748]"
            }`}
          >
            <CheckCircle
              size={22}
              className={
                result.winner === "new"
                  ? "text-[#3B82F6]"
                  : result.winner === "old"
                  ? "text-emerald-400"
                  : "text-[#9CA3AF]"
              }
            />
            <div>
              <p className="font-semibold text-white">
                {result.winner === "tie"
                  ? "Both regimes result in similar tax"
                  : `${result.winner === "new" ? "New" : "Old"} Tax Regime is better for you`}
              </p>
              {result.winner !== "tie" && (
                <p className="text-sm text-[#9CA3AF]">
                  You save{" "}
                  <span className="text-white font-medium">
                    {formatIndianCurrency(result.savings)}
                  </span>{" "}
                  by choosing the {result.winner === "new" ? "New" : "Old"} Regime
                </p>
              )}
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime */}
            <div
              className={`card ${
                result.winner === "new" ? "border-[#3B82F6]/50 bg-[#3B82F6]/5" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white font-heading">New Regime</h3>
                {result.winner === "new" && (
                  <span className="text-xs bg-[#3B82F6] text-white px-2.5 py-1 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Gross Income</span>
                  <span className="text-white">{formatIndianCurrency(parseFloat(inputs.annualCTC) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Standard Deduction</span>
                  <span className="text-emerald-400">- {formatIndianCurrency(75000)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#2D3748] pt-2">
                  <span className="text-[#9CA3AF]">Taxable Income</span>
                  <span className="text-white font-medium">
                    {formatIndianCurrency(result.newRegime.taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Tax (before cess)</span>
                  <span className="text-white">{formatIndianCurrency(result.newRegime.taxBeforeCess)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Health & Education Cess (4%)</span>
                  <span className="text-white">{formatIndianCurrency(result.newRegime.cess)}</span>
                </div>
                {result.newRegime.rebateApplied && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    87A Rebate Applied — Tax = ₹0
                  </div>
                )}
                <div className="flex justify-between border-t border-[#2D3748] pt-2">
                  <span className="text-[#9CA3AF] font-medium">Total Tax Payable</span>
                  <span className="text-xl font-bold text-[#3B82F6]">
                    {formatIndianCurrency(result.newRegime.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">Effective Tax Rate</span>
                  <span className="text-[#9CA3AF]">{result.newRegime.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>

              {/* Bar */}
              <div className="mt-4">
                <div className="h-2 bg-[#0F1117] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3B82F6] rounded-full transition-all duration-700"
                    style={{ width: `${(result.newRegime.totalTax / maxTax) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Old Regime */}
            <div
              className={`card ${
                result.winner === "old" ? "border-emerald-500/50 bg-emerald-500/5" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white font-heading">Old Regime</h3>
                {result.winner === "old" && (
                  <span className="text-xs bg-emerald-500 text-white px-2.5 py-1 rounded-full font-medium">
                    Recommended
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Gross Income</span>
                  <span className="text-white">{formatIndianCurrency(parseFloat(inputs.annualCTC) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Total Deductions</span>
                  <span className="text-emerald-400">
                    - {formatIndianCurrency(result.oldRegime.totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#2D3748] pt-2">
                  <span className="text-[#9CA3AF]">Taxable Income</span>
                  <span className="text-white font-medium">
                    {formatIndianCurrency(result.oldRegime.taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Tax (before cess)</span>
                  <span className="text-white">{formatIndianCurrency(result.oldRegime.taxBeforeCess)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Health & Education Cess (4%)</span>
                  <span className="text-white">{formatIndianCurrency(result.oldRegime.cess)}</span>
                </div>
                {result.oldRegime.rebateApplied && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    87A Rebate Applied — Tax = ₹0
                  </div>
                )}
                <div className="flex justify-between border-t border-[#2D3748] pt-2">
                  <span className="text-[#9CA3AF] font-medium">Total Tax Payable</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatIndianCurrency(result.oldRegime.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">Effective Tax Rate</span>
                  <span className="text-[#9CA3AF]">{result.oldRegime.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>

              {/* Bar */}
              <div className="mt-4">
                <div className="h-2 bg-[#0F1117] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${(result.oldRegime.totalTax / maxTax) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Deduction breakdown */}
          {Object.values(result.oldRegime.deductionBreakup).some((v) => v > 0) && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-[#3B82F6]" />
                <h3 className="font-semibold text-white">Old Regime Deduction Breakdown</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(result.oldRegime.deductionBreakup).map(([key, val]) =>
                  val > 0 ? (
                    <div key={key} className="flex justify-between text-sm py-1.5 border-b border-[#2D3748]/50">
                      <span className="text-[#9CA3AF]">{key}</span>
                      <span className="text-emerald-400 font-medium">{formatIndianCurrency(val)}</span>
                    </div>
                  ) : null
                )}
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-white font-semibold">Total Deductions</span>
                  <span className="text-emerald-400 font-bold">
                    {formatIndianCurrency(result.oldRegime.totalDeductions)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
