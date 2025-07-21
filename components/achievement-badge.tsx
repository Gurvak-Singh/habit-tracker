"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getIconComponent } from "@/components/icon-picker";
import { Achievement } from "@/lib/goals";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  showDescription?: boolean;
  unlocked?: boolean;
  className?: string;
  onClick?: () => void;
}

const rarityStyles = {
  common: {
    border: 'border-slate-300 dark:border-slate-600',
    background: 'bg-slate-50 dark:bg-slate-800',
    glow: 'shadow-slate-200 dark:shadow-slate-700',
    text: 'text-slate-700 dark:text-slate-300'
  },
  rare: {
    border: 'border-blue-300 dark:border-blue-600',
    background: 'bg-blue-50 dark:bg-blue-900/20',
    glow: 'shadow-blue-200 dark:shadow-blue-700',
    text: 'text-blue-700 dark:text-blue-300'
  },
  epic: {
    border: 'border-purple-300 dark:border-purple-600',
    background: 'bg-purple-50 dark:bg-purple-900/20',
    glow: 'shadow-purple-200 dark:shadow-purple-700',
    text: 'text-purple-700 dark:text-purple-300'
  },
  legendary: {
    border: 'border-yellow-400 dark:border-yellow-500',
    background: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
    glow: 'shadow-yellow-300 dark:shadow-yellow-600',
    text: 'text-yellow-800 dark:text-yellow-300'
  }
};

const sizeStyles = {
  sm: {
    card: 'w-16 h-16',
    icon: 'w-6 h-6',
    sparkle: 'w-3 h-3',
    title: 'text-xs',
    description: 'text-xs'
  },
  md: {
    card: 'w-20 h-20',
    icon: 'w-8 h-8',
    sparkle: 'w-4 h-4',
    title: 'text-sm',
    description: 'text-xs'
  },
  lg: {
    card: 'w-24 h-24',
    icon: 'w-10 h-10',
    sparkle: 'w-5 h-5',
    title: 'text-base',
    description: 'text-sm'
  }
};

export function AchievementBadge({
  achievement,
  size = 'md',
  showTitle = false,
  showDescription = false,
  unlocked = true,
  className = '',
  onClick
}: AchievementBadgeProps) {
  const IconComponent = getIconComponent(achievement.badgeIcon);
  const rarity = rarityStyles[achievement.rarity];
  const sizeStyle = sizeStyles[size];
  
  const isClickable = !!onClick;

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {/* Badge Card */}
      <Card
        className={cn(
          sizeStyle.card,
          "relative overflow-hidden transition-all duration-300",
          rarity.border,
          rarity.background,
          unlocked ? rarity.glow : 'opacity-50 grayscale',
          unlocked && achievement.rarity === 'legendary' ? 'animate-pulse' : '',
          isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : '',
          isClickable && unlocked ? 'hover:shadow-2xl' : ''
        )}
        onClick={onClick}
      >
        <CardContent className="p-0 h-full flex items-center justify-center relative">
          {/* Rarity indicator */}
          {unlocked && achievement.rarity !== 'common' && (
            <div className="absolute top-1 right-1">
              <Sparkles 
                className={cn(sizeStyle.sparkle, rarity.text)} 
                style={{ color: achievement.badgeColor }}
              />
            </div>
          )}
          
          {/* Main icon */}
          <IconComponent
            className={cn(
              sizeStyle.icon,
              unlocked ? 'text-current' : 'text-slate-400 dark:text-slate-600'
            )}
            style={{ 
              color: unlocked ? achievement.badgeColor : undefined 
            }}
          />
          
          {/* Legendary sparkle animation overlay */}
          {unlocked && achievement.rarity === 'legendary' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 right-3 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute top-1/2 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-600"></div>
            </div>
          )}
          
          {/* Lock overlay for unlocked badges */}
          {!unlocked && (
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-80 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-400 dark:border-slate-600 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Badge info */}
      {showTitle && (
        <div className="text-center">
          <h4 className={cn(
            sizeStyle.title,
            "font-semibold",
            unlocked ? rarity.text : 'text-slate-500 dark:text-slate-500'
          )}>
            {achievement.title}
          </h4>
          
          {showDescription && (
            <p className={cn(
              sizeStyle.description,
              "mt-1 text-slate-500 dark:text-slate-400"
            )}>
              {achievement.description}
            </p>
          )}
          
          {/* Rarity badge */}
          <Badge 
            variant="secondary" 
            className={cn(
              "mt-1 text-xs capitalize",
              achievement.rarity === 'common' && 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              achievement.rarity === 'rare' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
              achievement.rarity === 'epic' && 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
              achievement.rarity === 'legendary' && 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900 dark:to-orange-900 dark:text-yellow-300'
            )}
          >
            {achievement.rarity}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Component for displaying a grid of achievement badges
interface AchievementGridProps {
  achievements: Achievement[];
  unlockedIds?: string[];
  onBadgeClick?: (achievement: Achievement) => void;
  className?: string;
}

export function AchievementGrid({ 
  achievements, 
  unlockedIds = [], 
  onBadgeClick,
  className = ''
}: AchievementGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4",
      className
    )}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size="md"
          showTitle={true}
          unlocked={unlockedIds.includes(achievement.id)}
          onClick={onBadgeClick ? () => onBadgeClick(achievement) : undefined}
        />
      ))}
    </div>
  );
}

// Component for celebration overlay when achievement is unlocked
interface AchievementCelebrationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementCelebration({
  achievement,
  isVisible,
  onClose
}: AchievementCelebrationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-4 text-center relative overflow-hidden"
        onClick={onClose}
      >
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-bounce animation-delay-300"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            🎉 Achievement Unlocked! 🎉
          </h2>
          
          <AchievementBadge
            achievement={achievement}
            size="lg"
            showTitle={true}
            showDescription={true}
            unlocked={true}
            className="mb-4"
          />
          
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Congratulations on reaching this milestone!
          </p>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}