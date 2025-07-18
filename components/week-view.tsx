interface WeekViewProps {
  completedDays: boolean[]
  className?: string
}

export function WeekView({ completedDays, className = "" }: WeekViewProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {completedDays.map((completed, index) => (
        <div key={index} className="flex flex-col items-center space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{days[index]}</span>
          <div
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              completed
                ? "bg-blue-600 dark:bg-blue-400 shadow-sm"
                : "bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"
            }`}
          />
        </div>
      ))}
    </div>
  )
}
