"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  data: Array<{
    date: string
    completions: number
    percentage: number
  }>
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">30-Day Completion Trend</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">Daily habit completion over the last month</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completions: {
              label: "Completions",
              color: "hsl(var(--chart-1))",
            },
            percentage: {
              label: "Success Rate",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="date" className="text-slate-600 dark:text-slate-300" tick={{ fontSize: 12 }} />
              <YAxis className="text-slate-600 dark:text-slate-300" tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="var(--color-completions)"
                strokeWidth={3}
                dot={{ fill: "var(--color-completions)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "var(--color-completions)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
