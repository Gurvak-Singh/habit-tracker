"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center p-1">
        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
      </div>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-blue-600"
      />
      <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    </div>
  )
} 