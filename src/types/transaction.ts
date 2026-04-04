export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  tags?: string[];
}

export interface TransactionFormData {
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  tags?: string[];
}
