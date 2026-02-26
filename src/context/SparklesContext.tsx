import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuditResult, SparklesContextType } from '../types';

const SparklesContext = createContext<SparklesContextType | undefined>(undefined);

interface SparklesProviderProps {
  children: ReactNode;
}

export function SparklesProvider({ children }: SparklesProviderProps) {
  const [auditHistory, setAuditHistory] = useState<AuditResult[]>(() => {
    const saved = localStorage.getItem('seoAuditHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(() => {
    const saved = sessionStorage.getItem('currentAudit');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('seoAuditHistory', JSON.stringify(auditHistory));
  }, [auditHistory]);

  useEffect(() => {
    if (currentAudit) {
      sessionStorage.setItem('currentAudit', JSON.stringify(currentAudit));
    } else {
      sessionStorage.removeItem('currentAudit');
    }
  }, [currentAudit]);

  const addAudit = (audit: AuditResult) => {
    setAuditHistory(prev => [audit, ...prev]);
    setCurrentAudit(audit);
  };

  const deleteAudit = (id: string) => {
    setAuditHistory(prev => prev.filter(a => a.id !== id));
  };

  const clearHistory = () => {
    setAuditHistory([]);
  };

  const resetDashboard = () => {
    setCurrentAudit(null);
    sessionStorage.removeItem('currentAudit');
    localStorage.removeItem('currentAudit');
  };

  return (
    <SparklesContext.Provider value={{ 
      auditHistory, 
      currentAudit,
      setCurrentAudit,
      addAudit, 
      deleteAudit, 
      clearHistory,
      resetDashboard 
    }}>
      {children}
    </SparklesContext.Provider>
  );
}

export function useSparkles(): SparklesContextType {
  const context = useContext(SparklesContext);
  if (!context) {
    throw new Error('useSparkles must be used within a SparklesProvider');
  }
  return context;
}
