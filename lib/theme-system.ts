"use client";

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  preview: string; // Preview color
  category: 'minimal' | 'vibrant' | 'nature' | 'professional' | 'custom';
  author?: string;
  isDefault?: boolean;
}

export const defaultThemes: CustomTheme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and modern default theme',
    preview: '#3B82F6',
    category: 'minimal',
    isDefault: true,
    colors: {
      light: {
        primary: '#3B82F6',
        primaryForeground: '#FFFFFF',
        secondary: '#F1F5F9',
        secondaryForeground: '#0F172A',
        accent: '#F1F5F9',
        accentForeground: '#0F172A',
        background: '#FFFFFF',
        foreground: '#0F172A',
        card: '#FFFFFF',
        cardForeground: '#0F172A',
        popover: '#FFFFFF',
        popoverForeground: '#0F172A',
        muted: '#F1F5F9',
        mutedForeground: '#64748B',
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#3B82F6',
        destructive: '#EF4444',
        destructiveForeground: '#FFFFFF',
        success: '#10B981',
        successForeground: '#FFFFFF',
        warning: '#F59E0B',
        warningForeground: '#FFFFFF',
        info: '#3B82F6',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#3B82F6',
        primaryForeground: '#F8FAFC',
        secondary: '#1E293B',
        secondaryForeground: '#F8FAFC',
        accent: '#1E293B',
        accentForeground: '#F8FAFC',
        background: '#020617',
        foreground: '#F8FAFC',
        card: '#020617',
        cardForeground: '#F8FAFC',
        popover: '#020617',
        popoverForeground: '#F8FAFC',
        muted: '#1E293B',
        mutedForeground: '#94A3B8',
        border: '#1E293B',
        input: '#1E293B',
        ring: '#3B82F6',
        destructive: '#EF4444',
        destructiveForeground: '#F8FAFC',
        success: '#10B981',
        successForeground: '#F8FAFC',
        warning: '#F59E0B',
        warningForeground: '#F8FAFC',
        info: '#3B82F6',
        infoForeground: '#F8FAFC'
      }
    }
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Calming nature-inspired green theme',
    preview: '#059669',
    category: 'nature',
    colors: {
      light: {
        primary: '#059669',
        primaryForeground: '#FFFFFF',
        secondary: '#F0FDF4',
        secondaryForeground: '#14532D',
        accent: '#DCFCE7',
        accentForeground: '#14532D',
        background: '#FFFFFF',
        foreground: '#14532D',
        card: '#FFFFFF',
        cardForeground: '#14532D',
        popover: '#FFFFFF',
        popoverForeground: '#14532D',
        muted: '#F0FDF4',
        mutedForeground: '#15803D',
        border: '#BBF7D0',
        input: '#BBF7D0',
        ring: '#059669',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        success: '#059669',
        successForeground: '#FFFFFF',
        warning: '#D97706',
        warningForeground: '#FFFFFF',
        info: '#0284C7',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#10B981',
        primaryForeground: '#F0FDF4',
        secondary: '#14532D',
        secondaryForeground: '#F0FDF4',
        accent: '#166534',
        accentForeground: '#F0FDF4',
        background: '#0F172A',
        foreground: '#F0FDF4',
        card: '#14532D',
        cardForeground: '#F0FDF4',
        popover: '#14532D',
        popoverForeground: '#F0FDF4',
        muted: '#166534',
        mutedForeground: '#86EFAC',
        border: '#166534',
        input: '#166534',
        ring: '#10B981',
        destructive: '#EF4444',
        destructiveForeground: '#F0FDF4',
        success: '#10B981',
        successForeground: '#F0FDF4',
        warning: '#F59E0B',
        warningForeground: '#F0FDF4',
        info: '#0EA5E9',
        infoForeground: '#F0FDF4'
      }
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Deep ocean-inspired blue theme',
    preview: '#0EA5E9',
    category: 'nature',
    colors: {
      light: {
        primary: '#0EA5E9',
        primaryForeground: '#FFFFFF',
        secondary: '#F0F9FF',
        secondaryForeground: '#0C4A6E',
        accent: '#E0F2FE',
        accentForeground: '#0C4A6E',
        background: '#FFFFFF',
        foreground: '#0C4A6E',
        card: '#FFFFFF',
        cardForeground: '#0C4A6E',
        popover: '#FFFFFF',
        popoverForeground: '#0C4A6E',
        muted: '#F0F9FF',
        mutedForeground: '#0369A1',
        border: '#BAE6FD',
        input: '#BAE6FD',
        ring: '#0EA5E9',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        success: '#059669',
        successForeground: '#FFFFFF',
        warning: '#D97706',
        warningForeground: '#FFFFFF',
        info: '#0EA5E9',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#38BDF8',
        primaryForeground: '#F0F9FF',
        secondary: '#0C4A6E',
        secondaryForeground: '#F0F9FF',
        accent: '#075985',
        accentForeground: '#F0F9FF',
        background: '#020617',
        foreground: '#F0F9FF',
        card: '#0C4A6E',
        cardForeground: '#F0F9FF',
        popover: '#0C4A6E',
        popoverForeground: '#F0F9FF',
        muted: '#075985',
        mutedForeground: '#7DD3FC',
        border: '#075985',
        input: '#075985',
        ring: '#38BDF8',
        destructive: '#EF4444',
        destructiveForeground: '#F0F9FF',
        success: '#10B981',
        successForeground: '#F0F9FF',
        warning: '#F59E0B',
        warningForeground: '#F0F9FF',
        info: '#38BDF8',
        infoForeground: '#F0F9FF'
      }
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    description: 'Warm sunset-inspired orange theme',
    preview: '#EA580C',
    category: 'vibrant',
    colors: {
      light: {
        primary: '#EA580C',
        primaryForeground: '#FFFFFF',
        secondary: '#FFF7ED',
        secondaryForeground: '#9A3412',
        accent: '#FFEDD5',
        accentForeground: '#9A3412',
        background: '#FFFFFF',
        foreground: '#9A3412',
        card: '#FFFFFF',
        cardForeground: '#9A3412',
        popover: '#FFFFFF',
        popoverForeground: '#9A3412',
        muted: '#FFF7ED',
        mutedForeground: '#C2410C',
        border: '#FED7AA',
        input: '#FED7AA',
        ring: '#EA580C',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        success: '#059669',
        successForeground: '#FFFFFF',
        warning: '#D97706',
        warningForeground: '#FFFFFF',
        info: '#0284C7',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#FB923C',
        primaryForeground: '#FFF7ED',
        secondary: '#9A3412',
        secondaryForeground: '#FFF7ED',
        accent: '#C2410C',
        accentForeground: '#FFF7ED',
        background: '#0F172A',
        foreground: '#FFF7ED',
        card: '#9A3412',
        cardForeground: '#FFF7ED',
        popover: '#9A3412',
        popoverForeground: '#FFF7ED',
        muted: '#C2410C',
        mutedForeground: '#FDBA74',
        border: '#C2410C',
        input: '#C2410C',
        ring: '#FB923C',
        destructive: '#EF4444',
        destructiveForeground: '#FFF7ED',
        success: '#10B981',
        successForeground: '#FFF7ED',
        warning: '#F59E0B',
        warningForeground: '#FFF7ED',
        info: '#0EA5E9',
        infoForeground: '#FFF7ED'
      }
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    description: 'Elegant purple theme for productivity',
    preview: '#7C3AED',
    category: 'professional',
    colors: {
      light: {
        primary: '#7C3AED',
        primaryForeground: '#FFFFFF',
        secondary: '#FAF5FF',
        secondaryForeground: '#581C87',
        accent: '#F3E8FF',
        accentForeground: '#581C87',
        background: '#FFFFFF',
        foreground: '#581C87',
        card: '#FFFFFF',
        cardForeground: '#581C87',
        popover: '#FFFFFF',
        popoverForeground: '#581C87',
        muted: '#FAF5FF',
        mutedForeground: '#7C2D92',
        border: '#DDD6FE',
        input: '#DDD6FE',
        ring: '#7C3AED',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        success: '#059669',
        successForeground: '#FFFFFF',
        warning: '#D97706',
        warningForeground: '#FFFFFF',
        info: '#0284C7',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#A855F7',
        primaryForeground: '#FAF5FF',
        secondary: '#581C87',
        secondaryForeground: '#FAF5FF',
        accent: '#7C2D92',
        accentForeground: '#FAF5FF',
        background: '#0F172A',
        foreground: '#FAF5FF',
        card: '#581C87',
        cardForeground: '#FAF5FF',
        popover: '#581C87',
        popoverForeground: '#FAF5FF',
        muted: '#7C2D92',
        mutedForeground: '#C4B5FD',
        border: '#7C2D92',
        input: '#7C2D92',
        ring: '#A855F7',
        destructive: '#EF4444',
        destructiveForeground: '#FAF5FF',
        success: '#10B981',
        successForeground: '#FAF5FF',
        warning: '#F59E0B',
        warningForeground: '#FAF5FF',
        info: '#0EA5E9',
        infoForeground: '#FAF5FF'
      }
    }
  },
  {
    id: 'rose',
    name: 'Rose Pink',
    description: 'Soft rose theme with modern elegance',
    preview: '#E11D48',
    category: 'vibrant',
    colors: {
      light: {
        primary: '#E11D48',
        primaryForeground: '#FFFFFF',
        secondary: '#FFF1F2',
        secondaryForeground: '#881337',
        accent: '#FFE4E6',
        accentForeground: '#881337',
        background: '#FFFFFF',
        foreground: '#881337',
        card: '#FFFFFF',
        cardForeground: '#881337',
        popover: '#FFFFFF',
        popoverForeground: '#881337',
        muted: '#FFF1F2',
        mutedForeground: '#BE123C',
        border: '#FECDD3',
        input: '#FECDD3',
        ring: '#E11D48',
        destructive: '#DC2626',
        destructiveForeground: '#FFFFFF',
        success: '#059669',
        successForeground: '#FFFFFF',
        warning: '#D97706',
        warningForeground: '#FFFFFF',
        info: '#0284C7',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#F43F5E',
        primaryForeground: '#FFF1F2',
        secondary: '#881337',
        secondaryForeground: '#FFF1F2',
        accent: '#BE123C',
        accentForeground: '#FFF1F2',
        background: '#0F172A',
        foreground: '#FFF1F2',
        card: '#881337',
        cardForeground: '#FFF1F2',
        popover: '#881337',
        popoverForeground: '#FFF1F2',
        muted: '#BE123C',
        mutedForeground: '#FDA4AF',
        border: '#BE123C',
        input: '#BE123C',
        ring: '#F43F5E',
        destructive: '#EF4444',
        destructiveForeground: '#FFF1F2',
        success: '#10B981',
        successForeground: '#FFF1F2',
        warning: '#F59E0B',
        warningForeground: '#FFF1F2',
        info: '#0EA5E9',
        infoForeground: '#FFF1F2'
      }
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    description: 'Ultra-clean minimal grayscale theme',
    preview: '#6B7280',
    category: 'minimal',
    colors: {
      light: {
        primary: '#374151',
        primaryForeground: '#FFFFFF',
        secondary: '#F9FAFB',
        secondaryForeground: '#111827',
        accent: '#F3F4F6',
        accentForeground: '#111827',
        background: '#FFFFFF',
        foreground: '#111827',
        card: '#FFFFFF',
        cardForeground: '#111827',
        popover: '#FFFFFF',
        popoverForeground: '#111827',
        muted: '#F9FAFB',
        mutedForeground: '#6B7280',
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#374151',
        destructive: '#EF4444',
        destructiveForeground: '#FFFFFF',
        success: '#10B981',
        successForeground: '#FFFFFF',
        warning: '#F59E0B',
        warningForeground: '#FFFFFF',
        info: '#6B7280',
        infoForeground: '#FFFFFF'
      },
      dark: {
        primary: '#9CA3AF',
        primaryForeground: '#111827',
        secondary: '#374151',
        secondaryForeground: '#F9FAFB',
        accent: '#4B5563',
        accentForeground: '#F9FAFB',
        background: '#111827',
        foreground: '#F9FAFB',
        card: '#1F2937',
        cardForeground: '#F9FAFB',
        popover: '#1F2937',
        popoverForeground: '#F9FAFB',
        muted: '#374151',
        mutedForeground: '#9CA3AF',
        border: '#374151',
        input: '#374151',
        ring: '#9CA3AF',
        destructive: '#EF4444',
        destructiveForeground: '#F9FAFB',
        success: '#10B981',
        successForeground: '#F9FAFB',
        warning: '#F59E0B',
        warningForeground: '#F9FAFB',
        info: '#9CA3AF',
        infoForeground: '#F9FAFB'
      }
    }
  }
];

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: CustomTheme;
  private isDarkMode: boolean = false;
  private listeners: Set<(theme: CustomTheme, isDark: boolean) => void> = new Set();

  private constructor() {
    this.currentTheme = defaultThemes[0];
    this.loadThemeFromStorage();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  private loadThemeFromStorage() {
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem('selected-theme');
      const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
      
      if (savedThemeId) {
        const theme = this.getThemeById(savedThemeId);
        if (theme) {
          this.currentTheme = theme;
        }
      }
      
      this.isDarkMode = savedDarkMode;
      this.applyTheme();
    }
  }

  public setTheme(theme: CustomTheme) {
    this.currentTheme = theme;
    this.saveThemeToStorage();
    this.applyTheme();
    this.notifyListeners();
  }

  public setDarkMode(isDark: boolean) {
    this.isDarkMode = isDark;
    this.saveThemeToStorage();
    this.applyTheme();
    this.notifyListeners();
  }

  public toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode);
  }

  private saveThemeToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-theme', this.currentTheme.id);
      localStorage.setItem('dark-mode', this.isDarkMode.toString());
    }
  }

  private applyTheme() {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const colors = this.isDarkMode ? this.currentTheme.colors.dark : this.currentTheme.colors.light;

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      const cssKey = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssKey, value);
    });

    // Update body class for dark mode
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  public getCurrentTheme(): CustomTheme {
    return this.currentTheme;
  }

  public getIsDarkMode(): boolean {
    return this.isDarkMode;
  }

  public getAllThemes(): CustomTheme[] {
    return [...defaultThemes];
  }

  public getThemeById(id: string): CustomTheme | undefined {
    return defaultThemes.find(theme => theme.id === id);
  }

  public getThemesByCategory(category: CustomTheme['category']): CustomTheme[] {
    return defaultThemes.filter(theme => theme.category === category);
  }

  public createCustomTheme(theme: Omit<CustomTheme, 'id'>): CustomTheme {
    const customTheme: CustomTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      category: 'custom'
    };

    // In a real app, you'd save this to a database or localStorage
    // For now, we'll just return it
    return customTheme;
  }

  public addThemeChangeListener(listener: (theme: CustomTheme, isDark: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentTheme, this.isDarkMode));
  }

  // Helper method to get current color values
  public getCurrentColors(): ThemeColors {
    return this.isDarkMode ? this.currentTheme.colors.dark : this.currentTheme.colors.light;
  }

  // Method to generate CSS variables string
  public getCSSVariables(): string {
    const colors = this.getCurrentColors();
    return Object.entries(colors)
      .map(([key, value]) => {
        const cssKey = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        return `${cssKey}: ${value};`;
      })
      .join('\n');
  }
}

export const themeManager = ThemeManager.getInstance();