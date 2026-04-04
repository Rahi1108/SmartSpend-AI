// Enhanced AI Service for SmartSpend AI
// Comprehensive AI system with behavioral insights, predictive analytics, and smart categorization

import { OLLAMA_CONFIG } from '../constants/config';
import { getOllamaStatus } from './ollama';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category_name: string;
  description: string;
  vendor?: string;
  date: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  category_name: string;
  amount: number;
  period: string;
  alert_threshold: number;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  category: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
}

export interface BehavioralPattern {
  category: string;
  averageDaily: number;
  averageWeekly: number;
  averageMonthly: number;
  peakDays: string[];
  peakHours: number[];
  seasonalTrends: Record<string, number>;
  vendorPreferences: Record<string, number>;
  spendingVelocity: 'increasing' | 'decreasing' | 'stable';
}

export interface SmartCategorySuggestion {
  input: string;
  suggestedCategory: string;
  confidence: number;
  alternatives: Array<{ category: string; confidence: number }>;
  reasoning: string;
}

export interface PredictiveInsight {
  type: 'budget' | 'goal' | 'saving' | 'spending';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: string;
  recommendation?: string;
}

export interface AILearningData {
  userId: string;
  categoryMappings: Record<string, string[]>;
  vendorCategories: Record<string, string>;
  spendingPatterns: Record<string, BehavioralPattern>;
  lastUpdated: string;
}

/**
 * Enhanced AI Service Class
 */
export class AIService {
  private learningData: Map<string, AILearningData> = new Map();

