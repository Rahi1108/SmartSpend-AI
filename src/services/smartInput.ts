/**
 * Smart Input Classifier Service
 * Uses Gemini AI to automatically classify user input as Transaction, Budget, or Goal
 * and extract relevant structured data
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key-here';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export type InputType = 'transaction' | 'budget' | 'goal';

export interface ClassifiedInput {
  type: InputType;
  confidence: number;
  data: {
    // Common fields
    amount?: number;
    description?: string;
    date?: Date;
    category?: string;
    
    // Transaction specific
    transactionType?: 'income' | 'expense';
    vendor?: string;
    tags?: string[];
    
    // Budget specific
    period?: 'weekly' | 'monthly' | 'yearly';
    
    // Goal specific
    goalName?: string;
    deadline?: Date;
    priority?: 'low' | 'medium' | 'high';
  };
  originalText: string;
}

/**
 * Classify user input using Gemini
 */
export async function classifyUserInput(text: string): Promise<ClassifiedInput> {
  try {
    const prompt = createClassificationPrompt(text);

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1, // Low temperature for consistent classification
        maxOutputTokens: 1024,
      },
    });

    const response = result.response;
    const responseText = response.text() || '';
    console.log('Gemini classification response:', responseText);

    // Parse the response
    return parseClassificationResponse(responseText, text);
  } catch (error) {
    console.error('Error classifying input:', error);
    return createDefaultClassification(text);
  }
}

/**
 * Create the prompt for Ollama to classify input
 */
function createClassificationPrompt(text: string): string {
  return `You are a financial assistant that classifies user input into one of three categories: TRANSACTION, BUDGET, or GOAL.

Analyze the following user input and respond ONLY with a JSON object (no markdown, no extra text):

Input: "${text}"

Respond with this exact JSON format (all fields are optional except type and confidence):
{
  "type": "transaction" | "budget" | "goal",
  "confidence": 0.0 to 1.0,
  "amount": number or null,
  "description": string or null,
  "date": "YYYY-MM-DD" or null,
  "category": string or null,
  "transactionType": "income" | "expense" or null,
  "vendor": string or null,
  "tags": ["tag1", "tag2"] or null,
  "period": "weekly" | "monthly" | "yearly" or null,
  "goalName": string or null,
  "deadline": "YYYY-MM-DD" or null,
  "priority": "low" | "medium" | "high" or null
}

Important:
- Amount must be a plain number only, without currency symbols.
- If you cannot infer amount, category, or date, use null.
- Do not add extra text, explanation, or markdown.

CLASSIFICATION RULES:
- TRANSACTION: Mentions spending/earning money, buying items, or payments (e.g., "spent ₹500 on groceries", "got paid ₹5000")
- BUDGET: Mentions setting limits or budgets for spending (e.g., "set budget of ₹10000 for food", "limit spending to ₹500 weekly")
- GOAL: Mentions saving targets or financial goals (e.g., "save ₹50000 by next year", "emergency fund of ₹100000")

Return ONLY the JSON object, nothing else.`;
}

/**
 * Parse the classification response from Ollama
 */
function parseClassificationResponse(responseText: string, originalText: string): ClassifiedInput {
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanResponse = responseText.trim();
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleanResponse);
    console.log('Parsed classification JSON:', parsed);

    // Ensure type is valid
    const type = (['transaction', 'budget', 'goal'].includes(parsed.type) ? parsed.type : 'transaction') as InputType;
    const confidence = Math.min(Math.max(parsed.confidence || 0.5, 0), 1);
    const originalAmount = parseAmountValue(parsed.amount ?? parsed.amountString ?? parsed.amount_value);
    const inferredAmount = originalAmount ?? extractAmount(originalText);
    const dateValue = parseDateValue(parsed.date || parsed.deadline || parsed.transactionDate) ?? extractDate(originalText);
    const inferredCategory = parsed.category || inferCategoryFromText(originalText);
    const inferredTransactionType = parsed.transactionType || inferTransactionType(originalText);

    return {
      type,
      confidence,
      data: {
        amount: inferredAmount ?? undefined,
        description: parsed.description || originalText,
        date: dateValue || undefined,
        category: inferredCategory || undefined,
        transactionType: inferredTransactionType || undefined,
        vendor: parsed.vendor || undefined,
        tags: Array.isArray(parsed.tags) ? parsed.tags : undefined,
        period: parsed.period || undefined,
        goalName: parsed.goalName || undefined,
        deadline: dateValue || undefined,
        priority: parsed.priority || undefined,
      },
      originalText,
    };
  } catch (error) {
    console.error('Error parsing classification response:', error);
    return createDefaultClassification(originalText);
  }
}

