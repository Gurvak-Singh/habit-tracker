"use client";

import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Dumbbell,
  Droplets,
  Moon,
  Apple,
  Coffee,
  Music,
  Heart,
  Camera,
  Gamepad2,
  Palette as Brush,
  Car,
  Plane,
  Home,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Target,
  Trophy,
  Star,
  Flame,
  Sun,
  TreePine,
  Flower,
  Bike,
  User as Running,
  Waves as Swimming,
  Utensils,
  GraduationCap,
  Briefcase,
  Smartphone,
  Laptop,
  Headphones,
  type LucideIcon
} from "lucide-react";

export interface IconOption {
  name: string;
  icon: LucideIcon;
  category: string;
}

export const iconOptions: IconOption[] = [
  // Health & Fitness
  { name: "Dumbbell", icon: Dumbbell, category: "Health" },
  { name: "Running", icon: Running, category: "Health" },
  { name: "Swimming", icon: Swimming, category: "Health" },
  { name: "Bike", icon: Bike, category: "Health" },
  { name: "Heart", icon: Heart, category: "Health" },
  { name: "Droplets", icon: Droplets, category: "Health" },
  { name: "Apple", icon: Apple, category: "Health" },
  { name: "Utensils", icon: Utensils, category: "Health" },
  
  // Lifestyle
  { name: "Moon", icon: Moon, category: "Lifestyle" },
  { name: "Sun", icon: Sun, category: "Lifestyle" },
  { name: "Coffee", icon: Coffee, category: "Lifestyle" },
  { name: "Home", icon: Home, category: "Lifestyle" },
  { name: "Car", icon: Car, category: "Lifestyle" },
  { name: "Plane", icon: Plane, category: "Lifestyle" },
  
  // Learning & Work
  { name: "BookOpen", icon: BookOpen, category: "Learning" },
  { name: "GraduationCap", icon: GraduationCap, category: "Learning" },
  { name: "Briefcase", icon: Briefcase, category: "Learning" },
  { name: "Laptop", icon: Laptop, category: "Learning" },
  
  // Entertainment
  { name: "Music", icon: Music, category: "Entertainment" },
  { name: "Camera", icon: Camera, category: "Entertainment" },
  { name: "Gamepad2", icon: Gamepad2, category: "Entertainment" },
  { name: "Headphones", icon: Headphones, category: "Entertainment" },
  
  // Creativity
  { name: "Brush", icon: Brush, category: "Creativity" },
  { name: "Flower", icon: Flower, category: "Creativity" },
  { name: "TreePine", icon: TreePine, category: "Creativity" },
  
  // Goals & Tracking
  { name: "Target", icon: Target, category: "Goals" },
  { name: "Trophy", icon: Trophy, category: "Goals" },
  { name: "Star", icon: Star, category: "Goals" },
  { name: "Flame", icon: Flame, category: "Goals" },
  { name: "Zap", icon: Zap, category: "Goals" },
  
  // Time & Organization
  { name: "Calendar", icon: Calendar, category: "Organization" },
  { name: "Clock", icon: Clock, category: "Organization" },
  { name: "MapPin", icon: MapPin, category: "Organization" },
  { name: "Smartphone", icon: Smartphone, category: "Organization" },
];

interface IconPickerProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  color?: string;
}

export const IconPicker = memo(function IconPicker({ selectedIcon, onIconSelect, color = "#3B82F6" }: IconPickerProps) {
  const selectedIconData = useMemo(() => 
    iconOptions.find(option => option.name === selectedIcon), 
    [selectedIcon]
  );
  const SelectedIconComponent = selectedIconData?.icon || Target;

  const categories = useMemo(() => 
    Array.from(new Set(iconOptions.map(option => option.category))), 
    []
  );

  const categorizedIcons = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = iconOptions.filter(option => option.category === category);
      return acc;
    }, {} as Record<string, IconOption[]>);
  }, [categories]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-12 h-12 p-2 flex items-center justify-center"
          type="button"
        >
          <SelectedIconComponent className="w-6 h-6" style={{ color }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-3">
            Choose an icon
          </h4>
          <div className="h-64 overflow-y-auto overflow-x-hidden styled-scrollbar">
            <div className="space-y-4 pr-2">
              {categories.map(category => {
                const categoryIcons = categorizedIcons[category];
                return (
                  <div key={category}>
                    <h5 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
                      {category}
                    </h5>
                    <div className="grid grid-cols-6 gap-2">
                      {categoryIcons.map(({ name, icon: IconComponent }) => {
                        // Safety check to ensure IconComponent exists
                        if (!IconComponent) {
                          console.warn(`Icon component not found for: ${name}`);
                          return null;
                        }
                        
                        return (
                          <Button
                            key={name}
                            variant="ghost"
                            size="sm"
                            className={`w-10 h-10 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                              selectedIcon === name 
                                ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500" 
                                : ""
                            }`}
                            onClick={() => onIconSelect(name)}
                            type="button"
                          >
                            <IconComponent 
                              className="w-5 h-5" 
                              style={{ color: selectedIcon === name ? color : undefined }} 
                            />
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

export function getIconComponent(iconName: string): LucideIcon {
  const iconData = iconOptions.find(option => option.name === iconName);
  const IconComponent = iconData?.icon || Target;
  
  // Safety check
  if (!IconComponent) {
    console.warn(`Icon component not found for: ${iconName}, falling back to Target`);
    return Target;
  }
  
  return IconComponent;
}