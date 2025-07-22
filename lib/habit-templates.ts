"use client";

import { Habit } from './storage';
import { Goal, GoalType } from './goals';

export interface HabitTemplate {
  id: string;
  name: string;
  category: HabitCategory;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  weeklyGoal: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  tags: string[];
  popularity: number; // 0-100
  defaultGoals?: Omit<Goal, 'id' | 'habitId' | 'isCompleted' | 'completedAt' | 'createdAt'>[];
  tips?: string[];
  benefits?: string[];
  prerequisites?: string[];
  relatedTemplates?: string[]; // template IDs
}

export type HabitCategory = 
  | 'health_fitness'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'creative'
  | 'lifestyle'
  | 'financial'
  | 'environmental'
  | 'career';

export interface TemplateLibrary {
  categories: HabitCategory[];
  templates: HabitTemplate[];
  featured: string[]; // template IDs
  trending: string[]; // template IDs
  newlyAdded: string[]; // template IDs
}

// Comprehensive habit template library
export const HABIT_TEMPLATE_LIBRARY: TemplateLibrary = {
  categories: [
    'health_fitness',
    'productivity', 
    'learning',
    'mindfulness',
    'social',
    'creative',
    'lifestyle',
    'financial',
    'environmental',
    'career'
  ],
  featured: ['exercise_30min', 'read_daily', 'meditation_10min', 'drink_water', 'gratitude_journal'],
  trending: ['cold_shower', 'no_phone_morning', 'walk_10k_steps', 'learn_language', 'meal_prep'],
  newlyAdded: ['breath_work', 'digital_detox', 'nature_time', 'skill_practice', 'network_contact'],
  templates: [
    // Health & Fitness
    {
      id: 'exercise_30min',
      name: 'Exercise 30 Minutes',
      category: 'health_fitness',
      description: 'Dedicate 30 minutes daily to physical exercise',
      icon: 'Dumbbell',
      color: '#EF4444',
      frequency: 'daily',
      weeklyGoal: 6,
      difficulty: 'intermediate',
      estimatedTime: 30,
      tags: ['fitness', 'health', 'energy', 'strength'],
      popularity: 92,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 21,
          targetUnit: 'days',
          description: 'Build a 21-day exercise streak'
        },
        {
          type: 'completion_count',
          targetValue: 100,
          targetUnit: 'workouts',
          description: 'Complete 100 workouts'
        }
      ],
      tips: [
        'Start with 15 minutes if 30 feels overwhelming',
        'Find an activity you enjoy - dancing, hiking, sports',
        'Schedule your workout at the same time daily',
        'Prepare workout clothes the night before'
      ],
      benefits: [
        'Increased energy levels',
        'Better sleep quality',
        'Improved mood and mental health',
        'Enhanced physical strength and endurance'
      ],
      prerequisites: ['Basic fitness assessment recommended'],
      relatedTemplates: ['walk_10k_steps', 'strength_training', 'morning_stretch']
    },
    {
      id: 'drink_water',
      name: 'Drink 8 Glasses of Water',
      category: 'health_fitness',
      description: 'Stay hydrated by drinking at least 8 glasses of water daily',
      icon: 'Droplets',
      color: '#3B82F6',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['hydration', 'health', 'energy', 'skin'],
      popularity: 88,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 30,
          targetUnit: 'days',
          description: 'Maintain hydration for 30 days'
        }
      ],
      tips: [
        'Keep a water bottle visible on your desk',
        'Set hourly reminders to drink water',
        'Flavor water with lemon or cucumber',
        'Track intake with an app or marks on bottle'
      ],
      benefits: [
        'Better skin health',
        'Improved energy levels',
        'Enhanced cognitive function',
        'Better digestion'
      ],
      relatedTemplates: ['healthy_eating', 'green_tea', 'morning_lemon_water']
    },
    {
      id: 'walk_10k_steps',
      name: 'Walk 10,000 Steps',
      category: 'health_fitness',
      description: 'Achieve 10,000 steps daily for cardiovascular health',
      icon: 'MapPin',
      color: '#10B981',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'intermediate',
      estimatedTime: 60,
      tags: ['walking', 'cardio', 'health', 'outdoors'],
      popularity: 85,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 14,
          targetUnit: 'days',
          description: '14-day walking streak'
        }
      ],
      tips: [
        'Take stairs instead of elevators',
        'Park further away from destinations',
        'Walk during phone calls',
        'Use a step counter app or device'
      ],
      benefits: [
        'Improved cardiovascular health',
        'Weight management',
        'Reduced stress',
        'Better sleep'
      ],
      relatedTemplates: ['exercise_30min', 'outdoor_time', 'morning_walk']
    },

    // Productivity
    {
      id: 'plan_tomorrow',
      name: 'Plan Tomorrow Tonight',
      category: 'productivity',
      description: 'Spend 10 minutes each evening planning the next day',
      icon: 'Calendar',
      color: '#8B5CF6',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 10,
      tags: ['planning', 'productivity', 'organization', 'focus'],
      popularity: 79,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 21,
          targetUnit: 'days',
          description: 'Plan every day for 3 weeks'
        }
      ],
      tips: [
        'Use a simple format: 3 must-dos, 3 nice-to-dos',
        'Review your calendar for appointments',
        'Prepare materials needed for tomorrow',
        'Set realistic expectations'
      ],
      benefits: [
        'Reduced morning stress',
        'Better time management',
        'Increased productivity',
        'Clearer daily focus'
      ],
      relatedTemplates: ['morning_routine', 'time_blocking', 'weekly_review']
    },
    {
      id: 'no_phone_morning',
      name: 'No Phone First Hour',
      category: 'productivity',
      description: 'Avoid checking phone for the first hour after waking',
      icon: 'Smartphone',
      color: '#F59E0B',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'intermediate',
      estimatedTime: 60,
      tags: ['digital detox', 'mindfulness', 'focus', 'morning'],
      popularity: 76,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 7,
          targetUnit: 'days',
          description: 'Phone-free mornings for 1 week'
        }
      ],
      tips: [
        'Keep phone in another room while sleeping',
        'Use a physical alarm clock',
        'Create a morning routine to fill the time',
        'Charge phone outside bedroom'
      ],
      benefits: [
        'Better morning mindfulness',
        'Reduced anxiety',
        'More intentional day starts',
        'Improved focus'
      ],
      relatedTemplates: ['meditation_10min', 'morning_routine', 'digital_detox']
    },

    // Learning
    {
      id: 'read_daily',
      name: 'Read for 30 Minutes',
      category: 'learning',
      description: 'Read books, articles, or educational content for 30 minutes',
      icon: 'BookOpen',
      color: '#DC2626',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 30,
      tags: ['reading', 'learning', 'knowledge', 'growth'],
      popularity: 91,
      defaultGoals: [
        {
          type: 'completion_count',
          targetValue: 12,
          targetUnit: 'books',
          description: 'Read 12 books this year'
        },
        {
          type: 'streak_target',
          targetValue: 30,
          targetUnit: 'days',
          description: '30-day reading streak'
        }
      ],
      tips: [
        'Always have a book or article ready',
        'Use audiobooks during commutes',
        'Set a specific reading time daily',
        'Join a book club for accountability'
      ],
      benefits: [
        'Expanded knowledge',
        'Improved vocabulary',
        'Better cognitive function',
        'Reduced stress'
      ],
      relatedTemplates: ['learn_language', 'journal_writing', 'podcast_learning']
    },
    {
      id: 'learn_language',
      name: 'Practice Language 15 Minutes',
      category: 'learning',
      description: 'Practice a foreign language for 15 minutes daily',
      icon: 'GraduationCap',
      color: '#7C3AED',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'intermediate',
      estimatedTime: 15,
      tags: ['language', 'learning', 'culture', 'communication'],
      popularity: 73,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 90,
          targetUnit: 'days',
          description: '90-day language learning streak'
        }
      ],
      tips: [
        'Use apps like Duolingo, Babbel, or Busuu',
        'Practice speaking out loud',
        'Watch content in target language',
        'Find a language exchange partner'
      ],
      benefits: [
        'Enhanced cognitive abilities',
        'Cultural understanding',
        'Career opportunities',
        'Travel confidence'
      ],
      relatedTemplates: ['read_daily', 'podcast_learning', 'skill_practice']
    },

    // Mindfulness
    {
      id: 'meditation_10min',
      name: 'Meditate 10 Minutes',
      category: 'mindfulness',
      description: 'Practice mindfulness meditation for 10 minutes daily',
      icon: 'Brain',
      color: '#059669',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 10,
      tags: ['meditation', 'mindfulness', 'stress relief', 'mental health'],
      popularity: 84,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 21,
          targetUnit: 'days',
          description: '21-day meditation streak'
        },
        {
          type: 'time_target',
          targetValue: 3,
          targetUnit: 'months',
          description: 'Maintain practice for 3 months'
        }
      ],
      tips: [
        'Start with 5 minutes if 10 feels too long',
        'Use guided meditation apps like Headspace or Calm',
        'Find a quiet, consistent spot to meditate',
        'Focus on breath or use mantras'
      ],
      benefits: [
        'Reduced stress and anxiety',
        'Improved focus',
        'Better emotional regulation',
        'Enhanced self-awareness'
      ],
      relatedTemplates: ['gratitude_journal', 'breath_work', 'morning_routine']
    },
    {
      id: 'gratitude_journal',
      name: 'Write 3 Gratitudes',
      category: 'mindfulness',
      description: 'Write down three things you are grateful for each day',
      icon: 'Heart',
      color: '#F97316',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['gratitude', 'journaling', 'positivity', 'mental health'],
      popularity: 82,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 30,
          targetUnit: 'days',
          description: '30 days of gratitude'
        }
      ],
      tips: [
        'Be specific about what you\'re grateful for',
        'Include why you\'re grateful, not just what',
        'Keep a dedicated gratitude journal',
        'Do it at the same time each day'
      ],
      benefits: [
        'Improved mood',
        'Better sleep',
        'Stronger relationships',
        'Increased life satisfaction'
      ],
      relatedTemplates: ['meditation_10min', 'journal_writing', 'positive_affirmations']
    },

    // Creative
    {
      id: 'creative_practice',
      name: 'Creative Practice 20 Minutes',
      category: 'creative',
      description: 'Spend 20 minutes on creative activities like drawing, writing, or music',
      icon: 'Palette',
      color: '#EC4899',
      frequency: 'daily',
      weeklyGoal: 6,
      difficulty: 'beginner',
      estimatedTime: 20,
      tags: ['creativity', 'art', 'self-expression', 'skills'],
      popularity: 68,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 14,
          targetUnit: 'days',
          description: '2-week creative streak'
        }
      ],
      tips: [
        'Don\'t worry about perfection, focus on practice',
        'Try different creative mediums',
        'Set up a dedicated creative space',
        'Share your work for feedback'
      ],
      benefits: [
        'Enhanced creativity',
        'Stress relief',
        'Improved problem-solving',
        'Personal fulfillment'
      ],
      relatedTemplates: ['skill_practice', 'music_practice', 'writing_practice']
    },

    // Lifestyle
    {
      id: 'meal_prep',
      name: 'Meal Prep Weekly',
      category: 'lifestyle',
      description: 'Prepare healthy meals for the week every Sunday',
      icon: 'Utensils',
      color: '#16A34A',
      frequency: 'weekly',
      weeklyGoal: 1,
      difficulty: 'intermediate',
      estimatedTime: 120,
      tags: ['nutrition', 'planning', 'health', 'cooking'],
      popularity: 71,
      defaultGoals: [
        {
          type: 'completion_count',
          targetValue: 12,
          targetUnit: 'weeks',
          description: 'Meal prep for 12 weeks'
        }
      ],
      tips: [
        'Plan meals before grocery shopping',
        'Prep ingredients, not just full meals',
        'Invest in good food storage containers',
        'Start with 3-4 meals per week'
      ],
      benefits: [
        'Healthier eating habits',
        'Time savings during the week',
        'Money savings',
        'Reduced decision fatigue'
      ],
      relatedTemplates: ['healthy_eating', 'cooking_skill', 'grocery_planning']
    },

    // Financial
    {
      id: 'track_expenses',
      name: 'Track Daily Expenses',
      category: 'financial',
      description: 'Record all expenses and spending daily',
      icon: 'CreditCard',
      color: '#059669',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 5,
      tags: ['budgeting', 'money', 'finance', 'awareness'],
      popularity: 65,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 30,
          targetUnit: 'days',
          description: 'Track expenses for 30 days'
        }
      ],
      tips: [
        'Use a budgeting app or spreadsheet',
        'Categorize expenses for better insights',
        'Take photos of receipts immediately',
        'Review spending weekly'
      ],
      benefits: [
        'Better financial awareness',
        'Reduced unnecessary spending',
        'Improved budgeting',
        'Financial goal achievement'
      ],
      relatedTemplates: ['save_money', 'investment_research', 'financial_education']
    },

    // Environmental
    {
      id: 'reduce_waste',
      name: 'Zero Waste Action Daily',
      category: 'environmental',
      description: 'Take one action daily to reduce waste and environmental impact',
      icon: 'Leaf',
      color: '#059669',
      frequency: 'daily',
      weeklyGoal: 7,
      difficulty: 'beginner',
      estimatedTime: 10,
      tags: ['environment', 'sustainability', 'conservation', 'mindfulness'],
      popularity: 58,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 30,
          targetUnit: 'days',
          description: '30 days of eco-friendly actions'
        }
      ],
      tips: [
        'Bring reusable bags when shopping',
        'Use a refillable water bottle',
        'Choose public transport or walk',
        'Compost food scraps'
      ],
      benefits: [
        'Reduced environmental footprint',
        'Money savings',
        'Increased environmental awareness',
        'Contributing to global sustainability'
      ],
      relatedTemplates: ['walk_10k_steps', 'nature_time', 'mindful_consumption']
    },

    // Career
    {
      id: 'skill_practice',
      name: 'Practice Professional Skill',
      category: 'career',
      description: 'Spend 30 minutes daily practicing a career-relevant skill',
      icon: 'Target',
      color: '#6366F1',
      frequency: 'daily',
      weeklyGoal: 5,
      difficulty: 'intermediate',
      estimatedTime: 30,
      tags: ['skills', 'career', 'growth', 'learning'],
      popularity: 77,
      defaultGoals: [
        {
          type: 'streak_target',
          targetValue: 21,
          targetUnit: 'days',
          description: '21 days of skill building'
        },
        {
          type: 'time_target',
          targetValue: 3,
          targetUnit: 'months',
          description: 'Practice consistently for 3 months'
        }
      ],
      tips: [
        'Choose skills relevant to your career goals',
        'Use online courses or tutorials',
        'Practice with real projects',
        'Seek feedback from experts'
      ],
      benefits: [
        'Enhanced professional capabilities',
        'Increased job opportunities',
        'Higher earning potential',
        'Career advancement'
      ],
      relatedTemplates: ['learn_language', 'network_contact', 'portfolio_update']
    },

    {
      id: 'network_contact',
      name: 'Make One Professional Contact',
      category: 'career',
      description: 'Reach out to one professional contact or make a new connection daily',
      icon: 'Users',
      color: '#7C2D12',
      frequency: 'daily',
      weeklyGoal: 5,
      difficulty: 'intermediate',
      estimatedTime: 15,
      tags: ['networking', 'career', 'relationships', 'opportunities'],
      popularity: 62,
      defaultGoals: [
        {
          type: 'completion_count',
          targetValue: 50,
          targetUnit: 'contacts',
          description: 'Make 50 professional connections'
        }
      ],
      tips: [
        'Use LinkedIn for professional networking',
        'Attend industry events and meetups',
        'Follow up on existing connections',
        'Offer value before asking for help'
      ],
      benefits: [
        'Expanded professional network',
        'New opportunities',
        'Industry insights',
        'Career advancement'
      ],
      relatedTemplates: ['skill_practice', 'industry_research', 'portfolio_update']
    }
  ]
};

