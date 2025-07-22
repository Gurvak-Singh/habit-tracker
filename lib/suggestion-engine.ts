"use client";

import { Habit } from './storage';
import { HabitTemplate, HabitCategory, habitTemplateEngine } from './habit-templates';
import { analyticsEngine } from './analytics-engine';

export interface HabitSuggestion {
  id: string;
  template: HabitTemplate;
  reason: SuggestionReason;
  confidence: number; // 0-1
  priority: 'high' | 'medium' | 'low';
  category: 'improvement' | 'complement' | 'trending' | 'personal';
  metadata: {
    basedOn?: string[]; // habit IDs or patterns
    timesSuggested?: number;
    lastSuggested?: number;
    dismissed?: boolean;
  };
}

export type SuggestionReason = 
  | 'category_expansion'
  | 'time_optimization'
  | 'correlation_based'
  | 'difficulty_match'
  | 'pattern_completion'
  | 'streak_momentum'
  | 'popular_choice'
  | 'seasonal_trend'
  | 'habit_stacking'
  | 'goal_alignment';

export interface SuggestionContext {
  currentHabits: Habit[];
  userPreferences?: {
    preferredCategories?: HabitCategory[];
    maxTimePerHabit?: number;
    difficultyPreference?: 'beginner' | 'intermediate' | 'advanced';
    focusAreas?: string[];
  };
  timeConstraints?: {
    availableTime: number; // minutes per day
    preferredTimes?: string[]; // morning, afternoon, evening
  };
  goals?: {
    shortTerm?: string[];
    longTerm?: string[];
  };
}

export class IntelligentSuggestionEngine {
  private static instance: IntelligentSuggestionEngine;
  private suggestionHistory: Map<string, HabitSuggestion> = new Map();

  private constructor() {}

  public static getInstance(): IntelligentSuggestionEngine {
    if (!IntelligentSuggestionEngine.instance) {
      IntelligentSuggestionEngine.instance = new IntelligentSuggestionEngine();
    }
    return IntelligentSuggestionEngine.instance;
  }

  // Generate personalized habit suggestions
  generateSuggestions(context: SuggestionContext, limit: number = 10): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const { currentHabits, userPreferences } = context;

    // Different suggestion strategies
    suggestions.push(...this.suggestBasedOnCorrelations(currentHabits));
    suggestions.push(...this.suggestComplementaryHabits(currentHabits));
    suggestions.push(...this.suggestBasedOnPerformance(currentHabits));
    suggestions.push(...this.suggestCategoryExpansion(currentHabits, userPreferences));
    suggestions.push(...this.suggestBasedOnTime(currentHabits, context.timeConstraints));
    suggestions.push(...this.suggestTrendingHabits(currentHabits));
    suggestions.push(...this.suggestHabitStacking(currentHabits));

    // Remove duplicates and filter
    const uniqueSuggestions = this.deduplicateAndFilter(suggestions, currentHabits);

    // Score and rank suggestions
    const scoredSuggestions = this.scoreAndRankSuggestions(uniqueSuggestions, context);

