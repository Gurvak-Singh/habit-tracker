"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Brain, 
  Target,
  Zap,
  Trophy,
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';
import { Habit } from '@/lib/storage';
import { 
  analyticsEngine, 
  HabitCorrelation, 
  ProductivityPattern, 
  HabitInsight, 
  ComparativeAnalytics 
} from '@/lib/analytics-engine';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  habits: Habit[];
  className?: string;
}

export function AnalyticsDashboard({ habits, className }: AnalyticsDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  
  // Generate analytics data
  const analytics = useMemo(() => {
    if (habits.length === 0) return null;
    
    setIsLoading(true);
    
    const timeframeDays = timeframe === 'month' ? 30 : timeframe === 'quarter' ? 90 : 365;
    
    const correlations = analyticsEngine.calculateHabitCorrelations(habits, timeframeDays);
    const patterns = analyticsEngine.detectProductivityPatterns(habits, timeframeDays);
    const insights = analyticsEngine.generateHabitInsights(habits, timeframeDays);
    const comparative = analyticsEngine.generateComparativeAnalytics(habits, timeframe);
    
    setIsLoading(false);
    
    return {
      correlations: correlations.slice(0, 5), // Top 5 correlations
      patterns: patterns.slice(0, 6), // Top 6 patterns
      insights: insights.slice(0, 8), // Top 8 insights
      comparative
    };
  }, [habits, timeframe]);

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No Analytics Available
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Create some habits and track them for a few days to see analytics
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Deep insights into your habit patterns and productivity
          </p>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <span className="text-sm text-slate-600 dark:text-slate-400">Timeframe:</span>
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-1">
            {(['month', 'quarter', 'year'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className="text-xs"
              >
                {period === 'month' ? '30 Days' : period === 'quarter' ? '3 Months' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Analyzing your habits...</p>
        </div>
      )}

      {/* Analytics Content */}
      {analytics && !isLoading && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab comparative={analytics.comparative} insights={analytics.insights} />
          </TabsContent>

          <TabsContent value="correlations" className="space-y-6">
            <CorrelationsTab correlations={analytics.correlations} />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <PatternsTab patterns={analytics.patterns} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <InsightsTab insights={analytics.insights} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function OverviewTab({ comparative, insights }: { comparative: ComparativeAnalytics; insights: HabitInsight[] }) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span>Overall Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={`${(comparative.overallScore / 100) * 314.16} 314.16`}
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    comparative.overallScore >= 80 ? "text-green-500" :
                    comparative.overallScore >= 60 ? "text-yellow-500" :
                    "text-red-500"
                  )}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {comparative.overallScore}
                  </div>
                  <div className="text-xs text-slate-500">out of 100</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {comparative.overallScore >= 80 ? 'Excellent!' : 
               comparative.overallScore >= 60 ? 'Good Progress' : 
               'Needs Attention'}
            </h3>
            {comparative.insights.map((insight, index) => (
              <p key={index} className="text-slate-600 dark:text-slate-300">
                {insight}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers vs Struggling */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const topHabit = comparative.habits.find(h => h.habitId === comparative.topPerformer);
              return topHabit ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {topHabit.habitName}
                    </h3>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {topHabit.score}/100
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-500">Completion Rate</div>
                      <div className="text-lg font-semibold">{Math.round(topHabit.completionRate * 100)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Avg Streak</div>
                      <div className="text-lg font-semibold">{topHabit.streakAverage} days</div>
                    </div>
                  </div>
                  
                  <Badge variant={
                    topHabit.trend === 'improving' ? 'default' :
                    topHabit.trend === 'declining' ? 'destructive' : 'secondary'
                  }>
                    {topHabit.trend === 'improving' ? '📈 Improving' :
                     topHabit.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                  </Badge>
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-300">No data available</p>
              );
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Needs Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {comparative.needsAttention.length > 0 ? (
              <div className="space-y-3">
                {comparative.needsAttention.slice(0, 3).map(habitId => {
                  const habit = comparative.habits.find(h => h.habitId === habitId);
                  return habit ? (
                    <div key={habitId} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {habit.habitName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {habit.score}/100 • {Math.round(habit.completionRate * 100)}% completion
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {habit.trend}
                      </Badge>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300">
                  All habits are performing well!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Key Insights Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span>Key Insights</span>
          </CardTitle>
          <CardDescription>
            Top actionable insights from your habit data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                  insight.confidence >= 0.8 ? "bg-green-500" :
                  insight.confidence >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                )} />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                    {insight.insight}
                  </h4>
                  {insight.recommendation && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {insight.recommendation}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                    <span className="text-xs text-slate-500">
                      Based on {insight.dataPoints} data points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CorrelationsTab({ correlations }: { correlations: HabitCorrelation[] }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Habit Correlations
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Discover which habits influence each other
        </p>
      </div>

      {correlations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Correlations Found
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Track your habits for a few more weeks to discover correlations
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {correlations.map((correlation, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      {correlation.habit1Name} ↔ {correlation.habit2Name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {correlation.relationship === 'positive' 
                        ? 'These habits tend to be completed together'
                        : correlation.relationship === 'negative'
                        ? 'These habits rarely occur on the same day'
                        : 'No clear relationship between these habits'
                      }
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-2xl font-bold mb-1",
                      correlation.relationship === 'positive' ? "text-green-600" :
                      correlation.relationship === 'negative' ? "text-red-600" : "text-slate-600"
                    )}>
                      {correlation.correlationCoefficient > 0 ? '+' : ''}
                      {correlation.correlationCoefficient.toFixed(3)}
                    </div>
                    <Badge variant={
                      correlation.significance === 'high' ? 'default' :
                      correlation.significance === 'moderate' ? 'secondary' : 'outline'
                    }>
                      {correlation.significance} significance
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Sample Size: </span>
                    <span className="font-medium">{correlation.sampleSize} days</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Confidence: </span>
                    <span className="font-medium">{Math.round(correlation.confidenceLevel * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PatternsTab({ patterns }: { patterns: ProductivityPattern[] }) {
  const groupedPatterns = patterns.reduce((acc, pattern) => {
    if (!acc[pattern.type]) acc[pattern.type] = [];
    acc[pattern.type].push(pattern);
    return acc;
  }, {} as Record<string, ProductivityPattern[]>);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Productivity Patterns
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Identified patterns in your habit completion
        </p>
      </div>

      {patterns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Zap className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Patterns Detected
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Keep tracking to discover your productivity patterns
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPatterns).map(([type, typePatterns]) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="capitalize flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>{type.replace('_', ' ')} Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {typePatterns.map((pattern, index) => (
                    <div key={pattern.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {pattern.description}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            pattern.impact === 'high' ? 'default' :
                            pattern.impact === 'medium' ? 'secondary' : 'outline'
                          }>
                            {pattern.impact} impact
                          </Badge>
                          <div className="text-sm text-slate-500">
                            {Math.round(pattern.strength * 100)}% strength
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                        {pattern.recommendation}
                      </p>
                      
                      <div className="text-xs text-slate-500">
                        Frequency: {pattern.frequency} • Detected: {new Date(pattern.detectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightsTab({ insights }: { insights: HabitInsight[] }) {
  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) acc[insight.type] = [];
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, HabitInsight[]>);

  const insightTypeLabels = {
    completion_trend: 'Completion Trends',
    optimal_timing: 'Optimal Timing',
    difficulty_analysis: 'Difficulty Analysis',
    streak_prediction: 'Streak Predictions'
  };

  const insightTypeIcons = {
    completion_trend: TrendingUp,
    optimal_timing: Target,
    difficulty_analysis: BarChart3,
    streak_prediction: Zap
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Habit Insights
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          AI-powered insights about your habits
        </p>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Insights Available
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Continue tracking your habits to generate insights
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedInsights).map(([type, typeInsights]) => {
            const IconComponent = insightTypeIcons[type as keyof typeof insightTypeIcons] || Brain;
            return (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5" />
                    <span>{insightTypeLabels[type as keyof typeof insightTypeLabels] || type}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {typeInsights.map((insight, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              {insight.insight}
                            </h4>
                            {insight.recommendation && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                💡 {insight.recommendation}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              insight.confidence >= 0.8 ? "bg-green-500" :
                              insight.confidence >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                            )} />
                            <span className="text-sm text-slate-500">
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-xs">
                            {insight.habitName}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {insight.dataPoints} data points
                          </span>
                          {insight.actionable && (
                            <Badge variant="secondary" className="text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}