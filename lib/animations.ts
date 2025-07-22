"use client";

// Animation utilities and configurations
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;
  iterations?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Predefined animation classes for Tailwind CSS
export const animations = {
  // Entrance animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-300',
  fadeInLeft: 'animate-in fade-in slide-in-from-left-4 duration-300',
  fadeInRight: 'animate-in fade-in slide-in-from-right-4 duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleInSoft: 'animate-in zoom-in-95 duration-300 ease-out',
  scaleOut: 'animate-out zoom-out-95 duration-150',
  
  // Slide animations
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideInRight: 'animate-in slide-in-from-right duration-300',
  slideInUp: 'animate-in slide-in-from-bottom duration-300',
  slideInDown: 'animate-in slide-in-from-top duration-300',
  
  // Exit animations
  fadeOut: 'animate-out fade-out duration-200',
  slideOut: 'animate-out slide-out-to-right duration-200',
  
  // Loading animations
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  
  // Custom animations
  wiggle: 'animate-wiggle',
  heartbeat: 'animate-heartbeat',
  glow: 'animate-glow',
  
  // Hover animations (for use with hover: prefix)
  hoverScale: 'hover:scale-105 transition-transform duration-200',
  hoverGlow: 'hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300',
  hoverSlide: 'hover:translate-y-[-2px] transition-transform duration-200',
  hoverRotate: 'hover:rotate-3 transition-transform duration-200',
  
  // Focus animations
  focusScale: 'focus:scale-105 transition-transform duration-200',
  focusGlow: 'focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200',
  
  // State-based animations
  success: 'animate-pulse text-green-500',
  error: 'animate-bounce text-red-500',
  warning: 'animate-pulse text-yellow-500',
  
  // Micro-interactions
  buttonPress: 'active:scale-95 transition-transform duration-100',
  cardHover: 'hover:shadow-md hover:-translate-y-1 transition-all duration-200',
  
  // Stagger animations (for lists)
  stagger1: 'animate-in fade-in slide-in-from-bottom-4 duration-300 animation-delay-75',
  stagger2: 'animate-in fade-in slide-in-from-bottom-4 duration-300 animation-delay-150',
  stagger3: 'animate-in fade-in slide-in-from-bottom-4 duration-300 animation-delay-225',
  stagger4: 'animate-in fade-in slide-in-from-bottom-4 duration-300 animation-delay-300',
} as const;

// Animation timing functions
export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Custom cubic-bezier functions
  bounceIn: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounceOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  snappy: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
} as const;

// Duration presets (in milliseconds)
export const durations = {
  fastest: 100,
  faster: 150,
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
} as const;

// Stagger delays for list animations
export const staggerDelays = {
  xs: 50,
  sm: 75,
  md: 100,
  lg: 150,
  xl: 200,
} as const;

// Animation utility functions
export class AnimationUtils {
  // Create staggered animations for a list of elements
  static createStaggerAnimation(
    elements: NodeListOf<Element> | Element[], 
    animationClass: string, 
    staggerDelay: number = staggerDelays.md
  ) {
    Array.from(elements).forEach((element, index) => {
      const el = element as HTMLElement;
      el.style.animationDelay = `${index * staggerDelay}ms`;
      el.className = `${el.className} ${animationClass}`;
    });
  }

