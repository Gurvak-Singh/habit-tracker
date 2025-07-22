"use client";

import { Habit } from './storage';
import { analyticsEngine, AnalyticsReport, HabitCorrelation, ProductivityPattern, HabitInsight, ComparativeAnalytics } from './analytics-engine';

export class ReportGenerator {
  private static instance: ReportGenerator;

  private constructor() {}

  public static getInstance(): ReportGenerator {
    if (!ReportGenerator.instance) {
      ReportGenerator.instance = new ReportGenerator();
    }
    return ReportGenerator.instance;
  }

  // Generate comprehensive analytics report
  generateReport(
    habits: Habit[], 
    timeframe: { start: number; end: number },
    options: {
      includeCorrelations?: boolean;
      includePatterns?: boolean;
      includeInsights?: boolean;
      includeComparative?: boolean;
      title?: string;
    } = {}
  ): AnalyticsReport {
    const {
      includeCorrelations = true,
      includePatterns = true,
      includeInsights = true,
      includeComparative = true,
      title = 'Habit Analytics Report'
    } = options;

    const timeframeDays = Math.floor((timeframe.end - timeframe.start) / (24 * 60 * 60 * 1000));
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate analytics
    const correlations = includeCorrelations 
      ? analyticsEngine.calculateHabitCorrelations(habits, timeframeDays).slice(0, 10)
      : [];

    const patterns = includePatterns 
      ? analyticsEngine.detectProductivityPatterns(habits, timeframeDays).slice(0, 10)
      : [];

    const insights = includeInsights 
      ? analyticsEngine.generateHabitInsights(habits, timeframeDays).slice(0, 15)
      : [];

    const comparative = includeComparative 
      ? analyticsEngine.generateComparativeAnalytics(habits, 'month')
      : {
          timeframe: 'month' as const,
          habits: [],
          topPerformer: '',
          needsAttention: [],
          overallScore: 0,
          insights: []
        };

    // Generate summary
    const summary = this.generateSummary(habits, correlations, patterns, insights, comparative, timeframeDays);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(correlations, patterns, insights, comparative);

    return {
      id: reportId,
      title,
      generatedAt: Date.now(),
      timeframe,
      habits: habits.map(h => h.id),
      sections: {
        correlations,
        patterns,
        insights,
        comparative
      },
      summary,
      recommendations
    };
  }

  private generateSummary(
    habits: Habit[], 
    correlations: HabitCorrelation[], 
    patterns: ProductivityPattern[], 
    insights: HabitInsight[], 
    comparative: ComparativeAnalytics,
    timeframeDays: number
  ): string {
    const habitCount = habits.length;
    const strongCorrelations = correlations.filter(c => c.significance === 'high').length;
    const actionableInsights = insights.filter(i => i.actionable).length;
    const highImpactPatterns = patterns.filter(p => p.impact === 'high').length;
    
    let summary = `Over the past ${timeframeDays} days, analysis of your ${habitCount} habits reveals `;
    
    if (comparative.overallScore >= 80) {
      summary += "excellent progress with strong consistency across most habits. ";
    } else if (comparative.overallScore >= 60) {
      summary += "good progress with room for improvement in some areas. ";
    } else {
      summary += "opportunities for significant improvement in habit consistency. ";
    }

    if (strongCorrelations > 0) {
      summary += `${strongCorrelations} strong habit correlation${strongCorrelations > 1 ? 's' : ''} were identified, `;
    }

    if (highImpactPatterns > 0) {
      summary += `${highImpactPatterns} high-impact productivity pattern${highImpactPatterns > 1 ? 's' : ''} were detected, `;
    }

    if (actionableInsights > 0) {
      summary += `and ${actionableInsights} actionable insight${actionableInsights > 1 ? 's' : ''} were generated to help optimize your routine.`;
    }

    return summary.trim();
  }

