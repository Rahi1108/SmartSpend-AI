# SmartSpend-AI Data Persistence & Smart Input Guide

## Overview
This document explains the fixes implemented for:
1. **Database persistence** - Data now persists across page refreshes
2. **Smart AI input classifier** - Automatically identifies and routes entries as transactions, budgets, or goals
3. **localStorage fallback** - Works even without Supabase configuration

---

## Part 1: Database Persistence

### Problem
- Data was lost on page refresh because it wasn't synced to the database
- Supabase wasn't configured, leaving no backend storage
- Local Zustand stores only handled in-memory state

### Solution
Created **localStorage fallback** system that:
- Automatically detects if Supabase is configured
- Falls back to browser localStorage when Supabase is unavailable
- Maintains same API interface for both database and localStorage

### How It Works

#### localStorage Service (`src/services/localStorage.ts`)
```typescript
// Get all items for a user
getLocalStorageItems(collection: 'TRANSACTIONS' | 'BUDGETS' | 'GOALS', userId)

// Add new item
addLocalStorageItem(collection, item)

// Update existing item
updateLocalStorageItem(collection, id, updates)

// Delete item
deleteLocalStorageItem(collection, id)

// Initialize test data
initializeTestData(userId)
```

#### Updated Services
All three services now check if Supabase is configured:
- `src/services/transactions.ts`
- `src/services/budgets.ts`
- `src/services/goals.ts`

**Logic:**
```
try:
  if (Supabase is configured):
    use Supabase
  else:
    use localStorage
catch (error):
  fallback to localStorage
```

#### Data is Stored
```javascript
// localStorage keys:
- smartspend_transactions  // Array of all user transactions
- smartspend_budgets       // Array of all user budgets  
- smartspend_goals         // Array of all user goals
```

### Expected Behavior After Fix

✅ **Add a transaction** → Saved to localStorage → Persists on refresh
✅ **Add a budget** → Saved to localStorage → Persists on refresh
✅ **Add a goal** → Saved to localStorage → Persists on refresh

---

## Part 2: Smart AI Input Classifier

### Problem
Users had to manually select entry type (transaction/budget/goal) before entering data.

### Solution
Created **AI-powered classifier** that:
- Accepts natural language input
- Uses Ollama to classify intent automatically
- Extracts structured data from unstructured text
- Routes to appropriate handler

### How to Use

#### 1. Smart Input Service (`src/services/smartInput.ts`)

**Main function:**
```typescript
classifyUserInput(text: string): Promise<ClassifiedInput>

// Returns:
{
  type: 'transaction' | 'budget' | 'goal',
  confidence: 0.0 - 1.0,
  data: {
    amount, description, date, category,
    transactionType, vendor, tags,      // for transactions
    period,                              // for budgets
    goalName, deadline, priority         // for goals
  }
}
```

**Helper functions:**
```typescript
extractAmount(text: string): number | null
extractDate(text: string): Date | null
extractCategory(text: string): string | null
```

#### 2. Smart Input Hook (`src/hooks/useSmartInput.ts`)

```typescript
const {
  isClassifying,      // Loading state
  classifiedData,     // Classified result
  error,              // Error message
  classify,           // (text: string) => Promise<void>
  getTransactionData,()  // Returns formatted transaction data
  getBudgetData,      // Returns formatted budget data
  getGoalData,        // Returns formatted goal data
  reset,              // Reset state
} = useSmartInput();
```

#### 3. Unified Smart Input Component (`src/components/common/UnifiedSmartInput.tsx`)

Modal dialog with two stages:

**Stage 1: Input**
- User enters natural language description
- Example prompts shown

**Stage 2: Review & Confirm**
- Shows detected type (Transaction/Budget/Goal)
- Displays confidence level
- Shows extracted data
- Option to edit or confirm

---

### Example Inputs

**Transactions:**
- "Spent ₹500 on groceries yesterday"
- "Got paid ₹50000 today"
- "Paid ₹1200 for restaurant"

**Budgets:**
- "Set budget of ₹10000 for food monthly"
- "Limit spending to ₹500 weekly on transport"

**Goals:**
- "Save ₹50000 by next year"
- "Emergency fund goal of ₹100000"

---

## Part 3: Test Data Initialization

### Auto-Initialize
When app loads for first time:
```typescript
// In App.tsx
if (!localStorage.getItem('smartspend_initialized')) {
  initializeTestData('user1');
  localStorage.setItem('smartspend_initialized', 'true');
}
```

### Sample Data
- **1 Transaction**: ₹500 expense on groceries
- **1 Budget**: ₹5000/month food budget  
- **1 Goal**: ₹50,000 emergency fund

### Clear Test Data
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

---

## Integration Points

### 1. TransactionsPage
```typescript
<UnifiedSmartInput
  onTransactionAdd={(data) => createTransaction(data)}
  onClose={() => setShowSmartInput(false)}
/>
```

### 2. BudgetsPage (TODO)
Add unified input button to create budget from natural language

### 3. GoalsPage (TODO)
Add unified input button to create goal from natural language

---

## Configuration

### Supabase Setup (Optional)
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Ollama Setup (Required for AI)
```bash
# Install Ollama
winget install Ollama.Ollama

# Start Ollama server in another terminal
ollama serve

# Pull default model
ollama pull mistral
```

---

## Troubleshooting

### Data Lost After Refresh
- Check browser console for errors
- Verify localStorage is enabled: `console.log(localStorage.length)`
- Check if `smartspend_transactions` key exists in localStorage

### Smart Input Not Working
- Ensure Ollama is running at `http://localhost:11434`
- Check `OllamaStatusIndicator` component shows green status
- Look at browser console for error messages

### AI Classification Incorrect
- Review the prompt in `createClassificationPrompt()`
- Try being more specific in input (e.g., "expense" vs "spending")
- Adjust temperature in `OLLAMA_CONFIG`

---

## Files Modified/Created

### New Files
- `src/services/localStorage.ts` - localStorage fallback
- `src/services/smartInput.ts` - AI classifier service
- `src/hooks/useSmartInput.ts` - Hook for using classifier
- `src/components/common/UnifiedSmartInput.tsx` - UI component

### Modified Files
- `src/App.tsx` - Added test data initialization
- `src/services/transactions.ts` - Added localStorage fallback
- `src/services/budgets.ts` - Added localStorage fallback
- `src/services/goals.ts` - Added localStorage fallback
- `src/services/supabase.ts` - Already had fallback logic

---

## Next Steps

1. **Test the app** - Add transactions, budgets, goals and refresh page
2. **Add unified input to BudgetsPage** - Similar to TransactionsPage
3. **Add unified input to GoalsPage** - Similar to TransactionsPage
4. **Connect to real Supabase** - When backend is ready
5. **Improve AI prompts** - Fine-tune classification accuracy

---
