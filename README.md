# TaxWisely

Free tax tools for salaried Indians — built with Next.js 14 and deployed on Vercel.

## Tools

- **HRA Calculator** — Calculate HRA tax exemption and generate a rent receipt PDF
- **New vs Old Regime** — Side-by-side tax regime comparison with all deductions (Budget 2026)
- **Salary Calculator** — Break down your CTC into take-home pay
- **Payslip Explainer** — Understand every line item on your payslip

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation for rent receipts
- [Vercel Analytics](https://vercel.com/analytics) + Speed Insights

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build & Deploy

```bash
npm run build   # production build
npm run start   # start production server
```

The project is deployed automatically to [taxwisely.in](https://taxwisely.in) via Vercel on every push to `main`.

## Tax Year

All calculations are based on **FY 2026-27 / Budget 2026 (Finance Act 2026)**.
