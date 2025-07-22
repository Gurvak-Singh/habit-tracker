"use client";

export type WidgetType = 
  | 'habits-overview'
  | 'recent-activity'
  | 'streak-counter'
  | 'progress-chart'
  | 'analytics-summary'
  | 'suggestions'
  | 'calendar-view'
  | 'quick-actions'
  | 'goals-tracker'
  | 'habit-cards'
  | 'motivation-quote'
  | 'weather-widget'
  | 'time-tracker';

export type WidgetSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  size: WidgetSize;
  position: {
    x: number;
    y: number;
  };
  settings: Record<string, any>;
  isVisible: boolean;
  isResizable: boolean;
  isDraggable: boolean;
  minSize?: WidgetSize;
  maxSize?: WidgetSize;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  columns: number;
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultSize: WidgetSize;
  availableSizes: WidgetSize[];
  category: 'tracking' | 'analytics' | 'productivity' | 'social' | 'utilities';
  settings: WidgetSettingDefinition[];
  preview: string; // Preview component or image
}

export interface WidgetSettingDefinition {
  key: string;
  label: string;
  type: 'boolean' | 'number' | 'string' | 'select' | 'color' | 'multiselect';
  defaultValue: any;
  options?: { label: string; value: any }[];
  description?: string;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
}

// Widget size configurations
export const widgetSizeConfig = {
  small: { width: 1, height: 1, minWidth: 280, minHeight: 200 },
  medium: { width: 2, height: 1, minWidth: 400, minHeight: 200 },
  large: { width: 2, height: 2, minWidth: 400, minHeight: 400 },
  'extra-large': { width: 3, height: 2, minWidth: 600, minHeight: 400 }
};

