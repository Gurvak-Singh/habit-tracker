"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Achievement, Milestone } from "@/lib/goals";
import { AchievementBadge } from "./achievement-badge";
import { getIconComponent } from "./icon-picker";
import { Sparkles, TrendingUp, CheckCircle } from "lucide-react";

interface CelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'achievement' | 'milestone' | 'streak' | 'goal';
  data?: {
    achievement?: Achievement;
    milestone?: Milestone;
    streak?: number;
    habitName?: string;
    habitColor?: string;
    goalName?: string;
  };
  autoCloseDelay?: number;
}

export function ProgressCelebration({
  isVisible,
  onClose,
  type,
  data = {},
  autoCloseDelay = 5000
}: CelebrationProps) {
  const [mounted, setMounted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setAnimationPhase('enter');
    
    // Transition to celebrate phase
    const celebrateTimeout = setTimeout(() => {
      setAnimationPhase('celebrate');
    }, 500);

    // Auto close if specified
    let closeTimeout: NodeJS.Timeout;
    if (autoCloseDelay > 0) {
      closeTimeout = setTimeout(() => {
        setAnimationPhase('exit');
        setTimeout(onClose, 500);
      }, autoCloseDelay);
    }

    return () => {
      clearTimeout(celebrateTimeout);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [isVisible, autoCloseDelay, onClose]);

  if (!mounted || !isVisible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setAnimationPhase('exit');
      setTimeout(onClose, 500);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'achievement':
        return renderAchievement();
      case 'milestone':
        return renderMilestone();
      case 'streak':
        return renderStreak();
      case 'goal':
        return renderGoal();
      default:
        return null;
    }
  };

  const renderAchievement = () => {
    const { achievement } = data;
    if (!achievement) return null;

    return (
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🎉 Achievement Unlocked! 🎉
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            You've reached an incredible milestone!
          </p>
        </div>
        
        <div className="mb-8">
          <AchievementBadge
            achievement={achievement}
            size="lg"
            showTitle={true}
            showDescription={true}
            unlocked={true}
            className="transform scale-110"
          />
        </div>

        <div className="space-y-4">
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            Keep up the amazing work!
          </p>
          <button
            onClick={() => {
              setAnimationPhase('exit');
              setTimeout(onClose, 500);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Awesome!
          </button>
        </div>
      </div>
    );
  };

  const renderMilestone = () => {
    const { milestone, habitName, habitColor = '#3B82F6' } = data;
    if (!milestone) return null;

    return (
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🎯 Milestone Reached! 🎯
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            You've hit an important checkpoint!
          </p>
        </div>
        
        <div className="mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transform scale-110"
            style={{ backgroundColor: `${habitColor}20` }}
          >
            <TrendingUp 
              className="w-12 h-12"
              style={{ color: habitColor }}
            />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {milestone.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {milestone.description}
          </p>
          
          <div className="text-lg font-semibold" style={{ color: habitColor }}>
            {milestone.targetValue} {milestone.targetUnit}
          </div>
          {habitName && (
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              for "{habitName}"
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            You're making incredible progress!
          </p>
          <button
            onClick={() => {
              setAnimationPhase('exit');
              setTimeout(onClose, 500);
            }}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Keep Going!
          </button>
        </div>
      </div>
    );
  };

  const renderStreak = () => {
    const { streak, habitName, habitColor = '#3B82F6' } = data;
    if (!streak) return null;

    const getStreakMessage = (days: number) => {
      if (days >= 100) return "You're a legend! 🌟";
      if (days >= 30) return "Incredible dedication! 💪";
      if (days >= 21) return "Habit formed! 🧠";
      if (days >= 7) return "One week strong! 📅";
      return "Building momentum! 🚀";
    };

    return (
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🔥 Streak Milestone! 🔥
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Your consistency is paying off!
          </p>
        </div>
        
        <div className="mb-8">
          <div className="relative mb-6">
            <div className="text-8xl mb-4 animate-pulse">🔥</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-white mix-blend-difference">
                {streak}
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {streak} Day Streak!
          </h3>
          {habitName && (
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {habitName}
            </p>
          )}
          
          <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
            {getStreakMessage(streak)}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            Don't break the chain!
          </p>
          <button
            onClick={() => {
              setAnimationPhase('exit');
              setTimeout(onClose, 500);
            }}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Keep the Fire Burning!
          </button>
        </div>
      </div>
    );
  };

  const renderGoal = () => {
    const { goalName, habitName, habitColor = '#3B82F6' } = data;
    if (!goalName) return null;

    return (
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🎯 Goal Achieved! 🎯
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            You've reached your target!
          </p>
        </div>
        
        <div className="mb-8">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transform scale-110"
            style={{ backgroundColor: `${habitColor}20` }}
          >
            <CheckCircle 
              className="w-12 h-12"
              style={{ color: habitColor }}
            />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {goalName}
          </h3>
          {habitName && (
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              for "{habitName}"
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
            Time to set your next goal!
          </p>
          <button
            onClick={() => {
              setAnimationPhase('exit');
              setTimeout(onClose, 500);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Set New Goal
          </button>
        </div>
      </div>
    );
  };

  const content = (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-sm transition-all duration-500",
        animationPhase === 'enter' && "animate-in fade-in duration-500",
        animationPhase === 'exit' && "animate-out fade-out duration-500"
      )}
      onClick={handleBackdropClick}
    >
      {/* Celebration Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {animationPhase === 'celebrate' && (
          <>
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              >
                <Sparkles 
                  className="w-4 h-4 text-yellow-400 opacity-70"
                  style={{
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              </div>
            ))}
            
            {/* Corner confetti */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-8 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-6 left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping animation-delay-300"></div>
          </>
        )}
      </div>
      
      {/* Main Content */}
      <div 
        className={cn(
          "relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md mx-auto text-center",
          "shadow-2xl border border-slate-200 dark:border-slate-700",
          "transition-all duration-500 transform",
          animationPhase === 'enter' && "animate-in zoom-in-95 slide-in-from-bottom-4 duration-500",
          animationPhase === 'celebrate' && "scale-100",
          animationPhase === 'exit' && "animate-out zoom-out-95 slide-out-to-top-4 duration-500"
        )}
        onClick={e => e.stopPropagation()}
      >
        {renderContent()}
        
        {/* Subtle close hint */}
        <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 text-xs">
          Click outside to close
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

// Hook for managing celebration state
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    isVisible: boolean;
    type: 'achievement' | 'milestone' | 'streak' | 'goal';
    data?: any;
  }>({
    isVisible: false,
    type: 'achievement'
  });

  const showCelebration = (
    type: 'achievement' | 'milestone' | 'streak' | 'goal', 
    data?: any
  ) => {
    setCelebration({
      isVisible: true,
      type,
      data
    });
  };

  const hideCelebration = () => {
    setCelebration(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    celebration,
    showCelebration,
    hideCelebration
  };
}