"use client";

import { Habit, HabitCompletion } from './storage';

// Advanced analytics data structures
export interface HabitCorrelation {
  habit1Id: string;
  habit1Name: string;
  habit2Id: string;
  habit2Name: string;
  correlationCoefficient: number; // -1 to 1
  significance: 'high' | 'moderate' | 'low' | 'none';
  relationship: 'positive' | 'negative' | 'neutral';
  sampleSize: number;
  confidenceLevel: number;
}

export interface ProductivityPattern {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  pattern: string;
  description: string;
  habits: string[]; // habit IDs involved
  strength: number; // 0-1
  frequency: number; // how often this pattern occurs
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  detectedAt: number;
}

export interface HabitInsight {
  habitId: string;
  habitName: string;
  type: 'streak_prediction' | 'optimal_timing' | 'completion_trend' | 'difficulty_analysis';
  insight: string;
  confidence: number; // 0-1
  dataPoints: number;
  actionable: boolean;
  recommendation?: string;
  chartData?: any[];
}

export interface ComparativeAnalytics {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  habits: {
    habitId: string;
    habitName: string;
    completionRate: number;
    streakAverage: number;
    consistency: number;
    trend: 'improving' | 'declining' | 'stable';
    score: number; // 0-100
  }[];
  topPerformer: string;
  needsAttention: string[];
  overallScore: number;
  insights: string[];
}

export interface AnalyticsReport {
  id: string;
  title: string;
  generatedAt: number;
  timeframe: { start: number; end: number };
  habits: string[];
  sections: {
    correlations: HabitCorrelation[];
    patterns: ProductivityPattern[];
    insights: HabitInsight[];
    comparative: ComparativeAnalytics;
  };
  summary: string;
  recommendations: string[];
  shareableLink?: string;
}

// Advanced Analytics Engine
export class AdvancedAnalyticsEngine {
  private static instance: AdvancedAnalyticsEngine;

  private constructor() {}

  public static getInstance(): AdvancedAnalyticsEngine {
    if (!AdvancedAnalyticsEngine.instance) {
      AdvancedAnalyticsEngine.instance = new AdvancedAnalyticsEngine();
    }
    return AdvancedAnalyticsEngine.instance;
  }

