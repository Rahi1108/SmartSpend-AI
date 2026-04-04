export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};

export const isValidAmount = (amount: number | string): boolean => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num >= 0 && isFinite(num);
};

export const isValidPercentage = (percentage: number): boolean => {
  return percentage >= 0 && percentage <= 100;
};

export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  const cardRegex = /^\d{13,19}$/;
  return cardRegex.test(cleaned);
};

export const isValidZipCode = (zipCode: string, country = 'US'): boolean => {
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(zipCode);
  }
  // Add more country-specific validations as needed
  return zipCode.length > 0;
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s\-']+$/.test(name);
};

export const isValidDescription = (description: string): boolean => {
  return description.trim().length <= 500; // Reasonable limit
};

export const isValidCategoryName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const isValidTransactionAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Reasonable limits
};

export const isValidBudgetAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000; // Reasonable limits
};

export const isValidGoalAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 10000000; // Reasonable limits
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }
  return null;
};

export const validateAmount = (amount: number | string, fieldName: string): string | null => {
  if (!isValidAmount(amount)) {
    return `${fieldName} must be a valid positive number`;
  }
  return null;
};

export const validateDate = (date: string, fieldName: string): string | null => {
  if (!isValidDate(date)) {
    return `${fieldName} must be a valid date`;
  }
  return null;
};
