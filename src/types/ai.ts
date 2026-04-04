export interface SpendingInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement';
  title: string;
  description: string;
  category?: string;
  amount?: number;
  date: Date;
}

export interface SpendingPrediction {
  id: string;
  category: string;
  predictedAmount: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  warnings: string[];
  recommendations: string[];
}

export interface ParsedExpense {
  amount: number;
  type: 'expense' | 'income';
  category: string;
  vendor: string | null;
  description: string;
  date: string;
  confidence: number;
}
