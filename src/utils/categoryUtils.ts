export const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    'Food & Dining': '🍽️',
    'Transportation': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Bills & Utilities': '💡',
    'Healthcare': '🏥',
    'Education': '📚',
    'Travel': '✈️',
    'Groceries': '🛒',
    'Salary': '💰',
    'Freelance': '💻',
    'Investment': '📈',
    'Other': '📦',
  };

  return iconMap[categoryName] || '📦';
};

export const getCategoryColor = (categoryName: string): string => {
  const colorMap: Record<string, string> = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Bills & Utilities': '#FFEAA7',
    'Healthcare': '#DDA0DD',
    'Education': '#98D8C8',
    'Travel': '#F7DC6F',
    'Groceries': '#BB8FCE',
    'Salary': '#85C1E9',
    'Freelance': '#F8C471',
    'Investment': '#82E0AA',
    'Other': '#AEB6BF',
  };

  return colorMap[categoryName] || '#AEB6BF';
};

export const getExpenseCategories = (): string[] => [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other',
];

export const getIncomeCategories = (): string[] => [
  'Salary',
  'Freelance',
  'Investment',
  'Other',
];

export const isExpenseCategory = (categoryName: string): boolean => {
  return getExpenseCategories().includes(categoryName);
};

export const isIncomeCategory = (categoryName: string): boolean => {
  return getIncomeCategories().includes(categoryName);
};

export const getCategoryType = (categoryName: string): 'expense' | 'income' | 'both' => {
  if (isExpenseCategory(categoryName)) return 'expense';
  if (isIncomeCategory(categoryName)) return 'income';
  return 'both';
};
