// Core Web Vitals type definitions
export interface CoreWebVitals {
  lcp: number | null;
  lcpDisplayValue?: string;
  cls: number | null;
  clsDisplayValue?: string;
  fid: number | null;
  fidDisplayValue?: string;
  fcp: number | null;
  fcpDisplayValue?: string;
  si: number | null;
  siDisplayValue?: string;
}

// Diagnostic item type for detailed issues
export interface DiagnosticItem {
  id: string;
  title: string;
  description: string;
  displayValue: string;
  category: 'performance' | 'seo' | 'accessibility' | 'best-practices';
  score: number;
}

// Audit result type definition
export interface AuditResult {
  id: string;
  url: string;
  date: string;
  score: number;
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
  coreWebVitals: CoreWebVitals;
  diagnostics: DiagnosticItem[];
  issuesCount: number;
}

// Theme context type definitions
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}

// Sparkles context type definitions  
export interface SparklesContextType {
  auditHistory: AuditResult[];
  currentAudit: AuditResult | null;
  setCurrentAudit: (audit: AuditResult | null) => void;
  addAudit: (audit: AuditResult) => void;
  deleteAudit: (id: string) => void;
  clearHistory: () => void;
  resetDashboard: () => void;
}

// Performance metrics type
export interface PerformanceMetrics {
  desktop: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  mobile: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  coreWebVitals: CoreWebVitals;
}

// Radial gauge props
export interface RadialGaugeProps {
  score: number;
  label: string;
  size?: number;
}

// Audit category type
export interface AuditCategory {
  name: string;
  score: number;
  icon: string;
  color: string;
}

// Stat card type
export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  gradient: string;
  border: string;
  iconBg: string;
  iconColor: string;
}
