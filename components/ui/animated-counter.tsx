"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { AnimationUtils, durations } from '@/lib/animations';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  animateOnChange?: boolean;
  startDelay?: number;
  easing?: (t: number) => number;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
};

export function AnimatedCounter({
  value,
  duration = durations.normal,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  animateOnChange = true,
  startDelay = 0,
  easing = easingFunctions.easeOut
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(animateOnChange ? 0 : value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(animateOnChange ? 0 : value);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animateOnChange) {
      setDisplayValue(value);
      return;
    }

    if (previousValue.current === value) return;

    const animateValue = () => {
      setIsAnimating(true);
      
      AnimationUtils.animateNumber(
        previousValue.current,
        value,
        duration,
        (currentValue) => {
          setDisplayValue(currentValue);
        },
        easing
      );

      setTimeout(() => {
        setIsAnimating(false);
        previousValue.current = value;
      }, duration);
    };

    if (startDelay > 0) {
      setTimeout(animateValue, startDelay);
    } else {
      animateValue();
    }
  }, [value, duration, decimals, animateOnChange, startDelay, easing]);

  const formattedValue = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span
      ref={elementRef}
      className={cn(
        "tabular-nums transition-all duration-200",
        isAnimating && "text-primary font-medium",
        className
      )}
    >
      {prefix}{formattedValue}{suffix}
    </span>
  );
}

interface AnimatedProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
  className?: string;
  showValue?: boolean;
  color?: string;
  backgroundColor?: string;
  animateOnMount?: boolean;
}

export function AnimatedProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  duration = durations.slow,
  className,
  showValue = true,
  color = 'rgb(59, 130, 246)', // blue-500
  backgroundColor = 'rgb(241, 245, 249)', // slate-100
  animateOnMount = true
}: AnimatedProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(animateOnMount ? 0 : value);
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedValue / max) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      AnimationUtils.animateNumber(
        animateOnMount ? 0 : animatedValue,
        normalizedValue,
        duration,
        setAnimatedValue,
        easingFunctions.easeOut
      );
    }, 100); // Small delay to ensure mount animation

    return () => clearTimeout(timer);
  }, [normalizedValue, duration, animateOnMount]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedCounter
            value={percentage}
            decimals={0}
            suffix="%"
            className="text-2xl font-bold text-foreground"
            duration={duration}
          />
        </div>
      )}
    </div>
  );
}

interface AnimatedBarProps {
  value: number;
  max?: number;
  height?: number;
  duration?: number;
  className?: string;
  showValue?: boolean;
  color?: string;
  backgroundColor?: string;
  animateOnMount?: boolean;
  rounded?: boolean;
}

export function AnimatedBar({
  value,
  max = 100,
  height = 8,
  duration = durations.normal,
  className,
  showValue = false,
  color = 'rgb(59, 130, 246)', // blue-500
  backgroundColor = 'rgb(241, 245, 249)', // slate-100
  animateOnMount = true,
  rounded = true
}: AnimatedBarProps) {
  const [animatedValue, setAnimatedValue] = useState(animateOnMount ? 0 : value);
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (animatedValue / max) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      AnimationUtils.animateNumber(
        animateOnMount ? 0 : animatedValue,
        normalizedValue,
        duration,
        setAnimatedValue,
        easingFunctions.easeOut
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [normalizedValue, duration, animateOnMount]);

  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn("w-full overflow-hidden", rounded && "rounded-full")}
        style={{ 
          height: `${height}px`, 
          backgroundColor 
        }}
      >
        <div
          className={cn("h-full transition-all ease-out", rounded && "rounded-full")}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            transitionDuration: `${duration}ms`
          }}
        />
      </div>
      
      {showValue && (
        <div className="mt-1 text-right">
          <AnimatedCounter
            value={percentage}
            decimals={0}
            suffix="%"
            className="text-sm text-muted-foreground"
            duration={duration}
          />
        </div>
      )}
    </div>
  );
}

interface PulsingDotProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'success' | 'warning' | 'destructive' | 'primary' | 'muted';
  className?: string;
}

export function PulsingDot({ size = 'md', color = 'success', className }: PulsingDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-red-500',
    primary: 'bg-blue-500',
    muted: 'bg-gray-400'
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-full animate-ping absolute opacity-75",
        sizeClasses[size],
        colorClasses[color]
      )} />
      <div className={cn(
        "rounded-full relative",
        sizeClasses[size],
        colorClasses[color]
      )} />
    </div>
  );
}

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  className,
  size = 'md',
  variant = 'default'
}: FloatingActionButtonProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const variantClasses = {
    default: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    destructive: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 rounded-full shadow-lg transition-all duration-200",
        "hover:scale-110 hover:shadow-xl active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        "group flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      title={label}
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      
      {label && (
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}