// Template search and filtering
export class HabitTemplateEngine {
  private static instance: HabitTemplateEngine;

  private constructor() {}

  public static getInstance(): HabitTemplateEngine {
    if (!HabitTemplateEngine.instance) {
      HabitTemplateEngine.instance = new HabitTemplateEngine();
    }
    return HabitTemplateEngine.instance;
  }

  // Search templates by query
  searchTemplates(
    query: string,
    options: {
      categories?: HabitCategory[];
      difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
      maxTime?: number;
      minPopularity?: number;
    } = {}
  ): HabitTemplate[] {
    const { categories, difficulty, maxTime, minPopularity = 0 } = options;
    const queryLower = query.toLowerCase();

    return HABIT_TEMPLATE_LIBRARY.templates.filter(template => {
      // Text search
      const matchesQuery = !query || 
        template.name.toLowerCase().includes(queryLower) ||
        template.description.toLowerCase().includes(queryLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(queryLower));

      // Category filter
      const matchesCategory = !categories || categories.includes(template.category);

      // Difficulty filter
      const matchesDifficulty = !difficulty || difficulty.includes(template.difficulty);

      // Time filter
      const matchesTime = !maxTime || template.estimatedTime <= maxTime;

      // Popularity filter
      const matchesPopularity = template.popularity >= minPopularity;

      return matchesQuery && matchesCategory && matchesDifficulty && matchesTime && matchesPopularity;
    }).sort((a, b) => b.popularity - a.popularity);
  }

