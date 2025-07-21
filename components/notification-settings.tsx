"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  BellOff, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  Trophy,
  Settings,
  Smartphone,
  Volume2,
  VolumeX
} from "lucide-react";
import { NotificationPreference } from "@/lib/storage";
import { notificationManager, hasNotificationSupport, getNotificationPermissionStatus, getDaysOfWeekFromNumbers } from "@/lib/notifications";
import { cn } from "@/lib/utils";

interface NotificationSettingsProps {
  habitId?: string;
  habitName?: string;
  onClose?: () => void;
}

const NOTIFICATION_TYPES = [
  {
    type: 'daily_reminder' as const,
    title: 'Daily Reminders',
    description: 'Get reminded to complete your habit at specific times',
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    type: 'streak_loss_warning' as const,
    title: 'Streak Warnings',
    description: 'Alert when you might lose your streak',
    icon: AlertTriangle,
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    type: 'milestone_celebration' as const,
    title: 'Milestone Celebrations',
    description: 'Celebrate when you reach milestones',
    icon: Trophy,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    type: 'goal_deadline' as const,
    title: 'Goal Deadlines',
    description: 'Reminders for approaching goal deadlines',
    icon: Calendar,
    color: 'text-purple-600 dark:text-purple-400'
  }
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', full: 'Sunday' },
  { value: 1, label: 'Mon', full: 'Monday' },
  { value: 2, label: 'Tue', full: 'Tuesday' },
  { value: 3, label: 'Wed', full: 'Wednesday' },
  { value: 4, label: 'Thu', full: 'Thursday' },
  { value: 5, label: 'Fri', full: 'Friday' },
  { value: 6, label: 'Sat', full: 'Saturday' }
];

const PRESET_SCHEDULES = [
  { name: 'Every day', days: [0, 1, 2, 3, 4, 5, 6] },
  { name: 'Weekdays only', days: [1, 2, 3, 4, 5] },
  { name: 'Weekends only', days: [0, 6] },
  { name: 'Custom', days: [] }
];

