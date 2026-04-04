// Notification manager to handle periodic checks and trigger notifications
import { notificationService } from './notifications';

export class NotificationManager {
  private static instance: NotificationManager;
  private checkInterval: number | null = null;
  private lastCheck: Date = new Date();

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Start periodic notification checks (every 5 minutes)
  startPeriodicChecks(userId: string, userEmail: string): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.performNotificationChecks(userId, userEmail);
    }, 5 * 60 * 1000); // 5 minutes

    // Perform initial check
    this.performNotificationChecks(userId, userEmail);
  }

  // Stop periodic checks
  stopPeriodicChecks(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Perform all notification checks
  private async performNotificationChecks(userId: string, userEmail: string): Promise<void> {
    try {
      // Only check if user has notifications enabled
      if (!notificationService.hasNotificationsEnabled(userId)) {
        return;
      }

      // Import services dynamically to avoid circular dependencies
      const { getBudgets } = await import('./budgets');
      const { getGoals } = await import('./goals');
      const { getTransactions } = await import('./transactions');

      // Get current data
      const [budgets, goals, transactions] = await Promise.all([
        getBudgets(userId),
        getGoals(userId),
        getTransactions(userId)
      ]);

      // Check budget alerts
      for (const budget of budgets) {
        const categoryTransactions = transactions.filter(t => t.category_name === budget.category_name);
        const currentSpending = categoryTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);

        if (currentSpending > budget.amount) {
          const alertThreshold = budget.alert_threshold || 0.8;
          const thresholdAmount = budget.amount * alertThreshold;

          if (currentSpending > thresholdAmount) {
            const alertKey = `budget_alert_${budget.id}_${new Date().toDateString()}`;
            const alreadySent = localStorage.getItem(alertKey);

            if (!alreadySent) {
              await notificationService.sendBudgetAlert(
                userId,
                userEmail,
                budget.category_name,
                currentSpending,
                budget.amount
              );
              localStorage.setItem(alertKey, 'sent');
            }
          }
        }
      }

      // Check goal milestones
      for (const goal of goals) {
        if (goal.status === 'active') {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          const milestones = [25, 50, 75, 100];

          for (const milestone of milestones) {
            if (progress >= milestone) {
              const milestoneKey = `goal_milestone_${goal.id}_${milestone}`;
              const alreadySent = localStorage.getItem(milestoneKey);

              if (!alreadySent) {
                await notificationService.sendGoalMilestone(
                  userId,
                  userEmail,
                  goal.name,
                  goal.current_amount,
                  goal.target_amount
                );
                localStorage.setItem(milestoneKey, 'sent');
                break;
              }
            }
          }
        }
      }

      this.lastCheck = new Date();
    } catch (error) {
      console.error('Error performing notification checks:', error);
    }
  }

  // Manual trigger for notification checks (useful after data updates)
  async triggerChecks(userId: string, userEmail: string): Promise<void> {
    await this.performNotificationChecks(userId, userEmail);
  }

  // Get last check time
  getLastCheckTime(): Date {
    return this.lastCheck;
  }
}

export const notificationManager = NotificationManager.getInstance();