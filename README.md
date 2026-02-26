# SEO Audit Tool

A React.js application with Tailwind CSS for analyzing and improving website SEO.

# 🚀 AI-Powered SEO Audit Tool

A full-stack SEO dashboard that integrates **Google PageSpeed Insights** for real-time performance metrics and **Google Gemini AI** to generate actionable optimization reports.

## ✨ Features
* **Real-Time Analysis:** Fetches Core Web Vitals (LCP, FID, CLS) using the PageSpeed API.
* **AI Recommendations:** Uses Gemini AI to explain technical issues in plain English.
* **Custom Scraper:** Node.js/Express backend to extract internal SEO tags (Meta descriptions, H1s).
* **Comparison Mode:** Analyze two competitor URLs side-by-side (In Progress).

- Website URL audit
- Performance analysis
- SEO score tracking
- Dashboard with statistics
- Audit results display

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Lucide React
* **Backend:** Node.js, Express.js
* **APIs:** Google PageSpeed Insights, Google Gemini AI

## 🚧 Known Issues / Roadmap
* **API Rate Limiting:** Occasionally hitting 429 errors with PageSpeed API (Fix in progress).
* **Comparison Logic:** The dual-fetch logic for the Compare page is currently under refinement.

## 📦 How to Run
1.  Clone the repo
2.  Install dependencies: `npm install`
3.  Create a `.env` file with your API keys (see `.env.example`)
4.  Start server: `npm start`

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```
bash
npm install
```

2. Start the development server:
```
bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

## Project Structure

```
seo-audit-tool/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── AuditForm.js
│   │   └── AuditResults.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Tech Stack

- React.js 18
- Tailwind CSS 3
- Create React App

## License

MIT