  // Get templates by category
  getTemplatesByCategory(category: HabitCategory): HabitTemplate[] {
    return HABIT_TEMPLATE_LIBRARY.templates
      .filter(template => template.category === category)
      .sort((a, b) => b.popularity - a.popularity);
  }

  // Get featured templates
  getFeaturedTemplates(): HabitTemplate[] {
    return HABIT_TEMPLATE_LIBRARY.featured
      .map(id => this.getTemplateById(id))
      .filter(Boolean) as HabitTemplate[];
  }

  // Get trending templates
  getTrendingTemplates(): HabitTemplate[] {
    return HABIT_TEMPLATE_LIBRARY.trending
      .map(id => this.getTemplateById(id))
      .filter(Boolean) as HabitTemplate[];
  }

  // Get template by ID
  getTemplateById(id: string): HabitTemplate | null {
    return HABIT_TEMPLATE_LIBRARY.templates.find(template => template.id === id) || null;
  }

  // Convert template to habit
  templateToHabit(template: HabitTemplate, customizations: Partial<Habit> = {}): Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions'> {
    return {
      name: customizations.name || template.name,
      icon: customizations.icon || template.icon,
      color: customizations.color || template.color,
      category: customizations.category || this.categoryToString(template.category),
      description: customizations.description || template.description,
      frequency: customizations.frequency || template.frequency,
      weeklyGoal: customizations.weeklyGoal || template.weeklyGoal,
      goals: customizations.goals || [],
      milestones: customizations.milestones || [],
      achievements: customizations.achievements || []
    };
  }

  private categoryToString(category: HabitCategory): string {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // Get related templates
  getRelatedTemplates(templateId: string, limit: number = 5): HabitTemplate[] {
    const template = this.getTemplateById(templateId);
    if (!template) return [];

    const relatedIds = template.relatedTemplates || [];
    const relatedTemplates = relatedIds
      .map(id => this.getTemplateById(id))
      .filter(Boolean) as HabitTemplate[];

    // If not enough related templates, fill with same category
    if (relatedTemplates.length < limit) {
      const sameCategoryTemplates = this.getTemplatesByCategory(template.category)
        .filter(t => t.id !== templateId && !relatedIds.includes(t.id))
        .slice(0, limit - relatedTemplates.length);
      
      relatedTemplates.push(...sameCategoryTemplates);
    }

    return relatedTemplates.slice(0, limit);
  }

  // Get category metadata
  getCategoryInfo(category: HabitCategory): { 
    name: string; 
    description: string; 
    icon: string; 
    color: string;
    templateCount: number;
  } {
    const categoryData = {
      health_fitness: {
        name: 'Health & Fitness',
        description: 'Build physical health, fitness, and wellness habits',
        icon: 'Dumbbell',
        color: '#EF4444'
      },
      productivity: {
        name: 'Productivity',
        description: 'Improve efficiency, focus, and time management',
        icon: 'Target',
        color: '#8B5CF6'
      },
      learning: {
        name: 'Learning',
        description: 'Continuous learning and skill development',
        icon: 'GraduationCap',
        color: '#DC2626'
      },
      mindfulness: {
        name: 'Mindfulness',
        description: 'Mental health, meditation, and self-awareness',
        icon: 'Brain',
        color: '#059669'
      },
      social: {
        name: 'Social',
        description: 'Relationships, communication, and social skills',
        icon: 'Users',
        color: '#0EA5E9'
      },
      creative: {
        name: 'Creative',
        description: 'Artistic expression and creative pursuits',
        icon: 'Palette',
        color: '#EC4899'
      },
      lifestyle: {
        name: 'Lifestyle',
        description: 'Daily routines and life organization',
        icon: 'Home',
        color: '#16A34A'
      },
      financial: {
        name: 'Financial',
        description: 'Money management and financial wellness',
        icon: 'CreditCard',
        color: '#059669'
      },
      environmental: {
        name: 'Environmental',
        description: 'Sustainability and eco-friendly practices',
        icon: 'Leaf',
        color: '#059669'
      },
      career: {
        name: 'Career',
        description: 'Professional development and career growth',
        icon: 'Briefcase',
        color: '#6366F1'
      }
    };

    const templateCount = this.getTemplatesByCategory(category).length;
    
    return {
      ...categoryData[category],
      templateCount
    };
  }
}

export const habitTemplateEngine = HabitTemplateEngine.getInstance();