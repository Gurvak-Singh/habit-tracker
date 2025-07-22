"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Zap,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Calendar,
  Brain,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCounter, PulsingDot } from './animated-counter';

// Basic loading spinner
export function LoadingSpinner({ 
  size = 'md', 
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )} 
    />
  );
}

// Skeleton loader for text content
export function TextSkeleton({ 
  lines = 1, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="space-y-2">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-8 bg-muted rounded w-1/3" />
      </CardContent>
    </Card>
  );
}

// Advanced loading state with progress
export function ProgressLoader({ 
  progress, 
  status, 
  message,
  className 
}: { 
  progress: number;
  status: 'loading' | 'success' | 'error';
  message?: string;
  className?: string;
}) {
  const statusConfig = {
    loading: { icon: Loader2, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    success: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500' },
    error: { icon: AlertCircle, color: 'text-red-500', bgColor: 'bg-red-500' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center">
        <div className={cn(
          "p-3 rounded-full bg-opacity-10",
          config.bgColor.replace('bg-', 'bg-').replace('-500', '-50')
        )}>
          <Icon className={cn(
            "w-8 h-8",
            config.color,
            status === 'loading' && "animate-spin"
          )} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            {message || `${status.charAt(0).toUpperCase() + status.slice(1)}...`}
          </span>
          <AnimatedCounter value={progress} suffix="%" />
        </div>
      </div>
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  children,
  blur = true
}: {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  blur?: boolean;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <div className={cn(blur && "blur-sm opacity-50")}>{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm font-medium text-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Multi-step loading indicator
export function MultiStepLoader({
  steps,
  currentStep,
  className
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
              index < currentStep ? "bg-green-500 text-white" :
              index === currentStep ? "bg-blue-500 text-white" :
              "bg-muted text-muted-foreground"
            )}>
              {index < currentStep ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                index + 1
              )}
            </div>
            
            <span className={cn(
              "text-sm",
              index === currentStep ? "font-medium text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
            
            {index === currentStep && (
              <PulsingDot size="sm" color="primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Habit-specific loading components
export function HabitCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-muted rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="flex space-x-2 mt-3">
              <div className="h-5 bg-muted rounded w-16" />
              <div className="h-5 bg-muted rounded w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-muted rounded" />
          <div className="h-5 bg-muted rounded w-32" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-16" />
          <div className="h-6 bg-muted rounded w-12" />
        </div>
        <div className="h-2 bg-muted rounded" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-6 bg-muted rounded w-8 mx-auto" />
              <div className="h-3 bg-muted rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard-specific skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-48" />
        </div>
        <div className="flex space-x-2">
          <div className="h-9 bg-muted rounded w-20" />
          <div className="h-9 bg-muted rounded w-24" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-8 bg-muted rounded w-12" />
                </div>
                <div className="w-8 h-8 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsCardSkeleton />
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <HabitCardSkeleton key={i} />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

// Smart loading state that adapts based on content type
interface SmartLoaderProps {
  type: 'habits' | 'analytics' | 'dashboard' | 'generic';
  isLoading: boolean;
  error?: string;
  retry?: () => void;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  loadingMessage?: string;
}

export function SmartLoader({
  type,
  isLoading,
  error,
  retry,
  children,
  emptyState,
  loadingMessage
}: SmartLoaderProps) {
  if (error) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <h3 className="font-semibold text-destructive mb-2">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          {retry && (
            <Button onClick={retry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    const skeletonMap = {
      habits: <div className="space-y-4">{Array.from({ length: 3 }, (_, i) => <HabitCardSkeleton key={i} />)}</div>,
      analytics: <AnalyticsCardSkeleton />,
      dashboard: <DashboardSkeleton />,
      generic: (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{loadingMessage || 'Loading...'}</p>
          </div>
        </div>
      )
    };

    return skeletonMap[type];
  }

  return <>{children}</>;
}

// Loading button with state management
export function LoadingButton({
  isLoading,
  children,
  onClick,
  loadingText = "Loading...",
  ...props
}: {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  loadingText?: string;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      onClick={onClick}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Progressive loading with phases
export function ProgressiveLoader({
  phases,
  className
}: {
  phases: Array<{ name: string; duration: number; icon?: any }>;
  className?: string;
}) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phase = phases[currentPhase];
    if (!phase) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const phaseProgress = Math.min((elapsed / phase.duration) * 100, 100);
      setProgress(phaseProgress);

      if (phaseProgress >= 100 && currentPhase < phases.length - 1) {
        setCurrentPhase(prev => prev + 1);
        setProgress(0);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentPhase, phases]);

  const currentPhaseData = phases[currentPhase];
  const Icon = currentPhaseData?.icon || Loader2;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Icon className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg">{currentPhaseData?.name}</h3>
          <p className="text-sm text-muted-foreground">
            Phase {currentPhase + 1} of {phases.length}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Loading...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex justify-center space-x-1">
        {phases.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index < currentPhase ? "bg-green-500" :
              index === currentPhase ? "bg-primary animate-pulse" :
              "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default {
  LoadingSpinner,
  TextSkeleton,
  CardSkeleton,
  ProgressLoader,
  LoadingOverlay,
  MultiStepLoader,
  HabitCardSkeleton,
  AnalyticsCardSkeleton,
  DashboardSkeleton,
  SmartLoader,
  LoadingButton,
  ProgressiveLoader
};