// Default widget definitions
export const widgetDefinitions: WidgetDefinition[] = [
  {
    type: 'habits-overview',
    name: 'Habits Overview',
    description: 'Quick overview of all your habits with completion status',
    icon: 'Target',
    defaultSize: 'large',
    availableSizes: ['medium', 'large', 'extra-large'],
    category: 'tracking',
    settings: [
      {
        key: 'showProgress',
        label: 'Show Progress Bars',
        type: 'boolean',
        defaultValue: true,
        description: 'Display progress bars for each habit'
      },
      {
        key: 'maxHabits',
        label: 'Max Habits to Show',
        type: 'number',
        defaultValue: 8,
        validation: { min: 3, max: 20 }
      },
      {
        key: 'sortBy',
        label: 'Sort By',
        type: 'select',
        defaultValue: 'priority',
        options: [
          { label: 'Priority', value: 'priority' },
          { label: 'Name', value: 'name' },
          { label: 'Progress', value: 'progress' },
          { label: 'Last Updated', value: 'updated' }
        ]
      }
    ],
    preview: 'habits-overview-preview'
  },
  {
    type: 'recent-activity',
    name: 'Recent Activity',
    description: 'Timeline of your recent habit completions and activities',
    icon: 'Clock',
    defaultSize: 'medium',
    availableSizes: ['medium', 'large'],
    category: 'tracking',
    settings: [
      {
        key: 'daysToShow',
        label: 'Days to Show',
        type: 'number',
        defaultValue: 7,
        validation: { min: 1, max: 30 }
      },
      {
        key: 'showTime',
        label: 'Show Time',
        type: 'boolean',
        defaultValue: true
      }
    ],
    preview: 'recent-activity-preview'
  },
  {
    type: 'streak-counter',
    name: 'Streak Counter',
    description: 'Display your longest streaks and current streak progress',
    icon: 'TrendingUp',
    defaultSize: 'small',
    availableSizes: ['small', 'medium'],
    category: 'tracking',
    settings: [
      {
        key: 'showAllStreaks',
        label: 'Show All Habits',
        type: 'boolean',
        defaultValue: false,
        description: 'Show streaks for all habits or just the top ones'
      },
      {
        key: 'animateNumbers',
        label: 'Animate Numbers',
        type: 'boolean',
        defaultValue: true
      }
    ],
    preview: 'streak-counter-preview'
  },
  {
    type: 'progress-chart',
    name: 'Progress Chart',
    description: 'Visual chart showing your habit completion over time',
    icon: 'BarChart3',
    defaultSize: 'large',
    availableSizes: ['medium', 'large', 'extra-large'],
    category: 'analytics',
    settings: [
      {
        key: 'chartType',
        label: 'Chart Type',
        type: 'select',
        defaultValue: 'line',
        options: [
          { label: 'Line Chart', value: 'line' },
          { label: 'Bar Chart', value: 'bar' },
          { label: 'Area Chart', value: 'area' }
        ]
      },
      {
        key: 'timeRange',
        label: 'Time Range',
        type: 'select',
        defaultValue: '7d',
        options: [
          { label: 'Last 7 Days', value: '7d' },
          { label: 'Last 30 Days', value: '30d' },
          { label: 'Last 90 Days', value: '90d' }
        ]
      },
      {
        key: 'selectedHabits',
        label: 'Habits to Show',
        type: 'multiselect',
        defaultValue: [],
        description: 'Select specific habits to display'
      }
    ],
    preview: 'progress-chart-preview'
  },
  {
    type: 'analytics-summary',
    name: 'Analytics Summary',
    description: 'Key metrics and insights about your habits',
    icon: 'PieChart',
    defaultSize: 'medium',
    availableSizes: ['medium', 'large'],
    category: 'analytics',
    settings: [
      {
        key: 'showInsights',
        label: 'Show AI Insights',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'metricsToShow',
        label: 'Metrics to Display',
        type: 'multiselect',
        defaultValue: ['completion_rate', 'streak_average', 'consistency'],
        options: [
          { label: 'Completion Rate', value: 'completion_rate' },
          { label: 'Average Streak', value: 'streak_average' },
          { label: 'Consistency Score', value: 'consistency' },
          { label: 'Weekly Goals', value: 'weekly_goals' }
        ]
      }
    ],
    preview: 'analytics-summary-preview'
  },
  {
    type: 'suggestions',
    name: 'Smart Suggestions',
    description: 'AI-powered habit suggestions based on your patterns',
    icon: 'Lightbulb',
    defaultSize: 'medium',
    availableSizes: ['medium', 'large'],
    category: 'productivity',
    settings: [
      {
        key: 'maxSuggestions',
        label: 'Max Suggestions',
        type: 'number',
        defaultValue: 3,
        validation: { min: 1, max: 10 }
      },
      {
        key: 'suggestionType',
        label: 'Suggestion Type',
        type: 'select',
        defaultValue: 'contextual',
        options: [
          { label: 'All Types', value: 'all' },
          { label: 'Contextual', value: 'contextual' },
          { label: 'Goal-Based', value: 'goal' }
        ]
      }
    ],
    preview: 'suggestions-preview'
  },
  {
    type: 'calendar-view',
    name: 'Calendar View',
    description: 'Monthly calendar showing your habit completion',
    icon: 'Calendar',
    defaultSize: 'large',
    availableSizes: ['large', 'extra-large'],
    category: 'tracking',
    settings: [
      {
        key: 'viewType',
        label: 'View Type',
        type: 'select',
        defaultValue: 'month',
        options: [
          { label: 'Month', value: 'month' },
          { label: 'Week', value: 'week' }
        ]
      },
      {
        key: 'showHabitNames',
        label: 'Show Habit Names',
        type: 'boolean',
        defaultValue: false
      },
      {
        key: 'highlightStreaks',
        label: 'Highlight Streaks',
        type: 'boolean',
        defaultValue: true
      }
    ],
    preview: 'calendar-view-preview'
  },
  {
    type: 'quick-actions',
    name: 'Quick Actions',
    description: 'Fast access to common actions like adding habits or logging completions',
    icon: 'Zap',
    defaultSize: 'small',
    availableSizes: ['small', 'medium'],
    category: 'productivity',
    settings: [
      {
        key: 'actions',
        label: 'Available Actions',
        type: 'multiselect',
        defaultValue: ['add_habit', 'log_completion', 'view_analytics'],
        options: [
          { label: 'Add Habit', value: 'add_habit' },
          { label: 'Log Completion', value: 'log_completion' },
          { label: 'View Analytics', value: 'view_analytics' },
          { label: 'Export Data', value: 'export_data' },
          { label: 'Backup', value: 'backup' }
        ]
      },
      {
        key: 'buttonStyle',
        label: 'Button Style',
        type: 'select',
        defaultValue: 'grid',
        options: [
          { label: 'Grid Layout', value: 'grid' },
          { label: 'List Layout', value: 'list' }
        ]
      }
    ],
    preview: 'quick-actions-preview'
  },
  {
    type: 'goals-tracker',
    name: 'Goals Tracker',
    description: 'Track progress towards your habit goals and milestones',
    icon: 'Target',
    defaultSize: 'medium',
    availableSizes: ['medium', 'large'],
    category: 'tracking',
    settings: [
      {
        key: 'showProgress',
        label: 'Show Progress Bars',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'goalTypes',
        label: 'Goal Types to Show',
        type: 'multiselect',
        defaultValue: ['streak', 'completion'],
        options: [
          { label: 'Streak Goals', value: 'streak' },
          { label: 'Completion Goals', value: 'completion' },
          { label: 'Time Goals', value: 'time' },
          { label: 'Milestone Goals', value: 'milestone' }
        ]
      }
    ],
    preview: 'goals-tracker-preview'
  },
  {
    type: 'motivation-quote',
    name: 'Daily Motivation',
    description: 'Inspirational quotes and messages to keep you motivated',
    icon: 'Heart',
    defaultSize: 'small',
    availableSizes: ['small', 'medium'],
    category: 'productivity',
    settings: [
      {
        key: 'quoteCategory',
        label: 'Quote Category',
        type: 'select',
        defaultValue: 'general',
        options: [
          { label: 'General', value: 'general' },
          { label: 'Success', value: 'success' },
          { label: 'Health', value: 'health' },
          { label: 'Productivity', value: 'productivity' }
        ]
      },
      {
        key: 'showAuthor',
        label: 'Show Author',
        type: 'boolean',
        defaultValue: true
      },
      {
        key: 'autoRefresh',
        label: 'Auto Refresh Daily',
        type: 'boolean',
        defaultValue: true
      }
    ],
    preview: 'motivation-quote-preview'
  }
];

