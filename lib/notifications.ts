export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
  actions?: NotificationAction[];
  data?: any;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface ScheduledNotification {
  id: string;
  habitId?: string;
  type: 'reminder' | 'streak_warning' | 'milestone' | 'goal_deadline';
  scheduledTime: number; // timestamp
  options: NotificationOptions;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'custom';
    days?: number[]; // 0-6 for Sunday-Saturday
    interval?: number; // for custom patterns
  };
  isActive: boolean;
  createdAt: number;
}

class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();
  private timeoutIds: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializePermission();
    this.loadScheduledNotifications();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private initializePermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  private loadScheduledNotifications() {
    try {
      const stored = localStorage.getItem('scheduledNotifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        notifications.forEach((notif: ScheduledNotification) => {
          this.scheduledNotifications.set(notif.id, notif);
          if (notif.isActive) {
            this.scheduleNotification(notif);
          }
        });
      }
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  }

  private saveScheduledNotifications() {
    try {
      const notifications = Array.from(this.scheduledNotifications.values());
      localStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving scheduled notifications:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (this.permission !== 'granted') {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  async showNotification(options: NotificationOptions): Promise<Notification | null> {
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        image: options.image,
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
        timestamp: options.timestamp,
        actions: options.actions,
        data: options.data
      });

      // Add click handler
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notification.close();
        
        // Handle notification click based on type
        if (options.data?.habitId) {
          // Navigate to habit or open habit modal
          this.handleNotificationClick(options.data);
        }
      };

      // Auto-close after 10 seconds unless requireInteraction is true
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  private handleNotificationClick(data: any) {
    // Emit custom event that components can listen to
    window.dispatchEvent(new CustomEvent('habitNotificationClick', { 
      detail: data 
    }));
  }

  scheduleNotification(scheduledNotif: ScheduledNotification): void {
    const now = Date.now();
    const delay = scheduledNotif.scheduledTime - now;

    if (delay <= 0) {
      // If time has passed, handle recurring or skip
      if (scheduledNotif.recurring) {
        this.handleRecurringNotification(scheduledNotif);
      }
      return;
    }

    // Clear existing timeout if any
    const existingTimeout = this.timeoutIds.get(scheduledNotif.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule the notification
    const timeoutId = setTimeout(() => {
      this.showNotification(scheduledNotif.options);
      
      // Handle recurring notifications
      if (scheduledNotif.recurring) {
        this.handleRecurringNotification(scheduledNotif);
      } else {
        // Remove one-time notification
        this.removeScheduledNotification(scheduledNotif.id);
      }
    }, delay);

    this.timeoutIds.set(scheduledNotif.id, timeoutId);
  }

  private handleRecurringNotification(scheduledNotif: ScheduledNotification) {
    if (!scheduledNotif.recurring) return;

    let nextTime: number;
    const now = new Date();

    switch (scheduledNotif.recurring.pattern) {
      case 'daily':
        nextTime = scheduledNotif.scheduledTime + (24 * 60 * 60 * 1000);
        break;
      
      case 'weekly':
        nextTime = scheduledNotif.scheduledTime + (7 * 24 * 60 * 60 * 1000);
        break;
      
      case 'custom':
        if (scheduledNotif.recurring.days && scheduledNotif.recurring.days.length > 0) {
          // Find next day in the week
          const currentDay = now.getDay();
          const sortedDays = [...scheduledNotif.recurring.days].sort((a, b) => a - b);
          
          let nextDay = sortedDays.find(day => day > currentDay);
          if (!nextDay) {
            nextDay = sortedDays[0]; // Next week
          }
          
          const daysToAdd = nextDay > currentDay ? 
            nextDay - currentDay : 
            (7 - currentDay) + nextDay;
          
          nextTime = scheduledNotif.scheduledTime + (daysToAdd * 24 * 60 * 60 * 1000);
        } else {
          // Use interval
          const interval = scheduledNotif.recurring.interval || (24 * 60 * 60 * 1000);
          nextTime = scheduledNotif.scheduledTime + interval;
        }
        break;
      
      default:
        return;
    }

    // Update the scheduled time
    scheduledNotif.scheduledTime = nextTime;
    this.scheduledNotifications.set(scheduledNotif.id, scheduledNotif);
    this.saveScheduledNotifications();

    // Schedule the next occurrence
    this.scheduleNotification(scheduledNotif);
  }

  addScheduledNotification(notification: Omit<ScheduledNotification, 'id' | 'createdAt'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const scheduledNotif: ScheduledNotification = {
      id,
      ...notification,
      createdAt: Date.now()
    };

    this.scheduledNotifications.set(id, scheduledNotif);
    this.saveScheduledNotifications();

    if (scheduledNotif.isActive) {
      this.scheduleNotification(scheduledNotif);
    }

    return id;
  }

  removeScheduledNotification(id: string): boolean {
    // Clear timeout if exists
    const timeoutId = this.timeoutIds.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeoutIds.delete(id);
    }

    // Remove from storage
    const removed = this.scheduledNotifications.delete(id);
    if (removed) {
      this.saveScheduledNotifications();
    }

    return removed;
  }

  updateScheduledNotification(id: string, updates: Partial<ScheduledNotification>): boolean {
    const existing = this.scheduledNotifications.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    this.scheduledNotifications.set(id, updated);
    this.saveScheduledNotifications();

    // Reschedule if needed
    if (updated.isActive) {
      this.scheduleNotification(updated);
    } else {
      // Cancel if deactivated
      const timeoutId = this.timeoutIds.get(id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.timeoutIds.delete(id);
      }
    }

    return true;
  }

  getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  getHabitNotifications(habitId: string): ScheduledNotification[] {
    return this.getScheduledNotifications().filter(notif => notif.habitId === habitId);
  }

  // Predefined notification creators
  createHabitReminder(habitId: string, habitName: string, time: string, days: number[] = [1,2,3,4,5,6,0]): string {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = this.getNextScheduledTime(hours, minutes, days);

    return this.addScheduledNotification({
      habitId,
      type: 'reminder',
      scheduledTime,
      options: {
        title: '⏰ Habit Reminder',
        body: `Time to complete: ${habitName}`,
        tag: `habit-reminder-${habitId}`,
        requireInteraction: false,
        data: { habitId, type: 'reminder' }
      },
      recurring: {
        pattern: 'custom',
        days
      },
      isActive: true
    });
  }

  createStreakWarning(habitId: string, habitName: string, streakLength: number): string {
    // Schedule for end of day
    const scheduledTime = this.getEndOfDayTime();

    return this.addScheduledNotification({
      habitId,
      type: 'streak_warning',
      scheduledTime,
      options: {
        title: '🔥 Streak at Risk!',
        body: `Don't break your ${streakLength}-day streak for "${habitName}"`,
        tag: `streak-warning-${habitId}`,
        requireInteraction: true,
        data: { habitId, type: 'streak_warning', streakLength }
      },
      isActive: true
    });
  }

  createMilestoneNotification(habitId: string, habitName: string, milestone: string): string {
    return this.addScheduledNotification({
      habitId,
      type: 'milestone',
      scheduledTime: Date.now(), // Show immediately
      options: {
        title: '🎉 Milestone Achieved!',
        body: `Congratulations! You've reached: ${milestone} for "${habitName}"`,
        tag: `milestone-${habitId}`,
        requireInteraction: true,
        data: { habitId, type: 'milestone', milestone }
      },
      isActive: true
    });
  }

  createGoalDeadlineReminder(habitId: string, habitName: string, goalName: string, daysLeft: number): string {
    const scheduledTime = Date.now() + (24 * 60 * 60 * 1000); // Tomorrow

    return this.addScheduledNotification({
      habitId,
      type: 'goal_deadline',
      scheduledTime,
      options: {
        title: '📅 Goal Deadline Approaching',
        body: `${daysLeft} days left to achieve "${goalName}" for "${habitName}"`,
        tag: `goal-deadline-${habitId}`,
        requireInteraction: false,
        data: { habitId, type: 'goal_deadline', goalName, daysLeft }
      },
      isActive: true
    });
  }

  private getNextScheduledTime(hours: number, minutes: number, days: number[]): number {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, move to next valid day
    if (scheduledTime <= now || !days.includes(now.getDay())) {
      do {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      } while (!days.includes(scheduledTime.getDay()));
    }

    return scheduledTime.getTime();
  }

  private getEndOfDayTime(): number {
    const endOfDay = new Date();
    endOfDay.setHours(21, 0, 0, 0); // 9 PM
    
    if (endOfDay <= new Date()) {
      endOfDay.setDate(endOfDay.getDate() + 1);
    }

    return endOfDay.getTime();
  }

  // Cleanup method
  cleanup(): void {
    // Clear all timeouts
    this.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeoutIds.clear();
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();

// Utility functions
export const hasNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

export const getNotificationPermissionStatus = (): NotificationPermission => {
  return hasNotificationSupport() ? Notification.permission : 'denied';
};

export const formatNotificationTime = (date: Date): string => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || 'Unknown';
};

export const getDaysOfWeekFromNumbers = (dayNumbers: number[]): string => {
  if (dayNumbers.length === 7) return 'Every day';
  if (dayNumbers.length === 0) return 'Never';
  
  const dayNames = dayNumbers.map(getDayName);
  
  if (dayNumbers.length === 5 && !dayNumbers.includes(0) && !dayNumbers.includes(6)) {
    return 'Weekdays';
  }
  
  if (dayNumbers.length === 2 && dayNumbers.includes(0) && dayNumbers.includes(6)) {
    return 'Weekends';
  }
  
  return dayNames.join(', ');
};