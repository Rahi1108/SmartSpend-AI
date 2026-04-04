// Notification service that integrates email sending with user preferences
import { emailService, getNotificationPreferences } from './email';

export class NotificationService {
  async sendBudgetAlert(userId: string, email: string, budgetName: string, currentAmount: number, limit: number): Promise<boolean> {
    const prefs = getNotificationPreferences(userId);
    if (!prefs.budgetAlerts) return false;

    return emailService.sendBudgetAlert(email, budgetName, currentAmount, limit);
  }

  async sendGoalMilestone(userId: string, email: string, goalName: string, currentAmount: number, targetAmount: number): Promise<boolean> {
    const prefs = getNotificationPreferences(userId);
    if (!prefs.goalMilestones) return false;

    return emailService.sendGoalMilestone(email, goalName, currentAmount, targetAmount);
  }

  async sendWeeklyReport(userId: string, email: string, totalIncome: number, totalExpenses: number, savings: number): Promise<boolean> {
    const prefs = getNotificationPreferences(userId);
    if (!prefs.weeklyReports) return false;

    return emailService.sendWeeklyReport(email, totalIncome, totalExpenses, savings);
  }

  async sendAIInsight(userId: string, email: string, insight: string, category: string): Promise<boolean> {
    const prefs = getNotificationPreferences(userId);
    if (!prefs.aiInsights) return false;

    return emailService.sendAIInsight(email, insight, category);
  }

  // Helper method to check if user has any notifications enabled
  hasNotificationsEnabled(userId: string): boolean {
    const prefs = getNotificationPreferences(userId);
    return prefs.budgetAlerts || prefs.goalMilestones || prefs.weeklyReports || prefs.aiInsights;
  }

  // Get user's notification preferences
  getPreferences(userId: string) {
    return getNotificationPreferences(userId);
  }
}

export const notificationService = new NotificationService();