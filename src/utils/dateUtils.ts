export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

export const getStartOfMonth = (date?: Date): Date => {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getEndOfMonth = (date?: Date): Date => {
  const d = date || new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

export const getStartOfWeek = (date?: Date): Date => {
  const d = date || new Date();
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getDateRange = (period: 'week' | 'month' | 'quarter' | 'year', year?: number): Date => {
  const now = new Date();
  const targetYear = year || now.getFullYear();

  switch (period) {
    case 'week':
      return getStartOfWeek(new Date(targetYear, 0, 1));
    case 'month':
      return new Date(targetYear, now.getMonth(), 1);
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      return new Date(targetYear, quarterStart, 1);
    case 'year':
      return new Date(targetYear, 0, 1);
    default:
      return new Date(targetYear, 0, 1);
  }
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex] || 'Unknown';
};

export const getEndOfWeek = (date?: Date): Date => {
  const d = getStartOfWeek(date);
  d.setDate(d.getDate() + 6);
  return d;
};

export const getStartOfYear = (date?: Date): Date => {
  const d = date || new Date();
  return new Date(d.getFullYear(), 0, 1);
};

export const getEndOfYear = (date?: Date): Date => {
  const d = date || new Date();
  return new Date(d.getFullYear(), 11, 31);
};

export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export const isYesterday = (date: string | Date): boolean => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.toDateString() === yesterday.toDateString();
};

export const isThisWeek = (date: string | Date): boolean => {
  const d = new Date(date);
  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek();
  return d >= startOfWeek && d <= endOfWeek;
};

export const isThisMonth = (date: string | Date): boolean => {
  const d = new Date(date);
  const startOfMonth = getStartOfMonth();
  const endOfMonth = getEndOfMonth();
  return d >= startOfMonth && d <= endOfMonth;
};

export const getRelativeDateString = (date: string | Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';

  const d = new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return `${Math.floor(diffDays / 365)} years ago`;
};
