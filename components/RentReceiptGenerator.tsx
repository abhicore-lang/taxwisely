"use client";

import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { generateRentReceiptPDF, RentReceiptData } from "@/lib/pdfGenerator";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear - 1 + i));

function fireGA(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

export default function RentReceiptGenerator() {
  const [form, setForm] = useState({
    tenantName: "",
    landlordName: "",
    landlordPAN: "",
    propertyAddress: "",
    rentAmount: "",
    month: MONTHS[new Date().getMonth()],
    year: String(currentYear),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  const validate = (): string => {
    if (!form.tenantName.trim()) return "Please enter tenant name.";
    if (!form.landlordName.trim()) return "Please enter landlord name.";
    if (!form.propertyAddress.trim()) return "Please enter property address.";
    const amt = parseFloat(form.rentAmount);
    if (!amt || amt <= 0) return "Please enter a valid rent amount.";
    if (form.landlordPAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.landlordPAN.toUpperCase())) {
      return "PAN format should be like ABCDE1234F.";
    }
    return "";
  };

  const handleGenerate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data: RentReceiptData = {
        tenantName: form.tenantName.trim(),
        landlordName: form.landlordName.trim(),
        landlordPAN: form.landlordPAN.trim().toUpperCase(),
        propertyAddress: form.propertyAddress.trim(),
        rentAmount: parseFloat(form.rentAmount),
        month: form.month,
        year: form.year,
      };

      await generateRentReceiptPDF(data);
      setSuccess(true);
      fireGA("pdf_downloaded", { tool: "rent_receipt" });
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-lg flex items-center justify-center">
          <FileText size={20} className="text-[#3B82F6]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white font-heading">Download Rent Receipt</h2>
          <p className="text-sm text-[#9CA3AF]">Generate a professional PDF rent receipt for HRA claim</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Tenant Name *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Your full name"
            value={form.tenantName}
            onChange={(e) => handleChange("tenantName", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Landlord Name *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Landlord's full name"
            value={form.landlordName}
            onChange={(e) => handleChange("landlordName", e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            Landlord PAN{" "}
            <span className="text-[#6B7280] font-normal">(required if annual rent &gt; ₹1,00,000)</span>
          </label>
          <input
            type="text"
            className="input-field uppercase"
            placeholder="ABCDE1234F"
            maxLength={10}
            value={form.landlordPAN}
            onChange={(e) => handleChange("landlordPAN", e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="label">Monthly Rent Amount (₹) *</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 18000"
            value={form.rentAmount}
            onChange={(e) => handleChange("rentAmount", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Month *</label>
          <select
            className="input-field"
            value={form.month}
            onChange={(e) => handleChange("month", e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Year *</label>
          <select
            className="input-field"
            value={form.year}
            onChange={(e) => handleChange("year", e.target.value)}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="label">Property Address *</label>
          <textarea
            className="input-field min-h-[80px] resize-none"
            placeholder="Full property address including city and PIN code"
            value={form.propertyAddress}
            onChange={(e) => handleChange("propertyAddress", e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3">
          <Download size={16} />
          Rent receipt PDF downloaded successfully!
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={18} />
              Generate &amp; Download Rent Receipt
            </>
          )}
        </button>

        <p className="text-xs text-[#6B7280] mt-3">
          The PDF is generated on your device. No data is sent to our servers.
        </p>
      </div>
    </div>
  );
}