  private generateRecommendations(
    correlations: HabitCorrelation[], 
    patterns: ProductivityPattern[], 
    insights: HabitInsight[], 
    comparative: ComparativeAnalytics
  ): string[] {
    const recommendations: string[] = [];

    // Correlation-based recommendations
    const positiveCorrelations = correlations.filter(c => c.relationship === 'positive' && c.significance === 'high');
    if (positiveCorrelations.length > 0) {
      const topCorrelation = positiveCorrelations[0];
      recommendations.push(
        `Consider creating a routine that combines ${topCorrelation.habit1Name} and ${topCorrelation.habit2Name}, as they show strong positive correlation (${topCorrelation.correlationCoefficient.toFixed(2)}).`
      );
    }

    // Pattern-based recommendations
    const dailyPatterns = patterns.filter(p => p.type === 'daily' && p.impact === 'high');
    if (dailyPatterns.length > 0) {
      const pattern = dailyPatterns[0];
      recommendations.push(`${pattern.recommendation}`);
    }

    // Performance-based recommendations
    if (comparative.needsAttention.length > 0) {
      const strugglingHabit = comparative.habits.find(h => h.habitId === comparative.needsAttention[0]);
      if (strugglingHabit) {
        recommendations.push(
          `Focus on improving "${strugglingHabit.habitName}" - consider breaking it down into smaller steps or adjusting the schedule.`
        );
      }
    }

    // Top performer leverage
    if (comparative.topPerformer) {
      const topHabit = comparative.habits.find(h => h.habitId === comparative.topPerformer);
      if (topHabit && topHabit.score >= 85) {
        recommendations.push(
          `Your success with "${topHabit.habitName}" shows you can build strong habits - apply the same approach to struggling habits.`
        );
      }
    }

    // Insight-based recommendations
    const trendInsights = insights.filter(i => i.type === 'completion_trend' && i.actionable);
    if (trendInsights.length > 0) {
      const insight = trendInsights[0];
      if (insight.recommendation) {
        recommendations.push(insight.recommendation);
      }
    }

    // Overall performance recommendations
    if (comparative.overallScore < 60) {
      recommendations.push(
        "Consider reducing the number of active habits and focusing on consistency with 2-3 core habits before expanding."
      );
    } else if (comparative.overallScore >= 85) {
      recommendations.push(
        "Your habit consistency is excellent - consider adding more challenging or transformative habits to your routine."
      );
    }

    return recommendations.slice(0, 6); // Limit to 6 recommendations
  }

  // Generate shareable report link (simulation)
  generateShareableLink(reportId: string): string {
    // In a real implementation, this would upload the report to a server
    // and return a public URL. For demo purposes, we'll create a mock URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://trackMyhabits.com';
    return `${baseUrl}/shared-reports/${reportId}`;
  }

  // Export report as JSON
  exportAsJSON(report: AnalyticsReport): string {
    return JSON.stringify(report, null, 2);
  }

