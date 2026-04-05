"use client";

import { useState, useEffect } from "react";
import { calculateHRA, formatIndianCurrency, HRAResult } from "@/lib/taxCalculations";
import { Calculator, Info, CheckCircle } from "lucide-react";

const LS_KEY = "taxwisely_hra_inputs";

interface HRAInputState {
  basicSalary: string;
  hraReceived: string;
  rentPaid: string;
  isMetro: boolean;
}

function fireGA(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

export default function HRACalculator() {
  const [inputs, setInputs] = useState<HRAInputState>({
    basicSalary: "",
    hraReceived: "",
    rentPaid: "",
    isMetro: true,
  });
  const [result, setResult] = useState<HRAResult | null>(null);
  const [restoredFromLS, setRestoredFromLS] = useState(false);
  const [thirtySecFired, setThirtySecFired] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as HRAInputState;
        setInputs(parsed);
        setRestoredFromLS(true);
      }
    } catch {}
  }, []);

  // 30-second page engagement event
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thirtySecFired) {
        fireGA("page_time_30s", { tool: "hra_calculator" });
        setThirtySecFired(true);
      }
    }, 30000);
    return () => clearTimeout(timer);
  }, [thirtySecFired]);

  const handleChange = (field: keyof HRAInputState, value: string | boolean) => {
    const updated = { ...inputs, [field]: value };
    setInputs(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch {}
  };

  const handleCalculate = () => {
    const basic = parseFloat(inputs.basicSalary) || 0;
    const hra = parseFloat(inputs.hraReceived) || 0;
    const rent = parseFloat(inputs.rentPaid) || 0;

    if (basic <= 0) return;

    const res = calculateHRA({
      basicSalaryMonthly: basic,
      hraReceivedMonthly: hra,
      rentPaidMonthly: rent,
      isMetro: inputs.isMetro,
    });

    setResult(res);
    fireGA("calculator_used", { tool: "hra_calculator" });
  };

  const ruleLabels = [
    "Actual HRA received",
    `${inputs.isMetro ? "50" : "40"}% of Basic Salary (${inputs.isMetro ? "Metro" : "Non-Metro"})`,
    "Rent paid minus 10% of Basic Salary",
  ];

  return (
    <div>
      {restoredFromLS && (
        <div className="mb-4 flex items-center gap-2 text-xs text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-lg px-4 py-2.5">
          <CheckCircle size={14} />
          Your last calculation has been restored.
        </div>
      )}

      <div className="card">
        {/* Metro / Non-Metro toggle */}
        <div className="mb-6">
          <label className="label">City Type</label>
          <div className="flex rounded-lg border border-[#2D3748] overflow-hidden w-fit">
            <button
              onClick={() => handleChange("isMetro", true)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                inputs.isMetro
                  ? "bg-[#3B82F6] text-white"
                  : "bg-transparent text-[#9CA3AF] hover:text-white"
              }`}
            >
              Metro City
            </button>
            <button
              onClick={() => handleChange("isMetro", false)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !inputs.isMetro
                  ? "bg-[#3B82F6] text-white"
                  : "bg-transparent text-[#9CA3AF] hover:text-white"
              }`}
            >
              Non-Metro
            </button>
          </div>
          <p className="text-xs text-[#6B7280] mt-1.5">
            Metro cities (50%): Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad
          </p>
          <p className="text-xs text-[#3B82F6]/70 mt-0.5">
            Bengaluru, Hyderabad, Pune &amp; Ahmedabad added as metro effective FY 2026-27
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="label">Basic Salary per month (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 40000"
              value={inputs.basicSalary}
              onChange={(e) => handleChange("basicSalary", e.target.value)}
            />
          </div>
          <div>
            <label className="label">HRA Received per month (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 20000"
              value={inputs.hraReceived}
              onChange={(e) => handleChange("hraReceived", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Actual Rent Paid per month (₹)</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 18000"
              value={inputs.rentPaid}
              onChange={(e) => handleChange("rentPaid", e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <Calculator size={18} />
          Calculate HRA Exemption
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 animate-slide-up">
          {/* Main result cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="result-card">
              <p className="text-xs text-[#9CA3AF] mb-1">Monthly HRA Exemption</p>
              <p className="text-2xl font-bold text-[#3B82F6]">
                {formatIndianCurrency(result.monthlyExemption)}
              </p>
            </div>
            <div className="result-card">
              <p className="text-xs text-[#9CA3AF] mb-1">Annual HRA Exemption</p>
              <p className="text-2xl font-bold text-emerald-400">
                {formatIndianCurrency(result.annualExemption)}
              </p>
            </div>
            <div className="result-card">
              <p className="text-xs text-[#9CA3AF] mb-1">Monthly Taxable HRA</p>
              <p className="text-2xl font-bold text-white">
                {formatIndianCurrency(result.taxableHRAMonthly)}
              </p>
            </div>
            <div className="result-card">
              <p className="text-xs text-[#9CA3AF] mb-1">Annual Taxable HRA</p>
              <p className="text-2xl font-bold text-white">
                {formatIndianCurrency(result.taxableHRAannual)}
              </p>
            </div>
          </div>

          {/* Rule breakdown */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-[#3B82F6]" />
              <h3 className="font-semibold text-white">How Your Exemption Was Calculated</h3>
            </div>
            <p className="text-sm text-[#9CA3AF] mb-4">
              HRA exemption = <span className="text-white font-medium">minimum</span> of the following 3 amounts:
            </p>
            <div className="space-y-3">
              {[result.rule1_actualHRA, result.rule2_percentOfBasic, result.rule3_rentMinusBasic].map(
                (val, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      result.appliedRule === i + 1
                        ? "border-[#3B82F6]/50 bg-[#3B82F6]/10"
                        : "border-[#2D3748] bg-[#0F1117]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          result.appliedRule === i + 1
                            ? "bg-[#3B82F6] text-white"
                            : "bg-[#2D3748] text-[#9CA3AF]"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm text-[#9CA3AF]">{ruleLabels[i]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${result.appliedRule === i + 1 ? "text-[#3B82F6]" : "text-white"}`}>
                        {formatIndianCurrency(val)}
                      </span>
                      {result.appliedRule === i + 1 && (
                        <span className="text-xs bg-[#3B82F6] text-white px-2 py-0.5 rounded-full font-medium">
                          Applied
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
