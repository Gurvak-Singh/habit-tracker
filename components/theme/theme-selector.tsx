"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Palette,
  Sun,
  Moon,
  Check,
  Sparkles,
  Leaf,
  Briefcase,
  Zap,
  Eye
} from 'lucide-react';
import { CustomTheme, themeManager } from '@/lib/theme-system';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  className?: string;
  onClose?: () => void;
}

const categoryIcons = {
  minimal: Eye,
  vibrant: Zap,
  nature: Leaf,
  professional: Briefcase,
  custom: Sparkles
};

const categoryLabels = {
  minimal: 'Minimal',
  vibrant: 'Vibrant',
  nature: 'Nature',
  professional: 'Professional',
  custom: 'Custom'
};

export function ThemeSelector({ className, onClose }: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(themeManager.getCurrentTheme());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(themeManager.getIsDarkMode());
  const [selectedCategory, setSelectedCategory] = useState<CustomTheme['category'] | 'all'>('all');

  useEffect(() => {
    const unsubscribe = themeManager.addThemeChangeListener((theme, isDark) => {
      setCurrentTheme(theme);
      setIsDarkMode(isDark);
    });

    return unsubscribe;
  }, []);

  const themes = themeManager.getAllThemes();
  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => theme.category === selectedCategory);

  const categories = Array.from(new Set(themes.map(theme => theme.category)));

  const handleThemeSelect = (theme: CustomTheme) => {
    themeManager.setTheme(theme);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    themeManager.setDarkMode(checked);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Palette className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Theme Settings</h2>
            <p className="text-muted-foreground">
              Customize your app's appearance
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        )}
      </div>

      {/* Current Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Theme</span>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
                id="dark-mode"
              />
              <Label htmlFor="dark-mode" className="flex items-center space-x-1">
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span>{isDarkMode ? 'Dark' : 'Light'}</span>
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-lg border-2 border-border flex items-center justify-center"
              style={{ backgroundColor: currentTheme.preview }}
            >
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{currentTheme.name}</h3>
              <p className="text-muted-foreground text-sm">{currentTheme.description}</p>
              <Badge variant="outline" className="mt-2">
                {categoryLabels[currentTheme.category]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Selection */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => {
            const Icon = categoryIcons[category];
            return (
              <TabsTrigger key={category} value={category} className="flex items-center space-x-1">
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{categoryLabels[category]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ThemeGrid themes={filteredThemes} currentTheme={currentTheme} onThemeSelect={handleThemeSelect} />
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <ThemeGrid themes={filteredThemes} currentTheme={currentTheme} onThemeSelect={handleThemeSelect} />
          </TabsContent>
        ))}
      </Tabs>

      {/* Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how the selected theme looks across different components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePreview theme={currentTheme} isDark={isDarkMode} />
        </CardContent>
      </Card>
    </div>
  );
}

function ThemeGrid({ 
  themes, 
  currentTheme, 
  onThemeSelect 
}: { 
  themes: CustomTheme[]; 
  currentTheme: CustomTheme; 
  onThemeSelect: (theme: CustomTheme) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {themes.map(theme => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={currentTheme.id === theme.id}
          onSelect={() => onThemeSelect(theme)}
        />
      ))}
    </div>
  );
}

function ThemeCard({ 
  theme, 
  isSelected, 
  onSelect 
}: { 
  theme: CustomTheme; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  const Icon = categoryIcons[theme.category];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:scale-105",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Color Preview */}
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.preview }}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <Icon className="w-3 h-3 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[theme.category]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Theme Info */}
          <div>
            <h4 className="font-medium text-sm text-foreground">{theme.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {theme.description}
            </p>
          </div>

          {/* Color Palette Preview */}
          <div className="flex space-x-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.light.primary }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.light.secondary }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.light.accent }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: theme.colors.light.muted }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ThemePreview({ theme, isDark }: { theme: CustomTheme; isDark: boolean }) {
  const colors = isDark ? theme.colors.dark : theme.colors.light;

  return (
    <div 
      className="p-6 rounded-lg border space-y-4"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border,
        color: colors.foreground
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: colors.foreground }}>
          TrackMyHabits
        </h3>
        <div 
          className="px-3 py-1 rounded-md text-sm font-medium"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.primaryForeground
          }}
        >
          Premium
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border
          }}
        >
          <h4 className="font-medium mb-2" style={{ color: colors.cardForeground }}>
            Exercise Daily
          </h4>
          <p className="text-sm" style={{ color: colors.mutedForeground }}>
            30 minutes of physical activity
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.success }}
            />
            <span className="text-xs" style={{ color: colors.mutedForeground }}>
              7 day streak
            </span>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: colors.card,
            borderColor: colors.border
          }}
        >
          <h4 className="font-medium mb-2" style={{ color: colors.cardForeground }}>
            Read Books
          </h4>
          <p className="text-sm" style={{ color: colors.mutedForeground }}>
            Read for 20 minutes daily
          </p>
          <div className="flex items-center space-x-2 mt-3">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.warning }}
            />
            <span className="text-xs" style={{ color: colors.mutedForeground }}>
              3 day streak
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-2">
        <button
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.primaryForeground
          }}
        >
          Add Habit
        </button>
        <button
          className="px-4 py-2 rounded-md text-sm font-medium border"
          style={{ 
            backgroundColor: colors.secondary,
            color: colors.secondaryForeground,
            borderColor: colors.border
          }}
        >
          View Analytics
        </button>
      </div>
    </div>
  );
}