  // Export report as markdown
  exportAsMarkdown(report: AnalyticsReport): string {
    const { title, generatedAt, timeframe, sections, summary, recommendations } = report;
    
    let markdown = `# ${title}\n\n`;
    markdown += `**Generated:** ${new Date(generatedAt).toLocaleString()}\n`;
    markdown += `**Timeframe:** ${new Date(timeframe.start).toLocaleDateString()} - ${new Date(timeframe.end).toLocaleDateString()}\n\n`;
    
    // Summary
    markdown += `## Executive Summary\n\n${summary}\n\n`;
    
    // Overall Score
    if (sections.comparative.overallScore > 0) {
      markdown += `## Overall Performance Score\n\n**${sections.comparative.overallScore}/100**\n\n`;
      sections.comparative.insights.forEach(insight => {
        markdown += `- ${insight}\n`;
      });
      markdown += '\n';
    }

    // Top Insights
    if (sections.insights.length > 0) {
      markdown += `## Key Insights\n\n`;
      sections.insights.slice(0, 5).forEach((insight, index) => {
        markdown += `### ${index + 1}. ${insight.habitName}\n`;
        markdown += `**Confidence:** ${Math.round(insight.confidence * 100)}%\n\n`;
        markdown += `${insight.insight}\n\n`;
        if (insight.recommendation) {
          markdown += `💡 **Recommendation:** ${insight.recommendation}\n\n`;
        }
      });
    }

    // Correlations
    if (sections.correlations.length > 0) {
      markdown += `## Habit Correlations\n\n`;
      sections.correlations.slice(0, 5).forEach((correlation, index) => {
        markdown += `### ${index + 1}. ${correlation.habit1Name} ↔ ${correlation.habit2Name}\n`;
        markdown += `- **Correlation:** ${correlation.correlationCoefficient.toFixed(3)}\n`;
        markdown += `- **Significance:** ${correlation.significance}\n`;
        markdown += `- **Relationship:** ${correlation.relationship}\n`;
        markdown += `- **Sample Size:** ${correlation.sampleSize} days\n\n`;
      });
    }

    // Patterns
    if (sections.patterns.length > 0) {
      markdown += `## Productivity Patterns\n\n`;
      sections.patterns.slice(0, 5).forEach((pattern, index) => {
        markdown += `### ${index + 1}. ${pattern.description}\n`;
        markdown += `- **Type:** ${pattern.type.replace('_', ' ')}\n`;
        markdown += `- **Impact:** ${pattern.impact}\n`;
        markdown += `- **Strength:** ${Math.round(pattern.strength * 100)}%\n`;
        markdown += `- **Recommendation:** ${pattern.recommendation}\n\n`;
      });
    }

    // Recommendations
    if (recommendations.length > 0) {
      markdown += `## Recommendations\n\n`;
      recommendations.forEach((rec, index) => {
        markdown += `${index + 1}. ${rec}\n`;
      });
      markdown += '\n';
    }

    // Habit Performance
    if (sections.comparative.habits.length > 0) {
      markdown += `## Habit Performance Summary\n\n`;
      markdown += `| Habit | Score | Completion Rate | Trend |\n`;
      markdown += `|-------|-------|----------------|-------|\n`;
      sections.comparative.habits.forEach(habit => {
        markdown += `| ${habit.habitName} | ${habit.score}/100 | ${Math.round(habit.completionRate * 100)}% | ${habit.trend} |\n`;
      });
    }

    markdown += `\n---\n*Report generated by TrackMyHabits Analytics Engine*`;
    
    return markdown;
  }

  // Export report as plain text
  exportAsText(report: AnalyticsReport): string {
    const { title, generatedAt, timeframe, sections, summary, recommendations } = report;
    
    let text = `${title}\n`;
    text += '='.repeat(title.length) + '\n\n';
    text += `Generated: ${new Date(generatedAt).toLocaleString()}\n`;
    text += `Timeframe: ${new Date(timeframe.start).toLocaleDateString()} - ${new Date(timeframe.end).toLocaleDateString()}\n\n`;
    
    // Summary
    text += `EXECUTIVE SUMMARY\n`;
    text += '-'.repeat(16) + '\n';
    text += `${summary}\n\n`;
    
    // Overall Score
    if (sections.comparative.overallScore > 0) {
      text += `OVERALL PERFORMANCE SCORE: ${sections.comparative.overallScore}/100\n\n`;
    }

    // Key Insights
    if (sections.insights.length > 0) {
      text += `KEY INSIGHTS\n`;
      text += '-'.repeat(12) + '\n';
      sections.insights.slice(0, 5).forEach((insight, index) => {
        text += `${index + 1}. ${insight.habitName}: ${insight.insight}\n`;
        if (insight.recommendation) {
          text += `   Recommendation: ${insight.recommendation}\n`;
        }
        text += `   Confidence: ${Math.round(insight.confidence * 100)}%\n\n`;
      });
    }

    // Recommendations
    if (recommendations.length > 0) {
      text += `RECOMMENDATIONS\n`;
      text += '-'.repeat(15) + '\n';
      recommendations.forEach((rec, index) => {
        text += `${index + 1}. ${rec}\n`;
      });
      text += '\n';
    }

    // Correlations
    if (sections.correlations.length > 0) {
      text += `HABIT CORRELATIONS\n`;
      text += '-'.repeat(18) + '\n';
      sections.correlations.slice(0, 3).forEach((correlation, index) => {
        text += `${index + 1}. ${correlation.habit1Name} <-> ${correlation.habit2Name}\n`;
        text += `   Correlation: ${correlation.correlationCoefficient.toFixed(3)} (${correlation.significance})\n\n`;
      });
    }

    text += `\nReport generated by TrackMyHabits Analytics Engine`;
    
    return text;
  }

