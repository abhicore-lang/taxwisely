// ─────────────────────────────────────────────────────────────────────────────
// TaxWisely — Rent Receipt PDF Generator using jsPDF
// ─────────────────────────────────────────────────────────────────────────────

export interface RentReceiptData {
  tenantName: string;
  landlordName: string;
  landlordPAN: string;
  propertyAddress: string;
  rentAmount: number;
  month: string;   // e.g. "March"
  year: string;    // e.g. "2025"
  receiptNumber?: string;
}

function formatAmount(amount: number): string {
  const str = Math.round(amount).toString();
  if (str.length <= 3) return str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  let formatted = "";
  for (let i = rest.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 2 === 0) formatted = "," + formatted;
    formatted = rest[i] + formatted;
  }
  return formatted + "," + last3;
}

function numberToWords(num: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  if (num === 0) return "Zero";

  function convert(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convert(n % 100) : "");
    if (n < 100000)
      return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    if (n < 10000000)
      return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + convert(n % 10000000) : "");
  }

  return convert(Math.floor(num)) + " Rupees Only";
}

export async function generateRentReceiptPDF(data: RentReceiptData): Promise<void> {
  // Dynamically import jsPDF to avoid SSR issues
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ── Background ────────────────────────────────────────────────────────────
  doc.setFillColor(15, 17, 23); // #080C10
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // ── Border ────────────────────────────────────────────────────────────────
  doc.setDrawColor(59, 130, 246); // accent blue
  doc.setLineWidth(0.8);
  doc.rect(margin - 5, 10, contentWidth + 10, pageHeight - 20, "S");

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(26, 29, 39); // card-bg
  doc.rect(margin - 5, 10, contentWidth + 10, 22, "F");

  // ── Logo / Site name ──────────────────────────────────────────────────────
  doc.setTextColor(59, 130, 246); // blue
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("TaxWisely.in", margin, 24);

  // ── Title ─────────────────────────────────────────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text("RENT RECEIPT", pageWidth - margin, 24, { align: "right" });

  // ── Receipt metadata ──────────────────────────────────────────────────────
  const receiptNo =
    data.receiptNumber ||
    `RR-${data.year}-${data.month.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`;

  doc.setTextColor(156, 163, 175); // text-secondary
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Receipt No: ${receiptNo}`, margin, 36);
  doc.text(
    `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    pageWidth - margin,
    36,
    { align: "right" }
  );

  // ── Divider ───────────────────────────────────────────────────────────────
  doc.setDrawColor(45, 55, 72); // border color
  doc.setLineWidth(0.3);
  doc.line(margin, 42, pageWidth - margin, 42);

  // ── Received from section ─────────────────────────────────────────────────
  let y = 52;

  doc.setFillColor(26, 29, 39);
  doc.roundedRect(margin - 2, y - 6, contentWidth + 4, 14, 2, 2, "F");

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("RECEIVED FROM", margin + 2, y);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(data.tenantName.toUpperCase(), margin + 2, y + 7);

  y += 20;

  // ── Amount section ────────────────────────────────────────────────────────
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(margin - 2, y - 6, contentWidth + 4, 18, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("RENT AMOUNT", margin + 2, y + 1);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${formatAmount(data.rentAmount)}/-`, margin + 2, y + 11);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(219, 234, 254);
  doc.text(`(${numberToWords(data.rentAmount)})`, pageWidth - margin, y + 11, { align: "right" });

  y += 26;

  // ── Details section ───────────────────────────────────────────────────────
  const details: [string, string][] = [
    ["For the Month of", `${data.month} ${data.year}`],
    ["Towards Rent of Property at", data.propertyAddress],
    ["Paid to (Landlord)", data.landlordName],
    ...(data.landlordPAN ? [["Landlord PAN", data.landlordPAN] as [string, string]] : []),
  ];

  for (const [label, value] of details) {
    doc.setFillColor(26, 29, 39);
    doc.roundedRect(margin - 2, y - 5, contentWidth + 4, 12, 2, 2, "F");

    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 2, y);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    // Wrap long text (address)
    const maxWidth = contentWidth - 4;
    const lines = doc.splitTextToSize(value, maxWidth);
    doc.text(lines[0], margin + 2, y + 6);

    y += label === "Towards Rent of Property at" ? 16 : 16;
  }

  y += 6;

  // ── Signature section ─────────────────────────────────────────────────────
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  // Signature box right side
  doc.setFillColor(26, 29, 39);
  doc.roundedRect(pageWidth - margin - 70, y, 70, 30, 2, 2, "F");

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Landlord's Signature", pageWidth - margin - 70 + 35, y + 10, { align: "center" });

  // Signature line
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.3);
  doc.line(pageWidth - margin - 60, y + 22, pageWidth - margin - 10, y + 22);

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(7.5);
  doc.text(data.landlordName, pageWidth - margin - 70 + 35, y + 28, { align: "center" });

  // Left info
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.text("Mode of Payment: Cash / Bank Transfer", margin, y + 10);
  doc.text(`Payment Date: ${data.month} ${data.year}`, margin, y + 18);

  y += 40;

  // ── Disclaimer ────────────────────────────────────────────────────────────
  doc.setDrawColor(45, 55, 72);
  doc.setLineWidth(0.3);
  doc.line(margin - 2, y, pageWidth - margin + 2, y);

  y += 6;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const disclaimer =
    "This rent receipt is generated for HRA claim purposes under Section 10(13A) of the Income Tax Act. " +
    "Landlord PAN is mandatory if annual rent exceeds Rs. 1,00,000. " +
    "Generated by TaxWisely.in | For informational purposes only.";
  const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFillColor(26, 29, 39);
  doc.rect(margin - 5, pageHeight - 18, contentWidth + 10, 8, "F");

  doc.setTextColor(59, 130, 246);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("TaxWisely.in", pageWidth / 2, pageHeight - 13, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Free Tax Tools for Salaried Indians", pageWidth / 2, pageHeight - 9, { align: "center" });

  // ── Save ──────────────────────────────────────────────────────────────────
  const fileName = `Rent_Receipt_${data.month}_${data.year}_${data.tenantName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}
