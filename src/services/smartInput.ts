/**
 * Smart Input Classifier Service
 * Uses Ollama AI to automatically classify user input as Transaction, Budget, or Goal
 * and extract relevant structured data
 */

import { OLLAMA_CONFIG } from '../constants/config';

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
 * Classify user input using Ollama
 */
export async function classifyUserInput(text: string): Promise<ClassifiedInput> {
  try {
    const prompt = createClassificationPrompt(text);
    
    const response = await fetch(`${OLLAMA_CONFIG.url}${OLLAMA_CONFIG.endpoints.generate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_CONFIG.models.default,
        prompt,
        stream: false,
        temperature: OLLAMA_CONFIG.temperature.parsing,
      }),
    });

    if (!response.ok) {
      console.error('Ollama response error:', response.statusText);
      return createDefaultClassification(text);
    }

    const result = await response.json();
    const responseText = result.response || '';

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

    // Ensure type is valid
    const type = (['transaction', 'budget', 'goal'].includes(parsed.type) ? parsed.type : 'transaction') as InputType;
    const confidence = Math.min(Math.max(parsed.confidence || 0.5, 0), 1);

    return {
      type,
      confidence,
      data: {
        amount: parsed.amount ? parseFloat(parsed.amount.toString()) : undefined,
        description: parsed.description || undefined,
        date: parsed.date ? new Date(parsed.date) : undefined,
        category: parsed.category || undefined,
        transactionType: parsed.transactionType || undefined,
        vendor: parsed.vendor || undefined,
        tags: Array.isArray(parsed.tags) ? parsed.tags : undefined,
        period: parsed.period || undefined,
        goalName: parsed.goalName || undefined,
        deadline: parsed.deadline ? new Date(parsed.deadline) : undefined,
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
  
  if (lowerText.includes('budget') || lowerText.includes('limit') || lowerText.includes('spend')) {
    type = 'budget';
  } else if (lowerText.includes('save') || lowerText.includes('goal') || lowerText.includes('target')) {
    type = 'goal';
  }

  return {
    type,
    confidence: 0.5,
    data: {
      description: text,
    },
    originalText: text,
  };
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
