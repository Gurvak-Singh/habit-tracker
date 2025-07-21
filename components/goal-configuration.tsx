"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Goal, GoalType, GOAL_TEMPLATES, generateGoalId } from "@/lib/goals";
import { Target, Trophy, Calendar, TrendingUp, Clock, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalConfigurationProps {
  existingGoals?: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
  className?: string;
}

const goalTypeIcons = {
  streak_target: Target,
  completion_count: Trophy,
  consistency_rate: TrendingUp,
  time_target: Clock,
  weekly_target: Calendar,
  custom: Plus
};

const goalTypeLabels = {
  streak_target: 'Streak Target',
  completion_count: 'Completion Count',
  consistency_rate: 'Consistency Rate',
  time_target: 'Time Target',
  weekly_target: 'Weekly Target',
  custom: 'Custom Goal'
};

export function GoalConfiguration({
  existingGoals = [],
  onGoalsChange,
  className = ''
}: GoalConfigurationProps) {
  const [goals, setGoals] = useState<Goal[]>(existingGoals);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'streak_target',
    targetValue: 21,
    targetUnit: 'days',
    description: ''
  });

  const updateGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    onGoalsChange(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.type || !newGoal.targetValue) return;

    const goal: Goal = {
      id: generateGoalId(),
      type: newGoal.type as GoalType,
      targetValue: newGoal.targetValue,
      targetUnit: newGoal.targetUnit || 'units',
      deadline: newGoal.deadline,
      description: newGoal.description,
      isCompleted: false,
      createdAt: Date.now()
    };

    updateGoals([...goals, goal]);
    setNewGoal({
      type: 'streak_target',
      targetValue: 21,
      targetUnit: 'days',
      description: ''
    });
    setShowAddForm(false);
  };

  const removeGoal = (goalId: string) => {
    updateGoals(goals.filter(g => g.id !== goalId));
  };

  const useTemplate = (template: Omit<Goal, 'id' | 'isCompleted' | 'completedAt' | 'createdAt'>) => {
    const goal: Goal = {
      id: generateGoalId(),
      ...template,
      isCompleted: false,
      createdAt: Date.now()
    };
    
    updateGoals([...goals, goal]);
  };

  const getGoalTypeDescription = (type: GoalType): string => {
    switch (type) {
      case 'streak_target':
        return 'Maintain consecutive days without missing';
      case 'completion_count':
        return 'Reach a total number of completions';
      case 'consistency_rate':
        return 'Achieve a percentage consistency over time';
      case 'time_target':
        return 'Continue habit for a specific duration';
      case 'weekly_target':
        return 'Meet weekly goals for consecutive weeks';
      case 'custom':
        return 'Define your own custom goal';
      default:
        return '';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Goal Setting
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Set specific goals to stay motivated and track your progress
        </p>
      </div>

      {/* Existing Goals */}
      {goals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Your Goals ({goals.length})
          </h4>
          {goals.map((goal) => {
            const IconComponent = goalTypeIcons[goal.type];
            return (
              <Card key={goal.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-slate-900 dark:text-white">
                            {goal.targetValue} {goal.targetUnit}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {goalTypeLabels[goal.type]}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {goal.description}
                          </p>
                        )}
                        {goal.deadline && (
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(goal.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Templates */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Quick Goals
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GOAL_TEMPLATES.slice(0, 4).map((template, index) => {
            const IconComponent = goalTypeIcons[template.type];
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow border-dashed"
                onClick={() => useTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white text-sm">
                        {template.targetValue} {template.targetUnit}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {template.description}
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Custom Goal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Custom Goal
          </h4>
          {!showAddForm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Goal
            </Button>
          )}
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Custom Goal</CardTitle>
              <CardDescription>
                Define a specific goal that motivates you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Goal Type */}
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select
                  value={newGoal.type}
                  onValueChange={(value) => setNewGoal({ ...newGoal, type: value as GoalType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(goalTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center space-x-2">
                          {(() => {
                            const IconComponent = goalTypeIcons[value as GoalType];
                            return <IconComponent className="w-4 h-4" />;
                          })()}
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getGoalTypeDescription(newGoal.type as GoalType)}
                </p>
              </div>

              {/* Target Value & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    min="1"
                    value={newGoal.targetValue || ''}
                    onChange={(e) => setNewGoal({ 
                      ...newGoal, 
                      targetValue: parseInt(e.target.value) || 0 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetUnit">Unit</Label>
                  <Input
                    id="targetUnit"
                    value={newGoal.targetUnit || ''}
                    onChange={(e) => setNewGoal({ 
                      ...newGoal, 
                      targetUnit: e.target.value 
                    })}
                    placeholder="days, times, percentage..."
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    description: e.target.value 
                  })}
                  placeholder="Describe what this goal means to you..."
                  rows={2}
                />
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline || ''}
                  onChange={(e) => setNewGoal({ 
                    ...newGoal, 
                    deadline: e.target.value 
                  })}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button onClick={addGoal} className="flex-1">
                  Add Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}