  // Generate report for specific habits
  generateHabitSpecificReport(habits: Habit[], habitIds: string[], timeframeDays: number = 30): AnalyticsReport {
    const filteredHabits = habits.filter(h => habitIds.includes(h.id));
    const timeframe = {
      start: Date.now() - (timeframeDays * 24 * 60 * 60 * 1000),
      end: Date.now()
    };

    const habitNames = filteredHabits.map(h => h.name).join(', ');
    const title = `Habit-Specific Report: ${habitNames}`;

    return this.generateReport(filteredHabits, timeframe, { title });
  }

  // Generate quick weekly report
  generateWeeklyReport(habits: Habit[]): AnalyticsReport {
    const timeframe = {
      start: Date.now() - (7 * 24 * 60 * 60 * 1000),
      end: Date.now()
    };

    return this.generateReport(habits, timeframe, { 
      title: 'Weekly Habit Report',
      includeCorrelations: false, // Skip correlations for weekly reports (too short)
      includePatterns: true,
      includeInsights: true,
      includeComparative: true
    });
  }

  // Generate monthly report
  generateMonthlyReport(habits: Habit[]): AnalyticsReport {
    const timeframe = {
      start: Date.now() - (30 * 24 * 60 * 60 * 1000),
      end: Date.now()
    };

    return this.generateReport(habits, timeframe, { 
      title: 'Monthly Habit Report'
    });
  }

  // Generate quarterly report
  generateQuarterlyReport(habits: Habit[]): AnalyticsReport {
    const timeframe = {
      start: Date.now() - (90 * 24 * 60 * 60 * 1000),
      end: Date.now()
    };

    return this.generateReport(habits, timeframe, { 
      title: 'Quarterly Habit Report'
    });
  }
}

export const reportGenerator = ReportGenerator.getInstance();

// Utility functions for saving reports
export const saveReportToLocalStorage = (report: AnalyticsReport) => {
  try {
    const existingReports = JSON.parse(localStorage.getItem('habit_reports') || '[]');
    existingReports.unshift(report); // Add to beginning
    
    // Keep only last 10 reports
    const trimmedReports = existingReports.slice(0, 10);
    
    localStorage.setItem('habit_reports', JSON.stringify(trimmedReports));
    return true;
  } catch (error) {
    console.error('Failed to save report:', error);
    return false;
  }
};

export const getSavedReports = (): AnalyticsReport[] => {
  try {
    return JSON.parse(localStorage.getItem('habit_reports') || '[]');
  } catch (error) {
    console.error('Failed to load reports:', error);
    return [];
  }
};

export const downloadReport = (report: AnalyticsReport, format: 'json' | 'md' | 'txt' = 'md') => {
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'json':
      content = reportGenerator.exportAsJSON(report);
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'txt':
      content = reportGenerator.exportAsText(report);
      mimeType = 'text/plain';
      extension = 'txt';
      break;
    case 'md':
    default:
      content = reportGenerator.exportAsMarkdown(report);
      mimeType = 'text/markdown';
      extension = 'md';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-report-${new Date().toISOString().split('T')[0]}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};