"use client";

import { useState, useEffect, useRef } from "react";
import {
  calculateNewRegimeTax,
  calculateOldRegimeTax,
  formatIndianCurrency,
} from "@/lib/taxCalculations";
import { TrendingUp, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";

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

// ─── Tooltip component ────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ml-1 text-[#6B7280] hover:text-[#00D4AA] transition-colors focus:outline-none"
        aria-label="More info"
      >
        <Info size={13} />
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-50 w-64 bg-[#162030] border border-[#1E3A2F] rounded-lg p-3 text-xs text-[#9CA3AF] shadow-xl leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}

// ─── CapWarning ───────────────────────────────────────────────────────────────
function CapWarning({ value, max }: { value: string; max: number }) {
  const num = parseFloat(value) || 0;
  if (num > max) {
    return (
      <p className="text-xs text-amber-400 mt-1">
        Capped at {formatIndianCurrency(max)}
      </p>
    );
  }
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RegimeComparator() {
  const [inputs, setInputs] = useState({
    annualCTC: "",
    age: "",
    // core
    hraExemption: "",
    ltaExemption: "",
    section80C: "",
    section80D: "",
    homeLoanInterest: "",
    nps80CCD: "",
    section80TTA: "",
    section80TTB: "",
    otherDeductions: "",
    // extended (show more)
    section80GG: "",       // monthly rent
    section80EEA: "",
    section80E: "",
    section80G: "",
    section80DD: "",
    section80DDB: "",
    section80U: "",
  });

  const [result, setResult] = useState<CompareResult | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [thirtySecFired, setThirtySecFired] = useState(false);

  // Derived values
  const age = parseInt(inputs.age) || 0;
  const isSenior = age >= 60;
  const hasHRA = parseFloat(inputs.hraExemption) > 0;
  const hasHomeLoan = parseFloat(inputs.homeLoanInterest) > 0;
  const max80D = isSenior ? 50000 : 25000;
  const max80DDB = isSenior ? 100000 : 40000;

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
      age,
      hraExemption: parseFloat(inputs.hraExemption) || 0,
      ltaExemption: parseFloat(inputs.ltaExemption) || 0,
      section80C: parseFloat(inputs.section80C) || 0,
      section80D: parseFloat(inputs.section80D) || 0,
      homeLoanInterest24b: parseFloat(inputs.homeLoanInterest) || 0,
      section80EEA: parseFloat(inputs.section80EEA) || 0,
      nps80CCD: parseFloat(inputs.nps80CCD) || 0,
      section80E: parseFloat(inputs.section80E) || 0,
      section80TTA: parseFloat(inputs.section80TTA) || 0,
      section80TTB: parseFloat(inputs.section80TTB) || 0,
      section80GG_monthlyRent: parseFloat(inputs.section80GG) || 0,
      section80G: parseFloat(inputs.section80G) || 0,
      section80DD: parseFloat(inputs.section80DD) || 0,
      section80DDB: parseFloat(inputs.section80DDB) || 0,
      section80U: parseFloat(inputs.section80U) || 0,
      otherDeductions: parseFloat(inputs.otherDeductions) || 0,
    });

    const diff = newRes.totalTax - oldRes.totalTax;
    let winner: "new" | "old" | "tie" = "tie";
    if (diff < -100) winner = "new";
    else if (diff > 100) winner = "old";

    setResult({ newRegime: newRes, oldRegime: oldRes, winner, savings: Math.abs(diff) });
    fireGA("regime_compared", { annual_ctc: inputs.annualCTC });
  };

  const maxTax = result
    ? Math.max(result.newRegime.totalTax, result.oldRegime.totalTax, 1)
    : 1;

  // ─── Field label with optional tooltip ──────────────────────────────────────
  const Label = ({
    text,
    max,
    tooltip,
    badge,
    senior,
  }: {
    text: string;
    max?: string;
    tooltip?: string;
    badge?: boolean;
    senior?: boolean;
  }) => (
    <div className="flex items-center flex-wrap gap-x-1 mb-1.5">
      <span className="text-sm font-medium text-[#9CA3AF]">{text}</span>
      {max && <span className="text-xs text-[#6B7280]">({max})</span>}
      {badge && (
        <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
          Budget 2026
        </span>
      )}
      {senior && (
        <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
          Senior
        </span>
      )}
      {tooltip && <Tooltip text={tooltip} />}
    </div>
  );

  return (
    <div>
      <div className="card">
        {/* ── Annual income ── */}
        <div className="mb-5">
          <Label text="Annual CTC / Gross Income (₹)" />
          <input
            type="number"
            className="input-field max-w-xs"
            placeholder="e.g. 1200000"
            value={inputs.annualCTC}
            onChange={(e) => handleChange("annualCTC", e.target.value)}
          />
        </div>

        {/* ── Age ── */}
        <div className="mb-5 flex items-start gap-4">
          <div className="w-36">
            <Label
              text="Your Age"
              tooltip="Used to apply the correct deduction limits. Senior citizens (60+) get higher 80D and 80TTB limits."
            />
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 32"
              min={18}
              max={100}
              value={inputs.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
          </div>
          {isSenior && (
            <div className="mt-6 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              <span className="text-xs text-amber-400 font-medium">
                Senior Citizen Mode — higher limits applied for 80D, 80TTB, 80DDB
              </span>
            </div>
          )}
        </div>

        {/* ── Old Regime Deductions Box ── */}
        <div className="border border-[#1E3A2F] rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">
                Old Regime Deductions
              </span>
              <span className="text-xs text-[#6B7280]">— leave blank if not applicable</span>
            </div>
            {isSenior && (
              <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Senior Citizen
              </span>
            )}
          </div>

          {/* ── Core fields grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

            {/* HRA */}
            <div>
              <Label
                text="HRA Exemption (₹)"
                tooltip="Annual HRA tax exemption. Use our HRA Calculator to find this number. Only available in old regime."
              />
              <input
                type="number"
                className="input-field"
                placeholder="Annual HRA exempt"
                value={inputs.hraExemption}
                onChange={(e) => handleChange("hraExemption", e.target.value)}
              />
              {!hasHRA && (
                <p className="text-xs text-[#00D4AA] mt-1">
                  No HRA? You may qualify for 80GG ↓
                </p>
              )}
            </div>

            {/* LTA */}
            <div>
              <Label
                text="LTA Exemption — 10(5) (₹)"
                tooltip="Leave Travel Allowance exemption for domestic travel. Claimable for 2 journeys in a 4-year block. Enter actual exempt amount from your Form 16."
              />
              <input
                type="number"
                className="input-field"
                placeholder="From Form 16"
                value={inputs.ltaExemption}
                onChange={(e) => handleChange("ltaExemption", e.target.value)}
              />
            </div>

            {/* 80C */}
            <div>
              <Label
                text="Section 80C (₹)"
                max="max ₹1,50,000"
                tooltip="PF, PPF, ELSS, LIC premium, home loan principal, NSC, Sukanya Samriddhi, tuition fees, etc. Total of all 80C investments capped at ₹1,50,000."
              />
              <input
                type="number"
                className="input-field"
                placeholder="PF, PPF, ELSS, LIC..."
                value={inputs.section80C}
                onChange={(e) => handleChange("section80C", e.target.value)}
              />
              <CapWarning value={inputs.section80C} max={150000} />
            </div>

            {/* 80D */}
            <div>
              <Label
                text="Section 80D — Health Insurance (₹)"
                max={`max ${formatIndianCurrency(max80D)}`}
                tooltip={`Health insurance premium for self, spouse, children. ${isSenior ? "Senior citizens get higher limit of ₹50,000." : "Limit is ₹25,000 for below 60 years."} Parents' insurance can add more (up to ₹1,00,000 total if parents are seniors).`}
                senior={isSenior}
              />
              <input
                type="number"
                className="input-field"
                placeholder="Health insurance premium"
                value={inputs.section80D}
                onChange={(e) => handleChange("section80D", e.target.value)}
              />
              <CapWarning value={inputs.section80D} max={max80D} />
            </div>

            {/* Home Loan 24b */}
            <div>
              <Label
                text="Home Loan Interest — 24b (₹)"
                max="max ₹2,00,000"
                tooltip="Annual interest paid on home loan for self-occupied property. Capped at ₹2,00,000. Principal repayment goes under Section 80C."
              />
              <input
                type="number"
                className="input-field"
                placeholder="Annual interest paid"
                value={inputs.homeLoanInterest}
                onChange={(e) => handleChange("homeLoanInterest", e.target.value)}
              />
              <CapWarning value={inputs.homeLoanInterest} max={200000} />
            </div>

            {/* NPS */}
            <div>
              <Label
                text="NPS — 80CCD(1B) (₹)"
                max="max ₹50,000"
                tooltip="Additional NPS contribution beyond the 80C limit. This ₹50,000 is over and above the ₹1,50,000 80C limit — meaning you can save tax on up to ₹2,00,000 total (80C + 80CCD(1B))."
              />
              <input
                type="number"
                className="input-field"
                placeholder="NPS contribution"
                value={inputs.nps80CCD}
                onChange={(e) => handleChange("nps80CCD", e.target.value)}
              />
              <CapWarning value={inputs.nps80CCD} max={50000} />
            </div>

            {/* 80TTA or 80TTB based on age */}
            {isSenior ? (
              <div>
                <Label
                  text="Savings/FD Interest — 80TTB (₹)"
                  max="max ₹1,00,000"
                  badge
                  tooltip="Senior citizens (60+) can deduct up to ₹1,00,000 on interest from savings accounts, FDs, and post office deposits. Budget 2026 doubled this limit from ₹50,000."
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Interest earned"
                  value={inputs.section80TTB}
                  onChange={(e) => handleChange("section80TTB", e.target.value)}
                />
                <CapWarning value={inputs.section80TTB} max={100000} />
              </div>
            ) : (
              <div>
                <Label
                  text="Savings Account Interest — 80TTA (₹)"
                  max="max ₹50,000"
                  badge
                  tooltip="Interest earned on savings bank accounts is exempt up to ₹50,000 (Budget 2026 increased from ₹10,000). Only savings account interest — NOT FD interest. For below 60 years."
                />
                <input
                  type="number"
                  className="input-field"
                  placeholder="Interest earned"
                  value={inputs.section80TTA}
                  onChange={(e) => handleChange("section80TTA", e.target.value)}
                />
                <CapWarning value={inputs.section80TTA} max={50000} />
              </div>
            )}

            {/* Other */}
            <div>
              <Label
                text="Other Deductions (₹)"
                tooltip="Any other deductions not covered above — e.g. additional medical expenses, specific allowances, etc."
              />
              <input
                type="number"
                className="input-field"
                placeholder="Any other deductions"
                value={inputs.otherDeductions}
                onChange={(e) => handleChange("otherDeductions", e.target.value)}
              />
            </div>
          </div>

          {/* ── Show more toggle ── */}
          <button
            type="button"
            onClick={() => {
              setShowMore((s) => !s);
              if (!showMore) fireGA("show_more_deductions_clicked", { tool: "regime_comparator" });
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-[#1E3A2F] hover:border-[#00D4AA]/40 text-[#9CA3AF] hover:text-white transition-all text-sm"
          >
            <span className="flex items-center gap-2">
              {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showMore ? "Hide additional deductions" : "+ Show more deductions"}
            </span>
            {!showMore && (
              <span className="text-xs text-[#6B7280]">
                Education loan, Rent (80GG), Donations &amp; more
              </span>
            )}
          </button>

          {/* ── Extended fields ── */}
          {showMore && (
            <div className="mt-4 space-y-5 animate-fade-in">

              {/* Housing / Rent Relief */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                  Housing &amp; Rent Relief
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 80GG — only if no HRA */}
                  {!hasHRA && (
                    <div>
                      <Label
                        text="Rent Paid — 80GG (₹/month)"
                        tooltip="For those who do NOT receive HRA from employer. Enter monthly rent paid. Deduction = min of: ₹5,000/month, 25% of income, or rent minus 10% of income. Cannot be claimed if you own a house in the same city."
                      />
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Monthly rent e.g. 12000"
                        value={inputs.section80GG}
                        onChange={(e) => handleChange("section80GG", e.target.value)}
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        Deduction auto-calculated using 3-way formula
                      </p>
                    </div>
                  )}
                  {hasHRA && (
                    <div className="flex items-center gap-2 col-span-full bg-[#080C10] border border-[#1E3A2F] rounded-lg px-4 py-3">
                      <Info size={14} className="text-[#6B7280] shrink-0" />
                      <p className="text-xs text-[#6B7280]">
                        80GG is not applicable when you receive HRA from your employer.
                      </p>
                    </div>
                  )}

                  {/* 80EEA — only if home loan entered */}
                  {hasHomeLoan && (
                    <div>
                      <Label
                        text="Affordable Housing — 80EEA (₹)"
                        max="max ₹1,50,000"
                        tooltip="ADDITIONAL interest deduction over the ₹2L 24b limit. For loans sanctioned Apr 2019–Mar 2022 on affordable housing (stamp duty ≤ ₹45L). First-time home buyers only."
                      />
                      <input
                        type="number"
                        className="input-field"
                        placeholder="Additional interest"
                        value={inputs.section80EEA}
                        onChange={(e) => handleChange("section80EEA", e.target.value)}
                      />
                      <CapWarning value={inputs.section80EEA} max={150000} />
                    </div>
                  )}
                </div>
              </div>

              {/* Education Loan */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                  Education Loan
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      text="Education Loan Interest — 80E (₹)"
                      tooltip="Full interest on education loan for higher studies is deductible — no upper limit. Available for up to 8 years from the year repayment begins. Loan must be from a bank or financial institution. Principal is NOT deductible."
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Annual interest paid"
                      value={inputs.section80E}
                      onChange={(e) => handleChange("section80E", e.target.value)}
                    />
                    <p className="text-xs text-emerald-400/70 mt-1">No upper limit</p>
                  </div>
                </div>
              </div>

              {/* Donations & Medical */}
              <div>
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
                  Donations &amp; Medical Hardship
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <Label
                      text="Donations — 80G (₹)"
                      tooltip="Donations to approved institutions. We apply a conservative 50% deduction. If your donation qualifies for 100% deduction (e.g. PM CARES Fund), enter double the amount."
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Eligible donation amount"
                      value={inputs.section80G}
                      onChange={(e) => handleChange("section80G", e.target.value)}
                    />
                    <p className="text-xs text-[#6B7280] mt-1">50% rate applied conservatively</p>
                  </div>

                  <div>
                    <Label
                      text="Disabled Dependent — 80DD (₹)"
                      max="max ₹1,25,000"
                      tooltip="Flat deduction for maintaining a dependent with disability. Enter ₹75,000 for normal disability (40–79% impairment) or ₹1,25,000 for severe disability (80%+). Medical certificate required."
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="₹75,000 or ₹1,25,000"
                      value={inputs.section80DD}
                      onChange={(e) => handleChange("section80DD", e.target.value)}
                    />
                    <CapWarning value={inputs.section80DD} max={125000} />
                  </div>

                  <div>
                    <Label
                      text={`Specified Disease — 80DDB (₹)`}
                      max={`max ${formatIndianCurrency(max80DDB)}`}
                      tooltip={`Medical expenses for cancer, kidney failure, AIDS, Parkinson's and other specified diseases. ${isSenior ? "Senior citizens get ₹1,00,000 limit." : "Limit is ₹40,000 for below 60 years."} For self or dependent.`}
                      senior={isSenior}
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Actual medical expenses"
                      value={inputs.section80DDB}
                      onChange={(e) => handleChange("section80DDB", e.target.value)}
                    />
                    <CapWarning value={inputs.section80DDB} max={max80DDB} />
                  </div>

                  <div>
                    <Label
                      text="Self Disability — 80U (₹)"
                      max="max ₹1,25,000"
                      tooltip="Flat deduction if you yourself have a certified disability. ₹75,000 for 40–79% impairment, ₹1,25,000 for 80%+ severe disability. Requires certificate from competent medical authority."
                    />
                    <input
                      type="number"
                      className="input-field"
                      placeholder="₹75,000 or ₹1,25,000"
                      value={inputs.section80U}
                      onChange={(e) => handleChange("section80U", e.target.value)}
                    />
                    <CapWarning value={inputs.section80U} max={125000} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleCompare}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          <TrendingUp size={18} />
          Compare Tax Regimes
        </button>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="mt-6 animate-slide-up space-y-4">
          {/* Winner banner */}
          <div
            className={`rounded-xl px-5 py-4 flex items-center gap-3 border ${
              result.winner === "new"
                ? "bg-[#00D4AA]/10 border-[#00D4AA]/30"
                : result.winner === "old"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-[#0F1620] border-[#1E3A2F]"
            }`}
          >
            <CheckCircle
              size={22}
              className={
                result.winner === "new"
                  ? "text-[#00D4AA]"
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

          {/* Side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime */}
            <div className={`card ${result.winner === "new" ? "border-[#00D4AA]/50 bg-[#00D4AA]/5" : ""}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white font-heading">New Regime</h3>
                {result.winner === "new" && (
                  <span className="text-xs bg-[#00D4AA] text-white px-2.5 py-1 rounded-full font-medium">
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
                <div className="flex justify-between text-sm border-t border-[#1E3A2F] pt-2">
                  <span className="text-[#9CA3AF]">Taxable Income</span>
                  <span className="text-white font-medium">{formatIndianCurrency(result.newRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Tax (before cess)</span>
                  <span className="text-white">{formatIndianCurrency(result.newRegime.taxBeforeCess)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Health &amp; Education Cess (4%)</span>
                  <span className="text-white">{formatIndianCurrency(result.newRegime.cess)}</span>
                </div>
                {result.newRegime.rebateApplied && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    87A Rebate Applied — Tax = ₹0
                  </div>
                )}
                <div className="flex justify-between border-t border-[#1E3A2F] pt-2">
                  <span className="text-[#9CA3AF] font-medium">Total Tax Payable</span>
                  <span className="text-xl font-bold text-[#00D4AA]">
                    {formatIndianCurrency(result.newRegime.totalTax)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">Effective Tax Rate</span>
                  <span className="text-[#9CA3AF]">{result.newRegime.effectiveRate.toFixed(2)}%</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-[#080C10] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D4AA] rounded-full transition-all duration-700"
                    style={{ width: `${(result.newRegime.totalTax / maxTax) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Old Regime */}
            <div className={`card ${result.winner === "old" ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}>
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
                  <span className="text-emerald-400">- {formatIndianCurrency(result.oldRegime.totalDeductions)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[#1E3A2F] pt-2">
                  <span className="text-[#9CA3AF]">Taxable Income</span>
                  <span className="text-white font-medium">{formatIndianCurrency(result.oldRegime.taxableIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Tax (before cess)</span>
                  <span className="text-white">{formatIndianCurrency(result.oldRegime.taxBeforeCess)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9CA3AF]">Health &amp; Education Cess (4%)</span>
                  <span className="text-white">{formatIndianCurrency(result.oldRegime.cess)}</span>
                </div>
                {result.oldRegime.rebateApplied && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                    87A Rebate Applied — Tax = ₹0
                  </div>
                )}
                <div className="flex justify-between border-t border-[#1E3A2F] pt-2">
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
              <div className="mt-4">
                <div className="h-2 bg-[#080C10] rounded-full overflow-hidden">
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
                <Info size={16} className="text-[#00D4AA]" />
                <h3 className="font-semibold text-white">Old Regime — Full Deduction Breakdown</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(result.oldRegime.deductionBreakup).map(([key, val]) =>
                  val > 0 ? (
                    <div key={key} className="flex justify-between text-sm py-1.5 border-b border-[#1E3A2F]/50">
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