export function NotificationSettings({ habitId, habitName, onClose }: NotificationSettingsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notifications, setNotifications] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for new notification
  const [selectedType, setSelectedType] = useState<'daily_reminder' | 'streak_loss_warning' | 'milestone_celebration' | 'goal_deadline'>('daily_reminder');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [desktopEnabled, setDesktopEnabled] = useState(true);
  const [persistentEnabled, setPersistentEnabled] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermissionStatus());
    loadNotifications();
  }, [habitId]);

  const loadNotifications = () => {
    const allNotifications = notificationManager.getScheduledNotifications();
    const filtered = habitId 
      ? allNotifications.filter(n => n.habitId === habitId)
      : allNotifications;
    setNotifications(filtered.map(n => ({
      id: n.id,
      habitId: n.habitId,
      type: n.type,
      enabled: n.isActive,
      time: extractTimeFromScheduled(n.scheduledTime),
      days: n.recurring?.days || [],
      settings: {
        sound: soundEnabled,
        desktop: desktopEnabled,
        persistent: persistentEnabled
      },
      createdAt: n.createdAt,
      updatedAt: Date.now()
    })));
  };

  const extractTimeFromScheduled = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const newPermission = await notificationManager.requestPermission();
    setPermission(newPermission);
    setIsLoading(false);
  };

  const handleAddNotification = () => {
    if (permission !== 'granted') return;

    const newNotification: NotificationPreference = {
      id: `notif_${Date.now()}`,
      habitId,
      type: selectedType,
      enabled: true,
      time: reminderTime,
      days: selectedDays,
      settings: {
        sound: soundEnabled,
        desktop: desktopEnabled,
        persistent: persistentEnabled
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Create scheduled notification
    if (selectedType === 'daily_reminder' && habitName) {
      notificationManager.createHabitReminder(habitId || '', habitName, reminderTime, selectedDays);
    }

    setNotifications(prev => [...prev, newNotification]);
  };

  const handleToggleNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, enabled: !n.enabled }
        : n
    ));

    // Update in notification manager
    notificationManager.updateScheduledNotification(notificationId, { isActive: !notifications.find(n => n.id === notificationId)?.enabled });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    notificationManager.removeScheduledNotification(notificationId);
  };

  const testNotification = () => {
    if (permission === 'granted') {
      notificationManager.showNotification({
        title: '🧪 Test Notification',
        body: 'This is how your habit reminders will look!',
        tag: 'test-notification'
      });
    }
  };

  if (!hasNotificationSupport()) {
    return (
      <div className="text-center p-8">
        <BellOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Notifications Not Supported
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Your browser doesn't support notifications.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Notification Permissions</CardTitle>
          </div>
          <CardDescription>
            {habitName ? `Manage notifications for "${habitName}"` : 'Manage your notification preferences'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                permission === 'granted' && "bg-green-500",
                permission === 'denied' && "bg-red-500",
                permission === 'default' && "bg-yellow-500"
              )} />
              <div>
                <div className="font-medium text-slate-900 dark:text-white">
                  {permission === 'granted' && 'Notifications Enabled'}
                  {permission === 'denied' && 'Notifications Blocked'}
                  {permission === 'default' && 'Permission Required'}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {permission === 'granted' && 'You will receive notifications'}
                  {permission === 'denied' && 'Enable in browser settings'}
                  {permission === 'default' && 'Click to enable notifications'}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {permission === 'granted' && (
                <Button onClick={testNotification} variant="outline" size="sm">
                  Test
                </Button>
              )}
              {permission !== 'granted' && (
                <Button 
                  onClick={handleRequestPermission} 
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? 'Requesting...' : 'Enable'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Notifications</CardTitle>
            <CardDescription>
              Manage your current notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => {
              const typeInfo = NOTIFICATION_TYPES.find(t => t.type === notification.type);
              const IconComponent = typeInfo?.icon || Bell;
              
              return (
                <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={cn("w-5 h-5", typeInfo?.color)} />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {typeInfo?.title}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {notification.time && `${notification.time} • `}
                        {notification.days && getDaysOfWeekFromNumbers(notification.days)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => handleToggleNotification(notification.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Add New Notification */}
      {permission === 'granted' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Notification</CardTitle>
            <CardDescription>
              Set up a new reminder for your habit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Type */}
            <div className="space-y-3">
              <Label>Notification Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {NOTIFICATION_TYPES.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.type}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-colors",
                        selectedType === type.type 
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                          : "border-slate-200 dark:border-slate-700"
                      )}
                      onClick={() => setSelectedType(type.type)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={cn("w-5 h-5", type.color)} />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white text-sm">
                            {type.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Settings (for daily reminders) */}
            {selectedType === 'daily_reminder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Reminder Time</Label>
                  <Input
                    id="reminderTime"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Days Selection */}
                <div className="space-y-3">
                  <Label>Days to Remind</Label>
                  
                  {/* Preset schedules */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_SCHEDULES.map((preset) => (
                      <Button
                        key={preset.name}
                        variant={JSON.stringify(selectedDays.sort()) === JSON.stringify(preset.days.sort()) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDays([...preset.days])}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>

                  {/* Individual days */}
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <Button
                        key={day.value}
                        variant={selectedDays.includes(day.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedDays.includes(day.value)) {
                            setSelectedDays(selectedDays.filter(d => d !== day.value));
                          } else {
                            setSelectedDays([...selectedDays, day.value]);
                          }
                        }}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Notification Settings */}
            <div className="space-y-4">
              <Label>Notification Options</Label>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-slate-500" />
                    <Label htmlFor="sound">Sound</Label>
                  </div>
                  <Switch
                    id="sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <Label htmlFor="desktop">Desktop Notification</Label>
                  </div>
                  <Switch
                    id="desktop"
                    checked={desktopEnabled}
                    onCheckedChange={setDesktopEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-slate-500" />
                    <Label htmlFor="persistent">Require Action</Label>
                  </div>
                  <Switch
                    id="persistent"
                    checked={persistentEnabled}
                    onCheckedChange={setPersistentEnabled}
                  />
                </div>
              </div>
            </div>

            {/* Add Button */}
            <Button 
              onClick={handleAddNotification}
              className="w-full"
              disabled={selectedType === 'daily_reminder' && selectedDays.length === 0}
            >
              Add Notification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Done
          </Button>
        </div>
      )}
    </div>
  );
}