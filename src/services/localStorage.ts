/**
 * Local Storage Service - Fallback when Supabase is not available
 * Simulates database operations using browser localStorage
 */

const STORAGE_KEYS = {
  TRANSACTIONS: 'smartspend_transactions',
  BUDGETS: 'smartspend_budgets',
  GOALS: 'smartspend_goals',
  PROFILES: 'smartspend_profiles',
};

interface StorageItem {
  id: string;
  user_id: string;
  [key: string]: any;
}

/**
 * Get all items for a user from a storage collection
 */
export function getLocalStorageItems<T extends StorageItem>(
  collection: keyof typeof STORAGE_KEYS,
  userId: string
): T[] {
  const key = STORAGE_KEYS[collection];
  const data = localStorage.getItem(key);
  if (!data) return [];
  
  try {
    const items: T[] = JSON.parse(data);
    return items.filter(item => item.user_id === userId);
  } catch {
    console.error(`Failed to parse ${key} from localStorage`);
    return [];
  }
}

/**
 * Add an item to local storage collection
 */
export function addLocalStorageItem<T extends StorageItem>(
  collection: keyof typeof STORAGE_KEYS,
  item: T
): T {
  const key = STORAGE_KEYS[collection];
  const data = localStorage.getItem(key);
  const items: T[] = data ? JSON.parse(data) : [];
  
  items.push(item);
  localStorage.setItem(key, JSON.stringify(items));
  
  return item;
}

/**
 * Update an item in local storage collection
 */
export function updateLocalStorageItem<T extends StorageItem>(
  collection: keyof typeof STORAGE_KEYS,
  id: string,
  updates: Partial<T>
): T {
  const key = STORAGE_KEYS[collection];
  const data = localStorage.getItem(key);
  const items: T[] = data ? JSON.parse(data) : [];
  
  const index = items.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`Item with id ${id} not found`);
  }
  
  items[index] = { ...items[index], ...updates };
  localStorage.setItem(key, JSON.stringify(items));
  
  return items[index];
}

/**
 * Delete an item from local storage collection
 */
export function deleteLocalStorageItem(
  collection: keyof typeof STORAGE_KEYS,
  id: string
): void {
  const key = STORAGE_KEYS[collection];
  const data = localStorage.getItem(key);
  const items: StorageItem[] = data ? JSON.parse(data) : [];
  
  const filtered = items.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
}

/**
 * Clear all data for a user
 */
export function clearUserData(userId: string): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      const items: StorageItem[] = JSON.parse(data);
      const filtered = items.filter(item => item.user_id !== userId);
      localStorage.setItem(key, JSON.stringify(filtered));
    }
  });
}

/**
 * Initialize test data (for development)
 */
export function initializeTestData(userId = 'user1'): void {
  // Add sample transactions
  const sampleTransactions = [
    {
      id: `t_${Date.now()}_1`,
      user_id: userId,
      amount: 500,
      type: 'expense' as const,
      category_id: null,
      category_name: 'Food',
      description: 'Lunch at restaurant',
      vendor: 'Zomato',
      date: new Date().toISOString(),
      time: null,
      notes: null,
      tags: ['dining'],
      is_recurring: false,
      recurring_frequency: null,
      ai_parsed: false,
      ai_confidence: 1,
      original_input: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Add sample budgets
  const sampleBudgets = [
    {
      id: `b_${Date.now()}_1`,
      user_id: userId,
      category_id: null,
      category_name: 'Food',
      amount: 5000,
      period: 'monthly' as const,
      spent: 0,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
      alert_threshold: 80,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Add sample goals
  const sampleGoals = [
    {
      id: `g_${Date.now()}_1`,
      user_id: userId,
      name: 'Emergency Fund',
      description: 'Build 6 months of expenses',
      target_amount: 50000,
      current_amount: 10000,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Savings',
      priority: 'high' as const,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(sampleBudgets));
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(sampleGoals));
}
