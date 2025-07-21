"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Slate", value: "#64748B" },
  { name: "Emerald", value: "#059669" },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-12 h-12 p-1 flex items-center justify-center"
          type="button"
        >
          <div 
            className="w-full h-full rounded-md border border-slate-300 dark:border-slate-600"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <h4 className="font-medium text-sm text-slate-900 dark:text-white mb-3">
          Choose a color
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map(({ name, value }) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 p-1 hover:scale-110 transition-transform ${
                selectedColor === value 
                  ? "ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2" 
                  : ""
              }`}
              onClick={() => onColorSelect(value)}
              title={name}
              type="button"
            >
              <div 
                className="w-full h-full rounded-md border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: value }}
              />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}