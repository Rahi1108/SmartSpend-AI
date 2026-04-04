// Ollama Configuration - runs locally at http://localhost:11434
const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'mistral'; // or 'neural-chat' for faster, 'dolphin-mixtral' for better

// Types for AI responses
export interface ParsedExpense {
  amount: number;
  type: 'expense' | 'income';
  category: string;
  vendor: string | null;
  description: string;
  date: string;
  confidence: number;
}

export interface SpendingInsight {
  type: 'behavioral' | 'predictive' | 'anomaly' | 'recommendation';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  data?: Record<string, unknown>;
}

export interface SpendingPrediction {
  projectedMonthlySpending: number;
  projectedByCategory: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
  warnings: string[];
}

// Parse natural language expense input using Ollama
export async function parseExpenseInput(input: string): Promise<ParsedExpense> {
  const today = new Date().toISOString().split('T')[0];
  
  const prompt = `You are a financial AI assistant. Parse this expense/income entry and extract structured data. Today's date is ${today}.

Input: "${input}"

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "amount": <number>,
  "type": "expense" or "income",
  "category": "<category name from: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Groceries, Personal Care, Home, Gifts, Investments, Salary, Freelance, Other>",
  "vendor": "<vendor/merchant name or null>",
  "description": "<brief description>",
  "date": "<YYYY-MM-DD format>",
  "confidence": <0.0 to 1.0>
}

Rules:
- If "yesterday" is mentioned, use yesterday's date
- If no date mentioned, use today
- Extract vendor from brand names (Zomato, Swiggy, Amazon, etc.)
- Confidence should reflect how certain you are about the parsing
- Return ONLY the JSON, no other text`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.3, // Lower temperature for more consistent parsing
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('No response from Ollama');
    }

    // Extract JSON from response (model might add extra text)
    const jsonMatch = data.response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Response:', data.response);
      throw new Error('Could not extract JSON from response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedExpense;
    return parsed;
  } catch (error) {
    if (error instanceof Error && error.message.includes('fetch')) {
      throw new Error('Could not connect to Ollama. Make sure Ollama is running on http://localhost:11434');
    }
    throw error;
  }
}

// Generate spending insights
export async function generateInsights(
  transactions: Array<{
    amount: number;
    type: string;
    category_name: string;
    date: string;
    vendor?: string;
  }>,
  budgets: Array<{
    category_name: string;
    amount: number;
    period: string;
  }>
): Promise<SpendingInsight[]> {
  if (transactions.length === 0) {
    return [];
  }

  const prompt = `You are a financial AI assistant. Analyze this financial data and provide insights.

Transactions (last 30 days):
${JSON.stringify(transactions.slice(0, 100), null, 2)}

Budgets:
${JSON.stringify(budgets, null, 2)}

Generate 3-5 actionable insights. Respond ONLY with valid JSON array (no markdown, no extra text):
[
  {
    "type": "behavioral" | "predictive" | "anomaly" | "recommendation",
    "title": "<short title>",
    "content": "<insight in 1-2 sentences, friendly tone>",
    "priority": "low" | "medium" | "high"
  }
]

Focus on:
- Spending patterns (weekday vs weekend, time of month)
- Category trends (increasing/decreasing)
- Unusual transactions
- Budget adherence
- Practical recommendations`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.5,
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const jsonMatch = data.response?.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) return [];
    
    return JSON.parse(jsonMatch[0]) as SpendingInsight[];
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}

// Generate spending predictions
export async function generatePredictions(
  transactions: Array<{
    amount: number;
    type: string;
    category_name: string;
    date: string;
  }>,
  currentMonthSpending: number,
  daysInMonth: number,
  daysPassed: number
): Promise<SpendingPrediction> {
  const prompt = `You are a financial AI assistant. Predict end-of-month spending based on this data.

Current month spending: ₹${currentMonthSpending}
Days passed: ${daysPassed} of ${daysInMonth}
Recent transactions: ${JSON.stringify(transactions.slice(0, 50), null, 2)}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "projectedMonthlySpending": <number>,
  "projectedByCategory": {"category": amount, ...},
  "trend": "increasing" | "decreasing" | "stable",
  "warnings": ["warning1", "warning2"]
}

Consider:
- Daily average spending
- Day-of-week patterns
- End-of-month behavior
- Any unusual recent spending`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!response.ok) throw new Error('Prediction failed');

    const data = await response.json();
    const jsonMatch = data.response?.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error('No prediction JSON');

    return JSON.parse(jsonMatch[0]) as SpendingPrediction;
  } catch (error) {
    console.error('Error generating predictions:', error);
    return {
      projectedMonthlySpending: 0,
      projectedByCategory: {},
      trend: 'stable',
      warnings: ['Unable to generate prediction'],
    };
  }
}

// Generate weekly/monthly summary
export async function generateSummary(
  transactions: Array<{
    amount: number;
    type: string;
    category_name: string;
    date: string;
    vendor?: string;
  }>,
  period: 'week' | 'month'
): Promise<string> {
  const prompt = `You are a friendly financial AI assistant. Generate a friendly ${period}ly financial summary.

Transactions:
${JSON.stringify(transactions, null, 2)}

Write a 3-4 paragraph summary that includes:
1. Total spending and income
2. Top spending categories
3. Notable patterns or changes
4. One actionable tip

Use a friendly, supportive tone. Use ₹ for currency.`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return 'Unable to generate summary.';

    const data = await response.json();
    return data.response || 'Unable to generate summary.';
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Unable to generate summary at this moment.';
  }
}

// Check transaction against budgets and goals
export async function analyzeTransaction(
  transaction: {
    amount: number;
    type: string;
    category_name: string;
  },
  budgetUsage: {
    category: string;
    spent: number;
    limit: number;
    percentage: number;
  }[],
  goals: {
    name: string;
    target: number;
    current: number;
    deadline?: string;
  }[]
): Promise<{
  alerts: Array<{
    type: 'budget_warning' | 'budget_exceeded' | 'goal_progress' | 'anomaly';
    title: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}> {
  const prompt = `You are a financial AI assistant. Analyze this transaction and generate any necessary alerts.

Transaction: ₹${transaction.amount} on ${transaction.category_name}

Budget Status:
${JSON.stringify(budgetUsage, null, 2)}

Goals:
${JSON.stringify(goals, null, 2)}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "alerts": [
    {
      "type": "budget_warning" | "budget_exceeded" | "goal_progress" | "anomaly",
      "title": "<short title>",
      "message": "<helpful message, 1-2 sentences>",
      "severity": "info" | "warning" | "error"
    }
  ]
}

Generate alerts for:
- Budget usage > 80% (warning) or > 100% (exceeded)
- Impact on savings goals
- Any other relevant concerns

Return empty alerts array if nothing concerning.`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.4,
      }),
    });

    if (!response.ok) return { alerts: [] };

    const data = await response.json();
    const jsonMatch = data.response?.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) return { alerts: [] };

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    return { alerts: [] };
  }
}