// Default dashboard layouts
export const defaultLayouts: DashboardLayout[] = [
  {
    id: 'default',
    name: 'Default Dashboard',
    description: 'Balanced layout with essential widgets',
    columns: 3,
    isDefault: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    widgets: [
      {
        id: 'habits-overview-1',
        type: 'habits-overview',
        title: 'My Habits',
        size: 'large',
        position: { x: 0, y: 0 },
        settings: { showProgress: true, maxHabits: 8, sortBy: 'priority' },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'streak-counter-1',
        type: 'streak-counter',
        title: 'Current Streaks',
        size: 'small',
        position: { x: 2, y: 0 },
        settings: { showAllStreaks: false, animateNumbers: true },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'progress-chart-1',
        type: 'progress-chart',
        title: 'Progress Overview',
        size: 'large',
        position: { x: 0, y: 2 },
        settings: { chartType: 'line', timeRange: '7d', selectedHabits: [] },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'suggestions-1',
        type: 'suggestions',
        title: 'Smart Suggestions',
        size: 'small',
        position: { x: 2, y: 1 },
        settings: { maxSuggestions: 3, suggestionType: 'contextual' },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      }
    ]
  },
  {
    id: 'analytics-focused',
    name: 'Analytics Dashboard',
    description: 'Perfect for data-driven habit tracking',
    columns: 4,
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    widgets: [
      {
        id: 'analytics-summary-1',
        type: 'analytics-summary',
        title: 'Analytics Summary',
        size: 'medium',
        position: { x: 0, y: 0 },
        settings: { showInsights: true, metricsToShow: ['completion_rate', 'streak_average'] },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'progress-chart-2',
        type: 'progress-chart',
        title: 'Detailed Progress',
        size: 'extra-large',
        position: { x: 0, y: 1 },
        settings: { chartType: 'area', timeRange: '30d', selectedHabits: [] },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'streak-counter-2',
        type: 'streak-counter',
        title: 'All Streaks',
        size: 'medium',
        position: { x: 2, y: 0 },
        settings: { showAllStreaks: true, animateNumbers: true },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'calendar-view-1',
        type: 'calendar-view',
        title: 'Monthly View',
        size: 'large',
        position: { x: 3, y: 1 },
        settings: { viewType: 'month', showHabitNames: false, highlightStreaks: true },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      }
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal Dashboard',
    description: 'Clean and simple layout with just the essentials',
    columns: 2,
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    widgets: [
      {
        id: 'habits-overview-2',
        type: 'habits-overview',
        title: 'Today\'s Habits',
        size: 'large',
        position: { x: 0, y: 0 },
        settings: { showProgress: false, maxHabits: 5, sortBy: 'priority' },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'quick-actions-1',
        type: 'quick-actions',
        title: 'Quick Actions',
        size: 'small',
        position: { x: 1, y: 0 },
        settings: { actions: ['add_habit', 'log_completion'], buttonStyle: 'grid' },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      },
      {
        id: 'motivation-quote-1',
        type: 'motivation-quote',
        title: 'Daily Motivation',
        size: 'medium',
        position: { x: 0, y: 2 },
        settings: { quoteCategory: 'general', showAuthor: true, autoRefresh: true },
        isVisible: true,
        isResizable: true,
        isDraggable: true
      }
    ]
  }
];

export class DashboardLayoutManager {
  private static instance: DashboardLayoutManager;
  private layouts: DashboardLayout[] = [...defaultLayouts];
  private currentLayout: DashboardLayout;
  private listeners: Set<(layout: DashboardLayout) => void> = new Set();

  private constructor() {
    this.currentLayout = this.layouts[0];
    this.loadLayoutFromStorage();
  }

  public static getInstance(): DashboardLayoutManager {
    if (!DashboardLayoutManager.instance) {
      DashboardLayoutManager.instance = new DashboardLayoutManager();
    }
    return DashboardLayoutManager.instance;
  }

  private loadLayoutFromStorage() {
    if (typeof window !== 'undefined') {
      const savedLayoutId = localStorage.getItem('dashboard-layout');
      const customLayouts = localStorage.getItem('custom-layouts');
      
      if (customLayouts) {
        try {
          const parsed = JSON.parse(customLayouts);
          this.layouts = [...defaultLayouts, ...parsed];
        } catch (error) {
          console.error('Failed to load custom layouts:', error);
        }
      }
      
      if (savedLayoutId) {
        const layout = this.getLayoutById(savedLayoutId);
        if (layout) {
          this.currentLayout = layout;
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-layout', this.currentLayout.id);
      
      const customLayouts = this.layouts.filter(layout => !layout.isDefault);
      localStorage.setItem('custom-layouts', JSON.stringify(customLayouts));
    }
  }

  public getCurrentLayout(): DashboardLayout {
    return this.currentLayout;
  }

  public setCurrentLayout(layout: DashboardLayout) {
    this.currentLayout = layout;
    this.saveToStorage();
    this.notifyListeners();
  }

  public getAllLayouts(): DashboardLayout[] {
    return [...this.layouts];
  }

  public getLayoutById(id: string): DashboardLayout | undefined {
    return this.layouts.find(layout => layout.id === id);
  }

  public createLayout(layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>): DashboardLayout {
    const newLayout: DashboardLayout = {
      ...layout,
      id: `layout-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.layouts.push(newLayout);
    this.saveToStorage();
    return newLayout;
  }

  public updateLayout(id: string, updates: Partial<DashboardLayout>): void {
    const layoutIndex = this.layouts.findIndex(layout => layout.id === id);
    if (layoutIndex !== -1) {
      this.layouts[layoutIndex] = {
        ...this.layouts[layoutIndex],
        ...updates,
        updatedAt: Date.now()
      };

      if (this.currentLayout.id === id) {
        this.currentLayout = this.layouts[layoutIndex];
      }

      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public deleteLayout(id: string): void {
    const layout = this.getLayoutById(id);
    if (layout && !layout.isDefault) {
      this.layouts = this.layouts.filter(l => l.id !== id);
      
      if (this.currentLayout.id === id) {
        this.currentLayout = this.layouts[0]; // Switch to default
      }
      
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  public duplicateLayout(id: string, name?: string): DashboardLayout | null {
    const layout = this.getLayoutById(id);
    if (!layout) return null;

    return this.createLayout({
      name: name || `${layout.name} Copy`,
      description: layout.description,
      columns: layout.columns,
      widgets: layout.widgets.map(widget => ({
        ...widget,
        id: `${widget.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    });
  }

  public addWidgetToLayout(layoutId: string, widget: Omit<WidgetConfig, 'id'>): void {
    const layout = this.getLayoutById(layoutId);
    if (!layout) return;

    const newWidget: WidgetConfig = {
      ...widget,
      id: `${widget.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.updateLayout(layoutId, {
      widgets: [...layout.widgets, newWidget]
    });
  }

  public removeWidgetFromLayout(layoutId: string, widgetId: string): void {
    const layout = this.getLayoutById(layoutId);
    if (!layout) return;

    this.updateLayout(layoutId, {
      widgets: layout.widgets.filter(widget => widget.id !== widgetId)
    });
  }

  public updateWidget(layoutId: string, widgetId: string, updates: Partial<WidgetConfig>): void {
    const layout = this.getLayoutById(layoutId);
    if (!layout) return;

    const updatedWidgets = layout.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, ...updates } : widget
    );

    this.updateLayout(layoutId, { widgets: updatedWidgets });
  }

  public getAvailableWidgets(): WidgetDefinition[] {
    return [...widgetDefinitions];
  }

  public getWidgetDefinition(type: WidgetType): WidgetDefinition | undefined {
    return widgetDefinitions.find(def => def.type === type);
  }

  public addLayoutChangeListener(listener: (layout: DashboardLayout) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLayout));
  }
}

export const dashboardLayoutManager = DashboardLayoutManager.getInstance();