/**
 * Create a default classification when parsing fails
 */
function createDefaultClassification(text: string): ClassifiedInput {
  // Simple heuristic fallback
  const lowerText = text.toLowerCase();
  
  let type: InputType = 'transaction';
  
  if (lowerText.includes('budget') || lowerText.includes('limit')) {
    type = 'budget';
  } else if (lowerText.includes('save') || lowerText.includes('goal') || lowerText.includes('target')) {
    type = 'goal';
  } else if (lowerText.includes('spent') || lowerText.includes('paid') || lowerText.includes('bought') || lowerText.includes('purchased')) {
    type = 'transaction';
  }

  const inferredAmount = extractAmount(text);
  const inferredCategory = inferCategoryFromText(text);
  const inferredDate = extractDate(text);

  return {
    type,
    confidence: 0.5,
    data: {
      description: text,
      amount: inferredAmount ?? undefined,
      category: inferredCategory ?? undefined,
      date: inferredDate ?? undefined,
      transactionType: type === 'transaction' ? inferTransactionType(text) : undefined,
    },
    originalText: text,
  };
}

function parseAmountValue(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[₹$,]/g, '').trim();
    const numberMatch = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (numberMatch) {
      return parseFloat(numberMatch[0]);
    }
  }
  return undefined;
}

function parseDateValue(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return undefined;
}

function inferCategoryFromText(text: string): string | undefined {
  const mapping: Array<[RegExp, string]> = [
    [/grocer|grocery|supermarket|zomato|swiggy|restaurant|dining|food/i, 'Groceries'],
    [/rent|apartment|house/i, 'Rent'],
    [/travel|uber|ola|taxi|train|bus|flight/i, 'Transportation'],
    [/movie|netflix|spotify|entertainment|concert|game/i, 'Entertainment'],
    [/health|doctor|pharmacy|medicine|clinic|hospital/i, 'Healthcare'],
    [/shopping|amazon|mall|clothes|electronics|fashion/i, 'Shopping'],
    [/salary|payroll|income|salary/i, 'Salary'],
    [/gift|donation|charity/i, 'Gifts'],
    [/utility|electric|water|internet|bill/i, 'Bills & Utilities'],
    [/education|course|tuition|school/i, 'Education'],
    [/insurance|loan|interest/i, 'Financial'],
  ];

  for (const [pattern, category] of mapping) {
    if (pattern.test(text)) {
      return category;
    }
  }
  return undefined;
}

function inferTransactionType(text: string): 'income' | 'expense' | undefined {
  const lowerText = text.toLowerCase();
  if (/(received|income|salary|credited|got paid)/i.test(lowerText)) {
    return 'income';
  }
  if (/(spent|paid|bought|purchased|deducted|charged)/i.test(lowerText)) {
    return 'expense';
  }
  return undefined;
}

/**
 * Extract amount from text using regex patterns
 */
export function extractAmount(text: string): number | null {
  // Common currency patterns: ₹1000, $100, 100, etc.
  const patterns = [
    /₹\s*(\d+(?:\.\d{2})?)/,
    /\$\s*(\d+(?:\.\d{2})?)/,
    /(\d+(?:\.\d{2})?)\s*(?:rupees?|dollars?|usd|inr)/i,
    /(?:amount|cost|price|paid|spent).*?(\d+(?:\.\d{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }

  return null;
}

/**
 * Extract date from text
 */
export function extractDate(text: string): Date | null {
  const now = new Date();
  
  // Check for relative dates
  if (text.toLowerCase().includes('today')) return now;
  if (text.toLowerCase().includes('yesterday')) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }
  if (text.toLowerCase().includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  // Check for common date patterns
  const patterns = [
    /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/,
    /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/,
    /(\d{1,2})\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*(\d{4})?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  return null;
}

/**
 * Extract category from text
 */
export function extractCategory(text: string): string | null {
  const categories = [
    'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping',
    'Education', 'Groceries', 'Dining', 'Freelance', 'Salary', 'Investment'
  ];

  const lowerText = text.toLowerCase();
  
  for (const category of categories) {
    if (lowerText.includes(category.toLowerCase())) {
      return category;
    }
  }

  return null;
}
