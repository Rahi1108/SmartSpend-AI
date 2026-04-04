// Email service for sending notifications
// This would typically integrate with a backend service or EmailJS

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'budget_alert' | 'goal_milestone' | 'weekly_report' | 'ai_insight';
}

export interface NotificationPreferences {
  budgetAlerts: boolean;
  goalMilestones: boolean;
  weeklyReports: boolean;
  aiInsights: boolean;
}

class EmailService {
  private async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      // In a real implementation, this would call your email service API
      // For now, we'll simulate sending and log to console

      console.log('📧 Sending email notification:', {
        to: notification.to,
        subject: notification.subject,
        type: notification.type,
        timestamp: new Date().toISOString()
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, you would make an actual API call:
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(notification)
      // });
      // return response.ok;

      return true; // Simulate success
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendBudgetAlert(email: string, budgetName: string, currentAmount: number, limit: number): Promise<boolean> {
    const subject = `Budget Alert: ${budgetName} exceeded`;
    const body = `
      <h2>Budget Alert</h2>
      <p>Your budget "${budgetName}" has been exceeded.</p>
      <p><strong>Current spending:</strong> ₹${currentAmount.toLocaleString()}</p>
      <p><strong>Budget limit:</strong> ₹${limit.toLocaleString()}</p>
      <p>Please review your spending to stay within your budget.</p>
      <br>
      <p>Best regards,<br>SmartSpend AI Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
      type: 'budget_alert'
    });
  }

  async sendGoalMilestone(email: string, goalName: string, currentAmount: number, targetAmount: number): Promise<boolean> {
    const progress = ((currentAmount / targetAmount) * 100).toFixed(1);
    const subject = `Goal Milestone: ${goalName} - ${progress}% complete`;
    const body = `
      <h2>Goal Milestone Achieved!</h2>
      <p>Congratulations! Your goal "${goalName}" is now ${progress}% complete.</p>
      <p><strong>Current progress:</strong> ₹${currentAmount.toLocaleString()}</p>
      <p><strong>Target amount:</strong> ₹${targetAmount.toLocaleString()}</p>
      <p>Keep up the great work!</p>
      <br>
      <p>Best regards,<br>SmartSpend AI Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
      type: 'goal_milestone'
    });
  }

  async sendWeeklyReport(email: string, totalIncome: number, totalExpenses: number, savings: number): Promise<boolean> {
    const subject = `Weekly Financial Report - ${new Date().toLocaleDateString()}`;
    const body = `
      <h2>Your Weekly Financial Summary</h2>
      <p>Here's your financial overview for this week:</p>
      <ul>
        <li><strong>Total Income:</strong> ₹${totalIncome.toLocaleString()}</li>
        <li><strong>Total Expenses:</strong> ₹${totalExpenses.toLocaleString()}</li>
        <li><strong>Net Savings:</strong> ₹${savings.toLocaleString()}</li>
      </ul>
      <p>Log in to your SmartSpend AI dashboard for detailed insights and recommendations.</p>
      <br>
      <p>Best regards,<br>SmartSpend AI Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
      type: 'weekly_report'
    });
  }

  async sendAIInsight(email: string, insight: string, category: string): Promise<boolean> {
    const subject = `AI Financial Insight: ${category}`;
    const body = `
      <h2>Personalized Financial Insight</h2>
      <p>Our AI has analyzed your spending patterns and found:</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0;">
        <strong>${category}:</strong> ${insight}
      </div>
      <p>Use this insight to optimize your financial decisions.</p>
      <br>
      <p>Best regards,<br>SmartSpend AI Team</p>
    `;

    return this.sendEmail({
      to: email,
      subject,
      body,
      type: 'ai_insight'
    });
  }
}

export const emailService = new EmailService();

// Notification preferences storage
export const getNotificationPreferences = (userId: string): NotificationPreferences => {
  const stored = localStorage.getItem(`notifications_${userId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default preferences
  return {
    budgetAlerts: true,
    goalMilestones: true,
    weeklyReports: true,
    aiInsights: true
  };
};

export const saveNotificationPreferences = (userId: string, preferences: NotificationPreferences): void => {
  localStorage.setItem(`notifications_${userId}`, JSON.stringify(preferences));
};