  // Correlation Analysis
  calculateHabitCorrelations(habits: Habit[], timeframedays: number = 90): HabitCorrelation[] {
    const correlations: HabitCorrelation[] = [];
    const cutoffDate = Date.now() - (timeframedays * 24 * 60 * 60 * 1000);

    // Compare each habit with every other habit
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const habit1 = habits[i];
        const habit2 = habits[j];

        const correlation = this.calculatePearsonCorrelation(
          habit1, habit2, cutoffDate
        );

        if (correlation.sampleSize >= 10) { // Minimum sample size for meaningful correlation
          correlations.push(correlation);
        }
      }
    }

    return correlations.sort((a, b) => Math.abs(b.correlationCoefficient) - Math.abs(a.correlationCoefficient));
  }

  private calculatePearsonCorrelation(habit1: Habit, habit2: Habit, cutoffDate: number): HabitCorrelation {
    // Get completion data for both habits within timeframe
    const habit1Data = this.getCompletionSeries(habit1, cutoffDate);
    const habit2Data = this.getCompletionSeries(habit2, cutoffDate);

    // Find common dates
    const commonDates = habit1Data.filter(d1 => 
      habit2Data.some(d2 => d1.date === d2.date)
    ).map(d => d.date);

    if (commonDates.length < 10) {
      return {
        habit1Id: habit1.id,
        habit1Name: habit1.name,
        habit2Id: habit2.id,
        habit2Name: habit2.name,
        correlationCoefficient: 0,
        significance: 'none',
        relationship: 'neutral',
        sampleSize: commonDates.length,
        confidenceLevel: 0
      };
    }

    // Calculate correlation coefficient
    const pairs = commonDates.map(date => ({
      x: habit1Data.find(d => d.date === date)?.completed ? 1 : 0,
      y: habit2Data.find(d => d.date === date)?.completed ? 1 : 0
    }));

    const n = pairs.length;
    const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
    const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
    const sumXY = pairs.reduce((sum, pair) => sum + pair.x * pair.y, 0);
    const sumX2 = pairs.reduce((sum, pair) => sum + pair.x * pair.x, 0);
    const sumY2 = pairs.reduce((sum, pair) => sum + pair.y * pair.y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    const r = denominator === 0 ? 0 : numerator / denominator;
    
    // Determine significance and relationship
    const absR = Math.abs(r);
    let significance: 'high' | 'moderate' | 'low' | 'none';
    if (absR >= 0.7) significance = 'high';
    else if (absR >= 0.5) significance = 'moderate';
    else if (absR >= 0.3) significance = 'low';
    else significance = 'none';

    const relationship = r > 0.1 ? 'positive' : r < -0.1 ? 'negative' : 'neutral';
    const confidenceLevel = this.calculateConfidenceLevel(r, n);

    return {
      habit1Id: habit1.id,
      habit1Name: habit1.name,
      habit2Id: habit2.id,
      habit2Name: habit2.name,
      correlationCoefficient: Math.round(r * 1000) / 1000,
      significance,
      relationship,
      sampleSize: n,
      confidenceLevel: Math.round(confidenceLevel * 100) / 100
    };
  }

  private getCompletionSeries(habit: Habit, cutoffDate: number): { date: string; completed: boolean }[] {
    return habit.completions
      .filter(completion => {
        const completionTime = new Date(completion.date).getTime();
        return completionTime >= cutoffDate;
      })
      .map(completion => ({
        date: completion.date,
        completed: completion.completed
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateConfidenceLevel(r: number, n: number): number {
    // Simplified confidence calculation
    const t = r * Math.sqrt((n - 2) / (1 - r * r));
    const absT = Math.abs(t);
    
    if (absT >= 2.576) return 0.99; // 99% confidence
    if (absT >= 1.96) return 0.95;  // 95% confidence
    if (absT >= 1.645) return 0.90; // 90% confidence
    if (absT >= 1.282) return 0.80; // 80% confidence
    return 0.50; // 50% confidence
  }

  // Pattern Recognition
  detectProductivityPatterns(habits: Habit[], timeframeDays: number = 90): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = [];
    const cutoffDate = Date.now() - (timeframeDays * 24 * 60 * 60 * 1000);

    // Detect different types of patterns
    patterns.push(...this.detectDailyPatterns(habits, cutoffDate));
    patterns.push(...this.detectWeeklyPatterns(habits, cutoffDate));
    patterns.push(...this.detectStreakPatterns(habits, cutoffDate));
    patterns.push(...this.detectClusterPatterns(habits, cutoffDate));

    return patterns.sort((a, b) => b.strength - a.strength);
  }

  private detectDailyPatterns(habits: Habit[], cutoffDate: number): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = [];
    const dayStats = new Map<number, { completed: number; total: number; habits: Set<string> }>();

    // Analyze completion by day of week
    habits.forEach(habit => {
      habit.completions
        .filter(c => new Date(c.date).getTime() >= cutoffDate)
        .forEach(completion => {
          const dayOfWeek = new Date(completion.date).getDay();
          if (!dayStats.has(dayOfWeek)) {
            dayStats.set(dayOfWeek, { completed: 0, total: 0, habits: new Set() });
          }
          
          const stats = dayStats.get(dayOfWeek)!;
          stats.total++;
          stats.habits.add(habit.id);
          if (completion.completed) {
            stats.completed++;
          }
        });
    });

    // Find significant daily patterns
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayStats.forEach((stats, dayOfWeek) => {
      const completionRate = stats.completed / stats.total;
      
      if (stats.total >= 10 && (completionRate >= 0.8 || completionRate <= 0.3)) {
        patterns.push({
          id: `daily_${dayOfWeek}_${Date.now()}`,
          type: 'daily',
          pattern: completionRate >= 0.8 ? 'high_performance' : 'low_performance',
          description: `${completionRate >= 0.8 ? 'High' : 'Low'} completion rate on ${dayNames[dayOfWeek]}s (${Math.round(completionRate * 100)}%)`,
          habits: Array.from(stats.habits),
          strength: Math.abs(completionRate - 0.5) * 2,
          frequency: stats.total,
          impact: completionRate >= 0.8 ? 'high' : 'medium',
          recommendation: completionRate >= 0.8 
            ? `${dayNames[dayOfWeek]}s are your strongest days - consider adding challenging habits`
            : `Focus extra attention on ${dayNames[dayOfWeek]}s - try lighter habits or better scheduling`,
          detectedAt: Date.now()
        });
      }
    });

    return patterns;
  }

  private detectWeeklyPatterns(habits: Habit[], cutoffDate: number): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = [];
    
    // Analyze week-over-week trends
    habits.forEach(habit => {
      const weeklyData = this.groupCompletionsByWeek(habit, cutoffDate);
      const trend = this.calculateTrend(weeklyData.map(w => w.completionRate));
      
      if (Math.abs(trend) >= 0.1 && weeklyData.length >= 4) {
        patterns.push({
          id: `weekly_trend_${habit.id}_${Date.now()}`,
          type: 'weekly',
          pattern: trend > 0 ? 'improving_trend' : 'declining_trend',
          description: `${habit.name} shows ${trend > 0 ? 'improving' : 'declining'} weekly trend (${trend > 0 ? '+' : ''}${Math.round(trend * 100)}% per week)`,
          habits: [habit.id],
          strength: Math.abs(trend),
          frequency: weeklyData.length,
          impact: Math.abs(trend) >= 0.2 ? 'high' : 'medium',
          recommendation: trend > 0 
            ? `Keep up the momentum with ${habit.name}!` 
            : `${habit.name} needs attention - consider adjusting your approach`,
          detectedAt: Date.now()
        });
      }
    });

    return patterns;
  }

  private detectStreakPatterns(habits: Habit[], cutoffDate: number): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = [];
    
    habits.forEach(habit => {
      const streaks = this.findStreaks(habit, cutoffDate);
      if (streaks.length >= 3) {
        const avgStreakLength = streaks.reduce((sum, streak) => sum + streak.length, 0) / streaks.length;
        const maxStreak = Math.max(...streaks.map(s => s.length));
        
        if (avgStreakLength >= 5 || maxStreak >= 10) {
          patterns.push({
            id: `streak_pattern_${habit.id}_${Date.now()}`,
            type: 'weekly',
            pattern: 'consistent_streaks',
            description: `${habit.name} shows strong streak patterns (avg: ${Math.round(avgStreakLength)} days, max: ${maxStreak} days)`,
            habits: [habit.id],
            strength: Math.min(avgStreakLength / 10, 1),
            frequency: streaks.length,
            impact: 'high',
            recommendation: `Your streak-building skills with ${habit.name} are strong - try applying this pattern to other habits`,
            detectedAt: Date.now()
          });
        }
      }
    });

    return patterns;
  }

  private detectClusterPatterns(habits: Habit[], cutoffDate: number): ProductivityPattern[] {
    const patterns: ProductivityPattern[] = [];
    
    // Find habits that tend to be completed together
    const habitPairs = this.findHabitClusters(habits, cutoffDate);
    
    habitPairs.forEach(pair => {
      if (pair.coCompletionRate >= 0.7 && pair.occurrences >= 10) {
        patterns.push({
          id: `cluster_${pair.habit1Id}_${pair.habit2Id}_${Date.now()}`,
          type: 'daily',
          pattern: 'habit_clustering',
          description: `${pair.habit1Name} and ${pair.habit2Name} are often completed together (${Math.round(pair.coCompletionRate * 100)}% of the time)`,
          habits: [pair.habit1Id, pair.habit2Id],
          strength: pair.coCompletionRate,
          frequency: pair.occurrences,
          impact: 'medium',
          recommendation: `Consider stacking ${pair.habit1Name} and ${pair.habit2Name} as a routine`,
          detectedAt: Date.now()
        });
      }
    });

    return patterns;
  }

  private groupCompletionsByWeek(habit: Habit, cutoffDate: number) {
    const weeks: { week: string; completed: number; total: number; completionRate: number }[] = [];
    const completions = habit.completions.filter(c => new Date(c.date).getTime() >= cutoffDate);
    
    const weekGroups = new Map<string, { completed: number; total: number }>();
    
    completions.forEach(completion => {
      const date = new Date(completion.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weekGroups.has(weekKey)) {
        weekGroups.set(weekKey, { completed: 0, total: 0 });
      }
      
      const week = weekGroups.get(weekKey)!;
      week.total++;
      if (completion.completed) {
        week.completed++;
      }
    });
    
    weekGroups.forEach((stats, weekKey) => {
      weeks.push({
        week: weekKey,
        completed: stats.completed,
        total: stats.total,
        completionRate: stats.completed / stats.total
      });
    });
    
    return weeks.sort((a, b) => a.week.localeCompare(b.week));
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + index * val, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private findStreaks(habit: Habit, cutoffDate: number): { start: string; end: string; length: number }[] {
    const streaks: { start: string; end: string; length: number }[] = [];
    const completions = habit.completions
      .filter(c => new Date(c.date).getTime() >= cutoffDate && c.completed)
      .sort((a, b) => a.date.localeCompare(b.date));

    let currentStreak: { start: string; end: string; length: number } | null = null;
    
    for (let i = 0; i < completions.length; i++) {
      const current = completions[i];
      const currentDate = new Date(current.date);
      
      if (!currentStreak) {
        currentStreak = { start: current.date, end: current.date, length: 1 };
      } else {
        const lastDate = new Date(currentStreak.end);
        const diffTime = currentDate.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          // Continue streak
          currentStreak.end = current.date;
          currentStreak.length++;
        } else {
          // End current streak, start new one
          if (currentStreak.length >= 2) {
            streaks.push({ ...currentStreak });
          }
          currentStreak = { start: current.date, end: current.date, length: 1 };
        }
      }
    }
    
    // Add final streak if it exists
    if (currentStreak && currentStreak.length >= 2) {
      streaks.push(currentStreak);
    }
    
    return streaks;
  }

  private findHabitClusters(habits: Habit[], cutoffDate: number): {
    habit1Id: string;
    habit1Name: string;
    habit2Id: string;
    habit2Name: string;
    coCompletionRate: number;
    occurrences: number;
  }[] {
    const clusters: any[] = [];
    
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const habit1 = habits[i];
        const habit2 = habits[j];
        
        // Find days where both habits have entries
        const habit1Dates = new Set(habit1.completions
          .filter(c => new Date(c.date).getTime() >= cutoffDate)
          .map(c => c.date));
        
        const habit2Dates = new Set(habit2.completions
          .filter(c => new Date(c.date).getTime() >= cutoffDate)
          .map(c => c.date));
        
        const commonDates = Array.from(habit1Dates).filter(date => habit2Dates.has(date));
        
        if (commonDates.length >= 10) {
          let bothCompleted = 0;
          
          commonDates.forEach(date => {
            const habit1Completed = habit1.completions.find(c => c.date === date)?.completed || false;
            const habit2Completed = habit2.completions.find(c => c.date === date)?.completed || false;
            
            if (habit1Completed && habit2Completed) {
              bothCompleted++;
            }
          });
          
          const coCompletionRate = bothCompleted / commonDates.length;
          
          clusters.push({
            habit1Id: habit1.id,
            habit1Name: habit1.name,
            habit2Id: habit2.id,
            habit2Name: habit2.name,
            coCompletionRate,
            occurrences: commonDates.length
          });
        }
      }
    }
    
    return clusters;
  }

  // Generate Insights
  generateHabitInsights(habits: Habit[], timeframeDays: number = 90): HabitInsight[] {
    const insights: HabitInsight[] = [];
    const cutoffDate = Date.now() - (timeframeDays * 24 * 60 * 60 * 1000);

    habits.forEach(habit => {
      // Completion trend analysis
      const trendInsight = this.analyzeTrend(habit, cutoffDate);
      if (trendInsight) insights.push(trendInsight);

      // Optimal timing analysis
      const timingInsight = this.analyzeOptimalTiming(habit, cutoffDate);
      if (timingInsight) insights.push(timingInsight);

      // Difficulty analysis
      const difficultyInsight = this.analyzeDifficulty(habit, cutoffDate);
      if (difficultyInsight) insights.push(difficultyInsight);

      // Streak prediction
      const streakInsight = this.predictStreaks(habit, cutoffDate);
      if (streakInsight) insights.push(streakInsight);
    });

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private analyzeTrend(habit: Habit, cutoffDate: number): HabitInsight | null {
    const weeklyData = this.groupCompletionsByWeek(habit, cutoffDate);
    if (weeklyData.length < 4) return null;

    const trend = this.calculateTrend(weeklyData.map(w => w.completionRate));
    const confidence = Math.min(Math.abs(trend) * 2, 0.9);

    if (Math.abs(trend) >= 0.05) {
      return {
        habitId: habit.id,
        habitName: habit.name,
        type: 'completion_trend',
        insight: trend > 0 
          ? `Your ${habit.name} completion rate is improving by ${Math.round(trend * 100)}% per week`
          : `Your ${habit.name} completion rate is declining by ${Math.round(Math.abs(trend) * 100)}% per week`,
        confidence,
        dataPoints: weeklyData.length,
        actionable: true,
        recommendation: trend > 0 
          ? "Keep up the great momentum!"
          : "Consider adjusting your approach or schedule for this habit",
        chartData: weeklyData
      };
    }

    return null;
  }

  private analyzeOptimalTiming(habit: Habit, cutoffDate: number): HabitInsight | null {
    const dayStats = new Map<number, { completed: number; total: number }>();
    
    habit.completions
      .filter(c => new Date(c.date).getTime() >= cutoffDate)
      .forEach(completion => {
        const dayOfWeek = new Date(completion.date).getDay();
        if (!dayStats.has(dayOfWeek)) {
          dayStats.set(dayOfWeek, { completed: 0, total: 0 });
        }
        
        const stats = dayStats.get(dayOfWeek)!;
        stats.total++;
        if (completion.completed) {
          stats.completed++;
        }
      });

    if (dayStats.size < 3) return null;

    const dayRates = Array.from(dayStats.entries()).map(([day, stats]) => ({
      day,
      rate: stats.completed / stats.total,
      total: stats.total
    }));

    const bestDay = dayRates.reduce((best, current) => 
      current.rate > best.rate ? current : best
    );
    const worstDay = dayRates.reduce((worst, current) => 
      current.rate < worst.rate ? current : worst
    );

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    if (bestDay.rate - worstDay.rate >= 0.3 && bestDay.total >= 5) {
      return {
        habitId: habit.id,
        habitName: habit.name,
        type: 'optimal_timing',
        insight: `Your best day for ${habit.name} is ${dayNames[bestDay.day]} (${Math.round(bestDay.rate * 100)}% success rate)`,
        confidence: Math.min((bestDay.rate - worstDay.rate) * 1.5, 0.9),
        dataPoints: dayRates.reduce((sum, d) => sum + d.total, 0),
        actionable: true,
        recommendation: `Consider scheduling ${habit.name} on ${dayNames[bestDay.day]}s when possible`,
        chartData: dayRates.map(d => ({ day: dayNames[d.day], rate: d.rate }))
      };
    }

    return null;
  }

  private analyzeDifficulty(habit: Habit, cutoffDate: number): HabitInsight | null {
    const completions = habit.completions.filter(c => new Date(c.date).getTime() >= cutoffDate);
    if (completions.length < 20) return null;

    const completionRate = completions.filter(c => c.completed).length / completions.length;
    const streaks = this.findStreaks(habit, cutoffDate);
    const avgStreakLength = streaks.length > 0 
      ? streaks.reduce((sum, streak) => sum + streak.length, 0) / streaks.length 
      : 0;

    let difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
    let recommendation: string;

    if (completionRate >= 0.8 && avgStreakLength >= 7) {
      difficulty = 'easy';
      recommendation = "This habit is well-established! Consider increasing the challenge or adding a related habit.";
    } else if (completionRate >= 0.6 && avgStreakLength >= 4) {
      difficulty = 'moderate';
      recommendation = "You're doing well with this habit. Focus on consistency to build longer streaks.";
    } else if (completionRate >= 0.4) {
      difficulty = 'challenging';
      recommendation = "This habit needs attention. Consider breaking it into smaller steps or adjusting your schedule.";
    } else {
      difficulty = 'difficult';
      recommendation = "This habit is struggling. Consider simplifying it or examining what barriers are preventing completion.";
    }

    return {
      habitId: habit.id,
      habitName: habit.name,
      type: 'difficulty_analysis',
      insight: `${habit.name} appears to be ${difficulty} for you (${Math.round(completionRate * 100)}% completion rate)`,
      confidence: 0.8,
      dataPoints: completions.length,
      actionable: true,
      recommendation,
      chartData: [
        { label: 'Completion Rate', value: completionRate },
        { label: 'Average Streak', value: avgStreakLength }
      ]
    };
  }

  private predictStreaks(habit: Habit, cutoffDate: number): HabitInsight | null {
    const recentCompletions = habit.completions
      .filter(c => new Date(c.date).getTime() >= cutoffDate)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14); // Last 14 days

    if (recentCompletions.length < 7) return null;

    const recentSuccessRate = recentCompletions.filter(c => c.completed).length / recentCompletions.length;
    const currentStreak = this.getCurrentStreak(habit);
    
    // Simple streak prediction based on recent performance
    let prediction: string;
    let confidence: number;

    if (recentSuccessRate >= 0.8) {
      prediction = currentStreak >= 3 
        ? `You're likely to extend your ${currentStreak}-day streak to ${currentStreak + 3}-${currentStreak + 7} days`
        : "You're likely to build a 5-10 day streak soon";
      confidence = 0.8;
    } else if (recentSuccessRate >= 0.5) {
      prediction = "Mixed recent performance - focus on consistency to build momentum";
      confidence = 0.6;
    } else {
      prediction = currentStreak > 0 
        ? "Your current streak may be at risk - extra focus needed"
        : "Consider restarting with a simpler approach to build momentum";
      confidence = 0.7;
    }

    return {
      habitId: habit.id,
      habitName: habit.name,
      type: 'streak_prediction',
      insight: prediction,
      confidence,
      dataPoints: recentCompletions.length,
      actionable: true,
      recommendation: recentSuccessRate >= 0.8 
        ? "Keep up your excellent consistency!"
        : "Focus on completing this habit for the next 3 days to build momentum",
      chartData: recentCompletions.map(c => ({
        date: c.date,
        completed: c.completed ? 1 : 0
      }))
    };
  }

  private getCurrentStreak(habit: Habit): number {
    const sortedCompletions = habit.completions
      .filter(c => c.completed)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.date);
      const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Comparative Analytics
  generateComparativeAnalytics(habits: Habit[], timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'): ComparativeAnalytics {
    const timeframeDays = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    }[timeframe];

    const cutoffDate = Date.now() - (timeframeDays * 24 * 60 * 60 * 1000);
    
    const habitAnalytics = habits.map(habit => {
      const completions = habit.completions.filter(c => new Date(c.date).getTime() >= cutoffDate);
      const completionRate = completions.length > 0 
        ? completions.filter(c => c.completed).length / completions.length 
        : 0;
      
      const streaks = this.findStreaks(habit, cutoffDate);
      const streakAverage = streaks.length > 0 
        ? streaks.reduce((sum, s) => sum + s.length, 0) / streaks.length 
        : 0;

      // Calculate consistency (lower variance in daily completion)
      const weeklyRates = this.groupCompletionsByWeek(habit, cutoffDate).map(w => w.completionRate);
      const consistency = weeklyRates.length > 1 
        ? 1 - this.calculateVariance(weeklyRates) 
        : completionRate;

      // Calculate trend
      const trend = this.calculateTrend(weeklyRates);
      const trendCategory: 'improving' | 'declining' | 'stable' = 
        trend > 0.05 ? 'improving' : trend < -0.05 ? 'declining' : 'stable';

      // Calculate overall score (0-100)
      const score = Math.round((completionRate * 40) + (consistency * 30) + (Math.min(streakAverage / 10, 1) * 20) + ((trend + 1) / 2 * 10));

      return {
        habitId: habit.id,
        habitName: habit.name,
        completionRate: Math.round(completionRate * 100) / 100,
        streakAverage: Math.round(streakAverage * 10) / 10,
        consistency: Math.round(consistency * 100) / 100,
        trend: trendCategory,
        score: Math.max(0, Math.min(100, score))
      };
    });

    // Find top performer and habits needing attention
    const topPerformer = habitAnalytics.reduce((top, current) => 
      current.score > top.score ? current : top
    ).habitId;

    const needsAttention = habitAnalytics
      .filter(h => h.score < 50 || h.trend === 'declining')
      .map(h => h.habitId);

    const overallScore = Math.round(
      habitAnalytics.reduce((sum, h) => sum + h.score, 0) / habitAnalytics.length
    );

    // Generate insights
    const insights = [
      `Your top performing habit is ${habitAnalytics.find(h => h.habitId === topPerformer)?.habitName}`,
      needsAttention.length > 0 
        ? `${needsAttention.length} habit${needsAttention.length > 1 ? 's' : ''} need${needsAttention.length === 1 ? 's' : ''} attention`
        : "All your habits are performing well!",
      `Your overall habit consistency score is ${overallScore}/100`
    ];

    return {
      timeframe,
      habits: habitAnalytics,
      topPerformer,
      needsAttention,
      overallScore,
      insights
    };
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}

export const analyticsEngine = AdvancedAnalyticsEngine.getInstance();