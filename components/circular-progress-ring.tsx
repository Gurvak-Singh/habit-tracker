interface CircularProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgressRing({
  percentage,
  size = 48,
  strokeWidth = 4,
  className = "",
}: CircularProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  
  // Ensure percentage is a valid number between 0 and 100
  const validPercentage = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference

  return (
    <div className={`relative ${className}`}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-600 dark:text-blue-400 transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{Math.round(validPercentage)}%</span>
      </div>
    </div>
  )
}