    return scoredSuggestions.slice(0, limit);
  }

  private suggestBasedOnCorrelations(currentHabits: Habit[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    
    if (currentHabits.length < 2) return suggestions;

    const correlations = analyticsEngine.calculateHabitCorrelations(currentHabits, 30);
    const strongCorrelations = correlations.filter(c => 
      c.significance === 'high' && c.relationship === 'positive'
    );

    strongCorrelations.forEach(correlation => {
      // Find templates that are similar to the correlated habits
      const habit1Categories = this.inferCategories(correlation.habit1Name);
      const habit2Categories = this.inferCategories(correlation.habit2Name);
      
      const combinedCategories = [...habit1Categories, ...habit2Categories];
      
      combinedCategories.forEach(category => {
        const templates = habitTemplateEngine.getTemplatesByCategory(category)
          .filter(template => !this.isHabitAlreadyTracked(template, currentHabits))
          .slice(0, 2);

        templates.forEach(template => {
          suggestions.push({
            id: `correlation_${correlation.habit1Id}_${correlation.habit2Id}_${template.id}`,
            template,
            reason: 'correlation_based',
            confidence: correlation.correlationCoefficient * 0.8,
            priority: 'high',
            category: 'complement',
            metadata: {
              basedOn: [correlation.habit1Id, correlation.habit2Id],
              timesSuggested: 0,
              lastSuggested: Date.now()
            }
          });
        });
      });
    });

    return suggestions;
  }

  private suggestComplementaryHabits(currentHabits: Habit[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const currentCategories = new Set(currentHabits.map(h => this.inferPrimaryCategory(h.category || h.name)));

    // Suggest complementary categories
    const complementaryMap: Record<HabitCategory, HabitCategory[]> = {
      health_fitness: ['mindfulness', 'lifestyle'],
      productivity: ['learning', 'career'],
      learning: ['productivity', 'career'],
      mindfulness: ['health_fitness', 'creative'],
      social: ['creative', 'lifestyle'],
      creative: ['mindfulness', 'social'],
      lifestyle: ['health_fitness', 'environmental'],
      financial: ['career', 'productivity'],
      environmental: ['lifestyle', 'mindfulness'],
      career: ['learning', 'productivity']
    };

    currentCategories.forEach(category => {
      const complements = complementaryMap[category as HabitCategory] || [];
      
      complements.forEach(complementCategory => {
        if (!currentCategories.has(complementCategory)) {
          const templates = habitTemplateEngine.getTemplatesByCategory(complementCategory)
            .filter(template => !this.isHabitAlreadyTracked(template, currentHabits))
            .slice(0, 2);

          templates.forEach(template => {
            suggestions.push({
              id: `complement_${category}_${template.id}`,
              template,
              reason: 'category_expansion',
              confidence: 0.7,
              priority: 'medium',
              category: 'complement',
              metadata: {
                basedOn: [category],
                timesSuggested: 0,
                lastSuggested: Date.now()
              }
            });
          });
        }
      });
    });

    return suggestions;
  }

  private suggestBasedOnPerformance(currentHabits: Habit[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const comparative = analyticsEngine.generateComparativeAnalytics(currentHabits, 'month');

    // Suggest easier habits for users struggling with consistency
    if (comparative.overallScore < 60) {
      const beginnerTemplates = habitTemplateEngine.searchTemplates('', {
        difficulty: ['beginner'],
        maxTime: 15,
        minPopularity: 70
      }).slice(0, 3);

      beginnerTemplates.forEach(template => {
        suggestions.push({
          id: `performance_easy_${template.id}`,
          template,
          reason: 'difficulty_match',
          confidence: 0.8,
          priority: 'high',
          category: 'improvement',
          metadata: {
            basedOn: ['low_performance'],
            timesSuggested: 0,
            lastSuggested: Date.now()
          }
        });
      });
    }

    // Suggest more challenging habits for high performers
    if (comparative.overallScore >= 80) {
      const challengingTemplates = habitTemplateEngine.searchTemplates('', {
        difficulty: ['intermediate', 'advanced'],
        minPopularity: 60
      }).filter(template => !this.isHabitAlreadyTracked(template, currentHabits))
        .slice(0, 3);

      challengingTemplates.forEach(template => {
        suggestions.push({
          id: `performance_challenge_${template.id}`,
          template,
          reason: 'streak_momentum',
          confidence: 0.75,
          priority: 'medium',
          category: 'improvement',
          metadata: {
            basedOn: ['high_performance'],
            timesSuggested: 0,
            lastSuggested: Date.now()
          }
        });
      });
    }

    return suggestions;
  }

  private suggestCategoryExpansion(currentHabits: Habit[], preferences?: SuggestionContext['userPreferences']): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const currentCategories = new Set(currentHabits.map(h => this.inferPrimaryCategory(h.category || h.name)));
    const allCategories: HabitCategory[] = ['health_fitness', 'productivity', 'learning', 'mindfulness', 'social', 'creative', 'lifestyle', 'financial', 'environmental', 'career'];

    // Suggest from missing categories
    const missingCategories = allCategories.filter(cat => !currentCategories.has(cat));
    
    // Prioritize based on user preferences
    const prioritizedCategories = preferences?.preferredCategories 
      ? missingCategories.filter(cat => preferences.preferredCategories!.includes(cat))
      : missingCategories;

    prioritizedCategories.forEach(category => {
      const categoryInfo = habitTemplateEngine.getCategoryInfo(category);
      const templates = habitTemplateEngine.getTemplatesByCategory(category)
        .filter(template => {
          if (preferences?.maxTimePerHabit && template.estimatedTime > preferences.maxTimePerHabit) {
            return false;
          }
          if (preferences?.difficultyPreference && template.difficulty !== preferences.difficultyPreference) {
            return false;
          }
          return !this.isHabitAlreadyTracked(template, currentHabits);
        })
        .slice(0, 2);

      templates.forEach(template => {
        suggestions.push({
          id: `category_expansion_${category}_${template.id}`,
          template,
          reason: 'category_expansion',
          confidence: 0.6,
          priority: 'medium',
          category: 'complement',
          metadata: {
            basedOn: [category],
            timesSuggested: 0,
            lastSuggested: Date.now()
          }
        });
      });
    });

    return suggestions;
  }

  private suggestBasedOnTime(currentHabits: Habit[], timeConstraints?: SuggestionContext['timeConstraints']): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    
    if (!timeConstraints?.availableTime) return suggestions;

    const currentTimeCommitment = currentHabits.reduce((total, habit) => {
      return total + (this.estimateHabitTime(habit) * (habit.weeklyGoal || 7));
    }, 0) / 7; // Daily average

    const remainingTime = timeConstraints.availableTime - currentTimeCommitment;

    if (remainingTime > 5) {
      const timeAppropriateTemplates = habitTemplateEngine.searchTemplates('', {
        maxTime: Math.floor(remainingTime),
        minPopularity: 65
      }).filter(template => !this.isHabitAlreadyTracked(template, currentHabits))
        .slice(0, 4);

      timeAppropriateTemplates.forEach(template => {
        suggestions.push({
          id: `time_based_${template.id}`,
          template,
          reason: 'time_optimization',
          confidence: 0.7,
          priority: 'medium',
          category: 'personal',
          metadata: {
            basedOn: [`available_time_${Math.floor(remainingTime)}`],
            timesSuggested: 0,
            lastSuggested: Date.now()
          }
        });
      });
    }

    return suggestions;
  }

  private suggestTrendingHabits(currentHabits: Habit[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    const trendingTemplates = habitTemplateEngine.getTrendingTemplates()
      .filter(template => !this.isHabitAlreadyTracked(template, currentHabits));

    trendingTemplates.forEach(template => {
      suggestions.push({
        id: `trending_${template.id}`,
        template,
        reason: 'popular_choice',
        confidence: 0.6,
        priority: 'low',
        category: 'trending',
        metadata: {
          basedOn: ['trending'],
          timesSuggested: 0,
          lastSuggested: Date.now()
        }
      });
    });

    return suggestions;
  }

  private suggestHabitStacking(currentHabits: Habit[]): HabitSuggestion[] {
    const suggestions: HabitSuggestion[] = [];
    
    // Find habits that could be stacked with existing ones
    currentHabits.forEach(habit => {
      const habitCategory = this.inferPrimaryCategory(habit.category || habit.name);
      const stackableTemplates = habitTemplateEngine.searchTemplates('', {
        categories: [habitCategory],
        maxTime: 15, // Quick habits for stacking
        minPopularity: 70
      }).filter(template => 
        template.estimatedTime <= 15 && 
        !this.isHabitAlreadyTracked(template, currentHabits)
      ).slice(0, 1);

      stackableTemplates.forEach(template => {
        suggestions.push({
          id: `stack_${habit.id}_${template.id}`,
          template,
          reason: 'habit_stacking',
          confidence: 0.75,
          priority: 'high',
          category: 'complement',
          metadata: {
            basedOn: [habit.id],
            timesSuggested: 0,
            lastSuggested: Date.now()
          }
        });
      });
    });

    return suggestions;
  }

  private deduplicateAndFilter(suggestions: HabitSuggestion[], currentHabits: Habit[]): HabitSuggestion[] {
    const seen = new Set<string>();
    const filtered: HabitSuggestion[] = [];

    suggestions.forEach(suggestion => {
      if (!seen.has(suggestion.template.id) && !this.isHabitAlreadyTracked(suggestion.template, currentHabits)) {
        seen.add(suggestion.template.id);
        filtered.push(suggestion);
      }
    });

    return filtered;
  }

  private scoreAndRankSuggestions(suggestions: HabitSuggestion[], context: SuggestionContext): HabitSuggestion[] {
    return suggestions
      .map(suggestion => {
        let score = suggestion.confidence;

        // Boost score based on priority
        if (suggestion.priority === 'high') score *= 1.3;
        else if (suggestion.priority === 'medium') score *= 1.1;

        // Boost popular templates
        if (suggestion.template.popularity >= 80) score *= 1.2;
        else if (suggestion.template.popularity >= 60) score *= 1.1;

        // Boost if matches user preferences
        if (context.userPreferences?.preferredCategories?.includes(suggestion.template.category)) {
          score *= 1.25;
        }

        if (context.userPreferences?.difficultyPreference === suggestion.template.difficulty) {
          score *= 1.15;
        }

        // Reduce score if suggested too recently
        const timeSinceLastSuggested = Date.now() - (suggestion.metadata.lastSuggested || 0);
        const daysSince = timeSinceLastSuggested / (1000 * 60 * 60 * 24);
        
        if (daysSince < 3) score *= 0.5;
        else if (daysSince < 7) score *= 0.8;

        return { ...suggestion, confidence: Math.min(score, 1) };
      })
      .sort((a, b) => b.confidence - a.confidence);
  }

  private isHabitAlreadyTracked(template: HabitTemplate, currentHabits: Habit[]): boolean {
    return currentHabits.some(habit => 
      habit.name.toLowerCase() === template.name.toLowerCase() ||
      habit.name.toLowerCase().includes(template.name.toLowerCase().split(' ')[0])
    );
  }

  private inferCategories(habitName: string): HabitCategory[] {
    const name = habitName.toLowerCase();
    const categories: HabitCategory[] = [];

    const categoryKeywords: Record<HabitCategory, string[]> = {
      health_fitness: ['exercise', 'workout', 'run', 'walk', 'gym', 'fitness', 'water', 'sleep', 'stretch'],
      productivity: ['plan', 'organize', 'focus', 'todo', 'schedule', 'time', 'priority', 'inbox'],
      learning: ['read', 'study', 'learn', 'course', 'book', 'skill', 'language', 'practice'],
      mindfulness: ['meditat', 'mindful', 'breath', 'gratitude', 'journal', 'reflect', 'peace'],
      social: ['call', 'friend', 'family', 'connect', 'network', 'social', 'relationship'],
      creative: ['draw', 'paint', 'write', 'music', 'creative', 'art', 'design', 'craft'],
      lifestyle: ['clean', 'organize', 'cook', 'meal', 'home', 'lifestyle', 'routine'],
      financial: ['budget', 'save', 'money', 'invest', 'expense', 'financial', 'income'],
      environmental: ['recycle', 'environment', 'green', 'sustainable', 'eco', 'nature'],
      career: ['skill', 'professional', 'career', 'work', 'job', 'network', 'portfolio']
    };

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => name.includes(keyword))) {
        categories.push(category as HabitCategory);
      }
    });

    return categories.length > 0 ? categories : ['lifestyle'];
  }

  private inferPrimaryCategory(habitDescription: string): HabitCategory {
    const categories = this.inferCategories(habitDescription);
    return categories[0] || 'lifestyle';
  }

  private estimateHabitTime(habit: Habit): number {
    // Estimate time based on habit name and description
    const name = habit.name.toLowerCase();
    
    if (name.includes('30 min') || name.includes('thirty')) return 30;
    if (name.includes('20 min') || name.includes('twenty')) return 20;
    if (name.includes('15 min') || name.includes('fifteen')) return 15;
    if (name.includes('10 min') || name.includes('ten')) return 10;
    if (name.includes('5 min') || name.includes('five')) return 5;
    
    // Default estimates based on common habits
    if (name.includes('exercise') || name.includes('workout')) return 30;
    if (name.includes('read')) return 20;
    if (name.includes('meditat')) return 10;
    if (name.includes('journal')) return 15;
    if (name.includes('plan')) return 10;
    
    return 15; // Default estimate
  }

  // Utility methods for suggestion management
  markSuggestionDismissed(suggestionId: string): void {
    const suggestion = this.suggestionHistory.get(suggestionId);
    if (suggestion) {
      suggestion.metadata.dismissed = true;
      this.suggestionHistory.set(suggestionId, suggestion);
    }
  }

  trackSuggestionUsage(suggestionId: string): void {
    const suggestion = this.suggestionHistory.get(suggestionId);
    if (suggestion) {
      suggestion.metadata.timesSuggested = (suggestion.metadata.timesSuggested || 0) + 1;
      this.suggestionHistory.set(suggestionId, suggestion);
    }
  }

  // Generate contextual suggestions based on current state
  generateContextualSuggestions(
    currentHabits: Habit[], 
    timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning',
    limit: number = 5
  ): HabitSuggestion[] {
    const timeBasedCategories: Record<string, HabitCategory[]> = {
      morning: ['health_fitness', 'mindfulness', 'productivity'],
      afternoon: ['productivity', 'learning', 'career'],
      evening: ['mindfulness', 'creative', 'social']
    };

    const context: SuggestionContext = {
      currentHabits,
      userPreferences: {
        preferredCategories: timeBasedCategories[timeOfDay]
      }
    };

    return this.generateSuggestions(context, limit);
  }

  // Get suggestions for specific improvement goals
  getSuggestionsForGoal(
    currentHabits: Habit[],
    goal: 'health' | 'productivity' | 'learning' | 'mindfulness' | 'creativity',
    limit: number = 3
  ): HabitSuggestion[] {
    const goalCategories: Record<string, HabitCategory[]> = {
      health: ['health_fitness', 'mindfulness', 'lifestyle'],
      productivity: ['productivity', 'career', 'financial'],
      learning: ['learning', 'career', 'creative'],
      mindfulness: ['mindfulness', 'creative', 'environmental'],
      creativity: ['creative', 'learning', 'social']
    };

    const context: SuggestionContext = {
      currentHabits,
      userPreferences: {
        preferredCategories: goalCategories[goal]
      },
      goals: {
        shortTerm: [goal]
      }
    };

    return this.generateSuggestions(context, limit);
  }
}

export const suggestionEngine = IntelligentSuggestionEngine.getInstance();