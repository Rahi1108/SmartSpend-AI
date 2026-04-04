import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key-here';
console.log('Gemini API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No', GEMINI_API_KEY.substring(0, 10) + '...');

let genAI: GoogleGenerativeAI;
let model: any;

try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('Gemini model initialized successfully');
} catch (error) {
  console.error('Failed to initialize Gemini model:', error);
}

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

/**
 * Test Gemini API connection
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Hello, respond with "Gemini is working!"' }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 50,
      },
    });

    const response = result.response;
    const text = response.text();
    console.log('Gemini test response:', text);
    return text.includes('Gemini is working');
  } catch (error) {
    console.error('Gemini test failed:', error);
    return false;
  }
}
async function callGemini(prompt: string, temperature: number = 0.3): Promise<string> {
  console.log('Calling Gemini API with prompt:', prompt.substring(0, 100) + '...');
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 2048,
      },
    });

    const response = result.response;
    const text = response.text();
    console.log('Gemini response received:', text.substring(0, 100) + '...');

    if (!text) {
      throw new Error('No response from Gemini');
    }

    return text;
  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw new Error('Failed to generate AI response. Please check your API key and try again.');
  }
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
    const response = await callGemini(
      prompt,
      0.1 // Lower temperature for more consistent parsing
    );

    // Extract JSON from response (model might add extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Response:', response);
      throw new Error('Could not extract JSON from response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as ParsedExpense;
    return parsed;
  } catch (error) {
    console.error('Error parsing expense:', error);
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
    const response = await callGemini(
      prompt,
      0.7 // Higher temperature for creative insights
    );

    const jsonMatch = response.match(/\[[\s\S]*\]/);

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
    const response = await callGemini(
      prompt,
      0.3 // Moderate temperature for predictions
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);

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
    const response = await callGemini(
      prompt,
      0.7 // Creative temperature for summaries
    );

    return response || 'Unable to generate summary.';
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
    const response = await callGemini(
      prompt,
      0.4 // Moderate temperature for analysis
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return { alerts: [] };

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    return { alerts: [] };
  }
}
