"use client";

import { useState, useEffect } from "react";
import { calculateSalaryBreakup, formatIndianCurrency, SalaryResult } from "@/lib/taxCalculations";
import { DollarSign, CheckCircle } from "lucide-react";

const LS_KEY = "taxwisely_salary_inputs";

interface SalaryInputState {
  annualCTC: string;
  basicPercent: string;
  hraPercent: string;
  professionalTax: string;
  isMetro: boolean;
  useNewRegime: boolean;
  deductions80C: string;
  deductions80D: string;
}

function fireGA(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

export default function SalaryCalculator() {
  const [inputs, setInputs] = useState<SalaryInputState>({
    annualCTC: "",
    basicPercent: "40",
    hraPercent: "50",
    professionalTax: "200",
    isMetro: true,
    useNewRegime: true,
    deductions80C: "",
    deductions80D: "",
  });
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [restoredFromLS, setRestoredFromLS] = useState(false);
  const [thirtySecFired, setThirtySecFired] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SalaryInputState;
        setInputs(parsed);
        setRestoredFromLS(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thirtySecFired) {
        fireGA("page_time_30s", { tool: "salary_calculator" });
        setThirtySecFired(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [thirtySecFired]);

  const handleChange = (field: keyof SalaryInputState, value: string | boolean) => {
    const updated = { ...inputs, [field]: value };
    setInputs(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleCalculate = () => {
    const ctc = parseFloat(inputs.annualCTC) || 0;
    if (ctc <= 0) return;

    const res = calculateSalaryBreakup({
      annualCTC: ctc,
      basicPercent: parseFloat(inputs.basicPercent) || 40,
      hraPercent: parseFloat(inputs.hraPercent) || 50,
      professionalTaxMonthly: parseFloat(inputs.professionalTax) || 200,
      isMetro: inputs.isMetro,
      useNewRegime: inputs.useNewRegime,
      otherDeductions80C: parseFloat(inputs.deductions80C) || 0,
      otherDeductions80D: parseFloat(inputs.deductions80D) || 0,
    });
    setResult(res);
    fireGA("calculator_used", { tool: "salary_calculator" });
  };

  const Row = ({
    label,
    monthly,
    annual,
    isEarning,
    isTotal,
    isNetTakeHome,
  }: {
    label: string;
    monthly: number;
    annual: number;
    isEarning?: boolean;
    isTotal?: boolean;
    isNetTakeHome?: boolean;
  }) => (
    <tr
      className={`border-b border-[#1E3A2F]/50 ${
        isNetTakeHome
          ? "bg-[#00D4AA]/10"
          : isTotal
          ? "bg-[#0F1620]"
          : ""
      }`}
    >
      <td
        className={`py-2.5 px-4 text-sm ${
          isNetTakeHome
            ? "text-[#00D4AA] font-bold"
            : isTotal
            ? "text-white font-semibold"
            : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </td>
      <td
        className={`py-2.5 px-4 text-sm text-right ${
          isNetTakeHome
            ? "text-[#00D4AA] font-bold"
            : isTotal
            ? "text-white font-semibold"
            : isEarning
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {formatIndianCurrency(monthly)}
      </td>
      <td
        className={`py-2.5 px-4 text-sm text-right ${
          isNetTakeHome
            ? "text-[#00D4AA] font-bold"
            : isTotal
            ? "text-white font-semibold"
            : isEarning
            ? "text-emerald-400"
            : "text-red-400"
        }`}
      >
        {formatIndianCurrency(annual)}
      </td>
    </tr>
  );

  return (
    <div>
      {restoredFromLS && (
        <div className="mb-4 flex items-center gap-2 text-xs text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg px-4 py-2.5">
          <CheckCircle size={14} />
          Your last calculation has been restored.
        </div>
      )}

      <div className="card">
        {/* Regime & city toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="label">Tax Regime</label>
            <div className="flex rounded-lg border border-[#1E3A2F] overflow-hidden">
              <button
                onClick={() => handleChange("useNewRegime", true)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  inputs.useNewRegime ? "bg-[#00D4AA] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                New Regime
              </button>
              <button
                onClick={() => handleChange("useNewRegime", false)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  !inputs.useNewRegime ? "bg-[#00D4AA] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                Old Regime
              </button>
            </div>
          </div>
          <div>
            <label className="label">City Type</label>
            <div className="flex rounded-lg border border-[#1E3A2F] overflow-hidden">
              <button
                onClick={() => handleChange("isMetro", true)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  inputs.isMetro ? "bg-[#00D4AA] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                Metro
              </button>
              <button
                onClick={() => handleChange("isMetro", false)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${
                  !inputs.isMetro ? "bg-[#00D4AA] text-white" : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                Non-Metro
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="label">Annual CTC (₹) *</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 1200000"
              value={inputs.annualCTC}
              onChange={(e) => handleChange("annualCTC", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Basic Salary % of CTC</label>
            <input
              type="number"
              className="input-field"
              placeholder="40"
              value={inputs.basicPercent}
              onChange={(e) => handleChange("basicPercent", e.target.value)}
            />
          </div>
          <div>
            <label className="label">HRA % of Basic</label>
            <input
              type="number"
              className="input-field"
              placeholder="50"
              value={inputs.hraPercent}
              onChange={(e) => handleChange("hraPercent", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Professional Tax per month (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="200"
              value={inputs.professionalTax}
              onChange={(e) => handleChange("professionalTax", e.target.value)}
            />
          </div>
          {!inputs.useNewRegime && (
            <>
              <div>
                <label className="label">Section 80C investments (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="max 1,50,000"
                  value={inputs.deductions80C}
                  onChange={(e) => handleChange("deductions80C", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Section 80D premium (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="max 25,000"
                  value={inputs.deductions80D}
                  onChange={(e) => handleChange("deductions80D", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <DollarSign size={18} />
          Calculate In-Hand Salary
        </button>
      </div>

      {/* Results — Payslip style */}
      {result && (
        <div className="mt-6 animate-slide-up">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="result-card text-center py-6">
              <p className="text-sm text-[#9CA3AF] mb-1">Monthly Take-Home</p>
              <p className="text-4xl font-bold text-[#00D4AA] font-heading">
                {formatIndianCurrency(result.netTakeHomeMonthly)}
              </p>
              <p className="text-xs text-[#6B7280] mt-2">per month</p>
            </div>
            <div className="result-card text-center py-6">
              <p className="text-sm text-[#9CA3AF] mb-1">Annual Take-Home</p>
              <p className="text-4xl font-bold text-emerald-400 font-heading">
                {formatIndianCurrency(result.netTakeHomeAnnual)}
              </p>
              <p className="text-xs text-[#6B7280] mt-2">per year</p>
            </div>
          </div>

          {/* Payslip table */}
          <div className="card overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-[#1E3A2F] bg-[#162030]">
              <h3 className="font-bold text-white font-heading">Salary Breakup Statement</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {inputs.useNewRegime ? "New Tax Regime" : "Old Tax Regime"} •{" "}
                {inputs.isMetro ? "Metro City" : "Non-Metro City"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E3A2F]">
                    <th className="py-2.5 px-4 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Component
                    </th>
                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Monthly
                    </th>
                    <th className="py-2.5 px-4 text-right text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                      Annual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Earnings */}
                  <tr className="bg-emerald-500/5 border-b border-[#1E3A2F]">
                    <td colSpan={3} className="py-2 px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Earnings
                    </td>
                  </tr>
                  <Row label="Basic Salary" monthly={result.basicMonthly} annual={result.basicAnnual} isEarning />
                  <Row label="House Rent Allowance (HRA)" monthly={result.hraMonthly} annual={result.hraAnnual} isEarning />
                  <Row
                    label="Special Allowance"
                    monthly={Math.max(0, result.specialAllowanceMonthly)}
                    annual={Math.max(0, result.specialAllowanceAnnual)}
                    isEarning
                  />
                  <Row label="Gross Salary" monthly={result.grossMonthly} annual={result.grossAnnual} isEarning isTotal />

                  {/* Deductions */}
                  <tr className="bg-red-500/5 border-b border-[#1E3A2F]">
                    <td colSpan={3} className="py-2 px-4 text-xs font-semibold text-red-400 uppercase tracking-wider">
                      Deductions
                    </td>
                  </tr>
                  <Row
                    label="PF (Employee — 12% of Basic)"
                    monthly={result.pfDeductionMonthly}
                    annual={result.pfDeductionAnnual}
                  />
                  <Row
                    label="Professional Tax"
                    monthly={result.professionalTaxMonthly}
                    annual={result.professionalTaxAnnual}
                  />
                  <Row
                    label="Income Tax (TDS)"
                    monthly={result.incomeTaxMonthly}
                    annual={result.incomeTaxAnnual}
                  />
                  <Row
                    label="Total Deductions"
                    monthly={result.totalDeductionsMonthly}
                    annual={result.totalDeductionsAnnual}
                    isTotal
                  />

                  {/* Net */}
                  <Row
                    label="Net Take-Home Salary"
                    monthly={result.netTakeHomeMonthly}
                    annual={result.netTakeHomeAnnual}
                    isNetTakeHome
                  />
                </tbody>
              </table>
            </div>

            {/* Employer contribution note */}
            <div className="px-5 py-3 bg-[#080C10]/50 border-t border-[#1E3A2F]">
              <p className="text-xs text-[#6B7280]">
                * Employer PF contribution of{" "}
                <span className="text-[#9CA3AF]">{formatIndianCurrency(result.employerPFMonthly)}/month</span>{" "}
                ({formatIndianCurrency(result.employerPFAnnual)}/year) is part of your CTC but not in your take-home.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