  /**
   * Analyze behavioral patterns from transaction history
   */
  async analyzeBehavioralPatterns(
    userId: string,
    transactions: Transaction[],
    months: number = 6
  ): Promise<BehavioralPattern[]> {
    if (transactions.length === 0) return [];

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    const recentTransactions = transactions.filter(t =>
      new Date(t.date) >= cutoffDate
    );

    const patterns: Record<string, BehavioralPattern> = {};

    // Group transactions by category
    const categoryGroups = recentTransactions.reduce((acc, t) => {
      if (!acc[t.category_name]) acc[t.category_name] = [];
      acc[t.category_name].push(t);
      return acc;
    }, {} as Record<string, Transaction[]>);

    for (const [category, txns] of Object.entries(categoryGroups)) {
      const totalSpent = txns.reduce((sum, t) => sum + t.amount, 0);
      const daysDiff = Math.max(1, (Date.now() - cutoffDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate averages
      const averageDaily = totalSpent / daysDiff;
      const averageWeekly = averageDaily * 7;
      const averageMonthly = averageDaily * 30;

      // Analyze peak days
      const dayCounts = txns.reduce((acc, t) => {
        const day = new Date(t.date).toLocaleDateString('en-US', { weekday: 'long' });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const peakDays = Object.entries(dayCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([day]) => day);

      // Analyze peak hours
      const hourCounts = txns.reduce((acc, t) => {
        const hour = new Date(t.date).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const peakHours = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([hour]) => parseInt(hour));

      // Vendor preferences
      const vendorCounts = txns.reduce((acc, t) => {
        if (t.vendor) {
          acc[t.vendor] = (acc[t.vendor] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const vendorPreferences = Object.fromEntries(
        Object.entries(vendorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
      );

      // Calculate spending velocity (trend)
      const sortedTxns = txns.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstHalf = sortedTxns.slice(0, Math.floor(sortedTxns.length / 2));
      const secondHalf = sortedTxns.slice(Math.floor(sortedTxns.length / 2));

      const firstHalfAvg = firstHalf.reduce((sum, t) => sum + t.amount, 0) / Math.max(1, firstHalf.length);
      const secondHalfAvg = secondHalf.reduce((sum, t) => sum + t.amount, 0) / Math.max(1, secondHalf.length);

      let spendingVelocity: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (secondHalfAvg > firstHalfAvg * 1.1) spendingVelocity = 'increasing';
      if (secondHalfAvg < firstHalfAvg * 0.9) spendingVelocity = 'decreasing';

      patterns[category] = {
        category,
        averageDaily,
        averageWeekly,
        averageMonthly,
        peakDays,
        peakHours,
        seasonalTrends: {}, // Could be enhanced with seasonal analysis
        vendorPreferences,
        spendingVelocity,
      };
    }

    return Object.values(patterns);
  }

  /**
   * Generate predictive insights based on patterns and goals
   */
  async generatePredictiveInsights(
    _userId: string,
    transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[],
    patterns: BehavioralPattern[]
  ): Promise<PredictiveInsight[]> {
    const insights: PredictiveInsight[] = [];

    // Budget predictions
    for (const budget of budgets) {
      const pattern = patterns.find(p => p.category === budget.category_name);
      if (pattern) {
        const projectedMonthly = pattern.averageMonthly;
        const budgetUtilization = (projectedMonthly / budget.amount) * 100;

        if (budgetUtilization > 90) {
          insights.push({
            type: 'budget',
            title: `${budget.category_name} Budget Risk`,
            description: `Projected spending of ₹${projectedMonthly.toFixed(0)} exceeds ${budgetUtilization.toFixed(0)}% of your ₹${budget.amount} budget`,
            impact: 'negative',
            confidence: 0.8,
            timeframe: 'next month',
            recommendation: `Consider reducing spending in ${budget.category_name} or increasing your budget limit`,
          });
        }
      }
    }

    // Goal progress predictions
    for (const goal of goals) {
      const remaining = goal.target_amount - goal.current_amount;
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const daysLeft = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      const requiredDaily = remaining / daysLeft;
      const pattern = patterns.find(p => p.category === goal.category);

      if (pattern && pattern.averageDaily > requiredDaily) {
        insights.push({
          type: 'goal',
          title: `${goal.name} Goal Challenge`,
          description: `Your current spending of ₹${pattern.averageDaily.toFixed(0)}/day may prevent reaching your ₹${goal.target_amount.toLocaleString()} goal`,
          impact: 'negative',
          confidence: 0.7,
          timeframe: `${daysLeft} days`,
          recommendation: `Consider increasing savings rate or extending deadline`,
        });
      }
    }

    // Savings opportunities
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    if (savingsRate < 20) {
      insights.push({
        type: 'saving',
        title: 'Savings Opportunity',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for 20% to build financial security`,
        impact: 'neutral',
        confidence: 0.9,
        timeframe: 'ongoing',
        recommendation: `Review expenses and identify areas to reduce spending by ₹${((totalIncome * 0.2) - (totalIncome - totalExpenses)).toFixed(0)} monthly`,
      });
    }

    return insights;
  }

  /**
   * Smart categorization with learning
   */
  async suggestCategory(
    userId: string,
    input: string,
    amount: number,
    vendor?: string
  ): Promise<SmartCategorySuggestion> {
    // Get learning data for user
    const learningData = this.getLearningData(userId);

    // Check vendor-based categorization first
    if (vendor && learningData.vendorCategories[vendor]) {
      return {
        input,
        suggestedCategory: learningData.vendorCategories[vendor],
        confidence: 0.9,
        alternatives: [],
        reasoning: `Based on previous transactions with ${vendor}`,
      };
    }

    // Use AI to analyze the input
    const prompt = `You are a financial categorization expert. Analyze this transaction and suggest the most appropriate category.

Transaction: "${input}"
Amount: ₹${amount}
${vendor ? `Vendor: ${vendor}` : ''}

Based on these common categories:
- Food & Dining (restaurants, cafes, delivery)
- Groceries (supermarkets, grocery stores)
- Transportation (taxis, fuel, public transport)
- Shopping (clothing, electronics, general retail)
- Entertainment (movies, games, subscriptions)
- Bills & Utilities (electricity, internet, phone)
- Healthcare (doctor, pharmacy, insurance)
- Education (courses, books, tuition)
- Travel (hotels, flights, vacation)
- Home (furniture, maintenance, rent)
- Personal Care (salon, gym, cosmetics)
- Other

Respond ONLY with valid JSON:
{
  "category": "exact category name",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation"
}`;

    try {
      const response = await this.callOllama(prompt, 0.2);
      const result = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const suggestedCategory = result.category || 'Other';
      const confidence = result.confidence || 0.5;

      // Learn from this categorization
      this.updateLearningData(userId, input, suggestedCategory, vendor);

      return {
        input,
        suggestedCategory,
        confidence,
        alternatives: [], // Could be enhanced
        reasoning: result.reasoning || 'AI-powered categorization',
      };
    } catch (error) {
      console.error('Error in smart categorization:', error);
      return {
        input,
        suggestedCategory: 'Other',
        confidence: 0.3,
        alternatives: [],
        reasoning: 'Fallback categorization',
      };
    }
  }

  /**
   * Enhanced natural language parsing
   */
  async parseNaturalLanguage(input: string): Promise<{
    type: 'transaction' | 'budget' | 'goal';
    data: any;
    confidence: number;
  }> {
    const prompt = `You are an advanced financial assistant. Parse this natural language input and extract structured financial data.

Input: "${input}"

Analyze the intent and extract:
- Type: "transaction", "budget", or "goal"
- For transactions: amount, type (income/expense), category, vendor, date, description
- For budgets: category, amount, period (weekly/monthly/yearly)
- For goals: name, target amount, deadline, category, priority

Respond ONLY with valid JSON:
{
  "type": "transaction" | "budget" | "goal",
  "confidence": 0.0-1.0,
  "data": {
    "amount": number,
    "description": "string",
    "category": "string",
    "date": "YYYY-MM-DD",
    "vendor": "string",
    "period": "weekly" | "monthly" | "yearly",
    "goalName": "string",
    "deadline": "YYYY-MM-DD",
    "priority": "low" | "medium" | "high",
    "transactionType": "income" | "expense"
  }
}`;

    try {
      const response = await this.callOllama(prompt, 0.3);
      const result = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      return {
        type: result.type || 'transaction',
        data: result.data || {},
        confidence: result.confidence || 0.5,
      };
    } catch (error) {
      console.error('Error parsing natural language:', error);
      return {
        type: 'transaction',
        data: { description: input },
        confidence: 0.3,
      };
    }
  }

  /**
   * Generate comprehensive financial summary
   */
  async generateComprehensiveSummary(
    _userId: string,
    _transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[],
    patterns: BehavioralPattern[]
  ): Promise<{
    overview: string;
    insights: PredictiveInsight[];
    recommendations: string[];
    riskAssessment: string;
  }> {
    const prompt = `You are a comprehensive financial advisor. Analyze this user's financial data and provide a detailed assessment.

TRANSACTIONS (last 30 days):
${JSON.stringify(_transactions.slice(0, 50), null, 2)}

BUDGETS:
${JSON.stringify(budgets, null, 2)}

GOALS:
${JSON.stringify(goals, null, 2)}

SPENDING PATTERNS:
${JSON.stringify(patterns.slice(0, 10), null, 2)}

Provide a comprehensive financial summary including:
1. Overall financial health assessment
2. Key insights and trends
3. Specific recommendations
4. Risk assessment

Use ₹ for currency. Be encouraging and actionable.`;

    try {
      const response = await this.callOllama(prompt, 0.4, 30000); // Longer timeout for comprehensive analysis

      // Parse the response and structure it
      const overview = response;

      // Generate insights using existing methods
      const insights = await this.generatePredictiveInsights(_userId, _transactions, budgets, goals, patterns);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(_transactions, budgets, goals, patterns);

      // Risk assessment
      const riskAssessment = this.assessFinancialRisks(_transactions, budgets, goals, patterns);

      return {
        overview,
        insights,
        recommendations,
        riskAssessment,
      };
    } catch (error) {
      console.error('Error generating comprehensive summary:', error);
      return {
        overview: 'Unable to generate comprehensive financial summary at this time.',
        insights: [],
        recommendations: ['Please ensure your data is up to date for better insights.'],
        riskAssessment: 'Unable to assess financial risks at this time.',
      };
    }
  }

  // Private helper methods

  private async callOllama(prompt: string, temperature: number = 0.3, timeout: number = 10000): Promise<string> {
    const status = getOllamaStatus();
    if (!status.isOnline) {
      throw new Error('AI service is currently offline');
    }

    const response = await fetch(`${OLLAMA_CONFIG.url}${OLLAMA_CONFIG.endpoints.generate}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_CONFIG.models.default,
        prompt,
        stream: false,
        temperature,
      }),
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  }

  private getLearningData(userId: string): AILearningData {
    if (!this.learningData.has(userId)) {
      // Load from localStorage or initialize
      const stored = localStorage.getItem(`ai_learning_${userId}`);
      const data: AILearningData = stored ? JSON.parse(stored) : {
        userId,
        categoryMappings: {},
        vendorCategories: {},
        spendingPatterns: {},
        lastUpdated: new Date().toISOString(),
      };
      this.learningData.set(userId, data);
    }
    return this.learningData.get(userId)!;
  }

  private updateLearningData(userId: string, input: string, category: string, vendor?: string): void {
    const data = this.getLearningData(userId);

    // Update category mappings
    if (!data.categoryMappings[category]) {
      data.categoryMappings[category] = [];
    }
    data.categoryMappings[category].push(input.toLowerCase());

    // Update vendor categories
    if (vendor) {
      data.vendorCategories[vendor] = category;
    }

    data.lastUpdated = new Date().toISOString();

    // Save to localStorage
    localStorage.setItem(`ai_learning_${userId}`, JSON.stringify(data));
    this.learningData.set(userId, data);
  }

  private async generateRecommendations(
    transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[],
    patterns: BehavioralPattern[]
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Budget recommendations
    for (const budget of budgets) {
      const pattern = patterns.find(p => p.category === budget.category_name);
      if (pattern && pattern.averageMonthly > budget.amount) {
        recommendations.push(`Consider increasing your ${budget.category_name} budget from ₹${budget.amount} to ₹${Math.ceil(pattern.averageMonthly)} to avoid overspending.`);
      }
    }

    // Goal recommendations
    for (const goal of goals) {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      if (progress < 25) {
        const remaining = goal.target_amount - goal.current_amount;
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const neededDaily = remaining / Math.max(1, daysLeft);
        recommendations.push(`To reach your ${goal.name} goal, save ₹${neededDaily.toFixed(0)} per day for the next ${daysLeft} days.`);
      }
    }

    // Spending pattern recommendations
    const highSpendingCategories = patterns
      .filter(p => p.spendingVelocity === 'increasing')
      .sort((a, b) => b.averageMonthly - a.averageMonthly)
      .slice(0, 2);

    for (const pattern of highSpendingCategories) {
      recommendations.push(`Your ${pattern.category} spending is increasing. Review recent transactions to identify areas for cost savings.`);
    }

    return recommendations.length > 0 ? recommendations : ['Keep up the good work with your financial habits!'];
  }

  private assessFinancialRisks(
    transactions: Transaction[],
    budgets: Budget[],
    goals: Goal[],
    patterns: BehavioralPattern[]
  ): string {
    let riskLevel = 'low';
    const concerns: string[] = [];

    // Check budget overruns
    const budgetOverruns = budgets.filter(budget => {
      const pattern = patterns.find(p => p.category === budget.category_name);
      return pattern && pattern.averageMonthly > budget.amount;
    });

    if (budgetOverruns.length > 0) {
      riskLevel = 'medium';
      concerns.push(`${budgetOverruns.length} budget(s) are being exceeded regularly`);
    }

    // Check goal progress
    const strugglingGoals = goals.filter(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const requiredProgress = (daysLeft / 30) * 25; // Should be at least 25% per month
      return progress < requiredProgress;
    });

    if (strugglingGoals.length > 0) {
      riskLevel = riskLevel === 'low' ? 'medium' : 'high';
      concerns.push(`${strugglingGoals.length} goal(s) are behind schedule`);
    }

    // Check savings rate
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    if (savingsRate < 10) {
      riskLevel = 'high';
      concerns.push(`Savings rate is only ${savingsRate.toFixed(1)}% - aim for at least 20%`);
    }

    if (concerns.length === 0) {
      return 'Your financial health appears strong with good budget adherence and goal progress.';
    }

    return `Financial risk assessment: ${riskLevel.toUpperCase()}. ${concerns.join('. ')}.`;
  }
}

// Export singleton instance
export const aiService = new AIService();