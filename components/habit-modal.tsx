"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import { GoalConfiguration } from "./goal-configuration";
import { NotificationSettings } from "./notification-settings";
import { Habit } from "@/lib/storage";
import { Goal } from "@/lib/goals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  weeklyGoal: z.number().min(1, "Weekly goal must be at least 1").max(7, "Weekly goal cannot exceed 7"),
  category: z.string().optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions'>, goals?: Goal[]) => Promise<boolean>;
  habit?: Habit | null;
  mode: "create" | "edit";
}

const categories = [
  "Health & Fitness",
  "Learning",
  "Productivity",
  "Lifestyle",
  "Creativity",
  "Social",
  "Finance",
  "Personal Growth",
];

export function HabitModal({ isOpen, onClose, onSave, habit, mode }: HabitModalProps) {
  const [selectedIcon, setSelectedIcon] = useState("Target");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "daily",
      weeklyGoal: 7,
      category: "none",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && habit) {
        form.reset({
          name: habit.name,
          description: habit.description || "",
          frequency: habit.frequency,
          weeklyGoal: habit.weeklyGoal,
          category: habit.category || "none",
        });
        setSelectedIcon(habit.icon);
        setSelectedColor(habit.color);
        // Load existing goals if any
        setSelectedGoals([]);
      } else {
        form.reset({
          name: "",
          description: "",
          frequency: "daily",
          weeklyGoal: 7,
          category: "none",
        });
        setSelectedIcon("Target");
        setSelectedColor("#3B82F6");
        setSelectedGoals([]);
      }
      setActiveTab("basic");
    }
  }, [isOpen, mode, habit, form]);

  const handleSubmit = async (data: HabitFormData) => {
    setIsLoading(true);
    try {
      const habitData = {
        ...data,
        icon: selectedIcon,
        color: selectedColor,
        category: data.category === "none" ? undefined : data.category,
      };

      const success = await onSave(habitData, selectedGoals);
      if (success) {
        onClose();
        form.reset();
      }
    } catch (error) {
      console.error("Error saving habit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  };

  const getWeeklyGoalDescription = (frequency: string, weeklyGoal: number) => {
    switch (frequency) {
      case "daily":
        return "For daily habits, set how many days per week you want to complete this habit.";
      case "weekly":
        return "For weekly habits, this represents how many times per week.";
      case "custom":
        return "Set your custom weekly goal for this habit.";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Habit" : "Edit Habit"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Add a new habit and set goals to track your progress."
              : "Update your habit details and preferences."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Icon and Color Selection */}
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <IconPicker 
                      selectedIcon={selectedIcon}
                      onIconSelect={setSelectedIcon}
                      color={selectedColor}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <ColorPicker 
                      selectedColor={selectedColor}
                      onColorSelect={setSelectedColor}
                    />
                  </div>
                </div>

                {/* Habit Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habit Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Read for 30 minutes" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Optional description of your habit..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what this habit means to you or include specific details.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a category (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Organize your habits by category for better tracking.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Frequency */}
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often do you want to perform this habit?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weekly Goal */}
                <FormField
                  control={form.control}
                  name="weeklyGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Goal</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          max={7}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormDescription>
                        {getWeeklyGoalDescription(form.watch("frequency"), field.value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="goals" className="space-y-4">
                <GoalConfiguration
                  existingGoals={selectedGoals}
                  onGoalsChange={setSelectedGoals}
                />
              </TabsContent>

              <TabsContent value="reminders" className="space-y-4">
                <NotificationSettings
                  habitName={form.watch("name") || "Your Habit"}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Habit" : "Update Habit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}