  // Animate a number value with easing
  static animateNumber(
    from: number,
    to: number,
    duration: number = durations.normal,
    callback: (value: number) => void,
    easing: (t: number) => number = (t: number) => t // linear by default
  ) {
    const startTime = Date.now();
    const difference = to - from;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = from + (difference * easedProgress);

      callback(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  // Animate element with custom keyframes
  static animateElement(
    element: HTMLElement,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions = {}
  ): Animation {
    return element.animate(keyframes, {
      duration: durations.normal,
      easing: easings.easeOut,
      fill: 'forwards',
      ...options
    });
  }

  // Create a spring animation effect
  static spring(
    element: HTMLElement,
    property: string,
    from: string | number,
    to: string | number,
    config: { tension?: number; friction?: number; duration?: number } = {}
  ) {
    const { tension = 120, friction = 14, duration = 1000 } = config;
    
    return this.animateElement(element, [
      { [property]: from },
      { [property]: to }
    ], {
      duration,
      easing: `cubic-bezier(${(tension - 100) / 1000}, ${friction / 100}, 0.5, 1)`
    });
  }

  // Shake animation for error states
  static shake(element: HTMLElement, intensity: number = 10) {
    return this.animateElement(element, [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity/2}px)` },
      { transform: `translateX(${intensity/2}px)` },
      { transform: 'translateX(0)' }
    ], {
      duration: durations.fast,
      easing: easings.easeOut
    });
  }

  // Pulse animation for notifications
  static pulse(element: HTMLElement, scale: number = 1.05, duration: number = durations.slow) {
    return this.animateElement(element, [
      { transform: 'scale(1)', opacity: '1' },
      { transform: `scale(${scale})`, opacity: '0.8' },
      { transform: 'scale(1)', opacity: '1' }
    ], {
      duration,
      iterations: 3,
      easing: easings.easeInOut
    });
  }

  // Glow effect for success states
  static glow(element: HTMLElement, color: string = '#22c55e', duration: number = durations.normal) {
    return this.animateElement(element, [
      { boxShadow: '0 0 0 0 transparent' },
      { boxShadow: `0 0 20px 5px ${color}40` },
      { boxShadow: '0 0 0 0 transparent' }
    ], {
      duration,
      iterations: 2,
      easing: easings.easeInOut
    });
  }

  // Typewriter effect for text
  static typewriter(
    element: HTMLElement, 
    text: string, 
    speed: number = 50
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      element.textContent = '';
      
      const type = () => {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      };
      
      type();
    });
  }

  // Morphing counter animation
  static morphNumber(
    element: HTMLElement,
    from: number,
    to: number,
    duration: number = durations.normal,
    decimals: number = 0
  ) {
    this.animateNumber(from, to, duration, (value) => {
      element.textContent = value.toFixed(decimals);
    }, (t: number) => 1 - Math.pow(1 - t, 3)); // easeOutCubic
  }

  // Confetti burst for celebrations
  static confetti(
    container: HTMLElement,
    particleCount: number = 50,
    colors: string[] = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
  ) {
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.left = '50%';
      particle.style.top = '50%';
      
      container.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;
      const distance = velocity;
      
      this.animateElement(particle, [
        { 
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: '1'
        },
        { 
          transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`,
          opacity: '0'
        }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: easings.easeOut
      }).addEventListener('finish', () => {
        particle.remove();
      });
    }
  }
}

// Hook-like utility for React components
export const useAnimation = () => {
  const animate = (
    element: HTMLElement | null,
    animationType: keyof typeof animations,
    config?: AnimationConfig
  ) => {
    if (!element) return;
    
    const animationClass = animations[animationType];
    element.className = `${element.className} ${animationClass}`;
    
    if (config?.duration) {
      element.style.animationDuration = `${config.duration}ms`;
    }
    
    if (config?.delay) {
      element.style.animationDelay = `${config.delay}ms`;
    }
    
    if (config?.easing) {
      element.style.animationTimingFunction = config.easing;
    }
  };

  return {
    animate,
    AnimationUtils,
    animations,
    easings,
    durations
  };
};

// CSS-in-JS animations for styled components or inline styles
export const keyframes = {
  wiggle: {
    '0%, 100%': { transform: 'rotate(-3deg)' },
    '50%': { transform: 'rotate(3deg)' }
  },
  heartbeat: {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' }
  },
  glow: {
    '0%, 100%': { 
      boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' 
    },
    '50%': { 
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' 
    }
  },
  slideInFromBottom: {
    '0%': { 
      transform: 'translateY(100%)',
      opacity: '0'
    },
    '100%': { 
      transform: 'translateY(0)',
      opacity: '1'
    }
  },
  slideOutToTop: {
    '0%': { 
      transform: 'translateY(0)',
      opacity: '1'
    },
    '100%': { 
      transform: 'translateY(-100%)',
      opacity: '0'
    }
  }
} as const;

export default AnimationUtils;