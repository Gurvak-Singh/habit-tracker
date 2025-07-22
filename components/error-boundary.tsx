"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  RefreshCw,
  Bug,
  ChevronDown,
  ChevronRight,
  Home,
  Copy,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId?: string;
  isRetrying: boolean;
  retryCount: number;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (
    error: Error,
    errorInfo: ErrorInfo,
    retry: () => void
  ) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo, eventId?: string) => void;
  level?: "page" | "section" | "component";
  showDetails?: boolean;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false,
      retryCount: 0,
      showDetails: props.showDetails ?? false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const eventId = this.generateEventId();

    this.setState({
      errorInfo,
      eventId,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call error reporting callback
    this.props.onError?.(error, errorInfo, eventId);

    // In production, you might want to send this to an error reporting service
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange) {
      if (resetKeys) {
        // Check if any of the reset keys have changed
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => key !== prevProps.resetKeys?.[index]
        );

        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      } else {
        // Reset if any props have changed (shallow comparison)
        const propsChanged = Object.keys(this.props).some(
          (key) =>
            this.props[key as keyof ErrorBoundaryProps] !==
            prevProps[key as keyof ErrorBoundaryProps]
        );

        if (propsChanged) {
          this.resetErrorBoundary();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: undefined,
      isRetrying: false,
      retryCount: 0,
      showDetails: this.props.showDetails ?? false,
    });
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount >= maxRetries) {
      return;
    }

    this.setState({ isRetrying: true });

    this.retryTimeoutId = setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: undefined,
        isRetrying: false,
        retryCount: prevState.retryCount + 1,
      }));
    }, 1000);
  };

  private toggleDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  private copyErrorToClipboard = () => {
    const { error, errorInfo, eventId } = this.state;

    const errorText = `
Error ID: ${eventId}
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      // You might want to show a toast notification here
      console.log("Error details copied to clipboard");
    });
  };

  private getErrorSeverity(): "low" | "medium" | "high" | "critical" {
    const { error } = this.state;

    if (!error) return "low";

    // Determine severity based on error type or message
    if (
      error.name === "ChunkLoadError" ||
      error.message.includes("Loading chunk")
    ) {
      return "medium";
    }

    if (error.name === "TypeError" && error.message.includes("undefined")) {
      return "high";
    }

    if (
      error.message.includes("Network Error") ||
      error.message.includes("fetch")
    ) {
      return "medium";
    }

    return "high";
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  private getErrorCategory(): string {
    const { error } = this.state;

    if (!error) return "Unknown";

    if (error.name === "ChunkLoadError") return "Code Splitting";
    if (error.name === "TypeError") return "Type Error";
    if (error.name === "ReferenceError") return "Reference Error";
    if (error.message.includes("Network")) return "Network";
    if (error.message.includes("fetch")) return "API";

    return "Runtime Error";
  }

  render() {
    const {
      hasError,
      error,
      errorInfo,
      eventId,
      isRetrying,
      retryCount,
      showDetails,
    } = this.state;
    const {
      children,
      fallback,
      level = "component",
      maxRetries = 3,
    } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo!, this.handleRetry);
      }

      // Default error UI based on level
      return this.renderDefaultErrorUI();
    }

    return children;
  }

  private renderDefaultErrorUI() {
    const {
      hasError,
      error,
      errorInfo,
      eventId,
      isRetrying,
      retryCount,
      showDetails,
    } = this.state;
    const { level = "component", maxRetries = 3 } = this.props;

    const severity = this.getErrorSeverity();
    const category = this.getErrorCategory();
    const canRetry = retryCount < maxRetries;

    if (level === "page") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Something went wrong
                  </CardTitle>
                  <CardDescription>
                    We encountered an unexpected error. Please try refreshing
                    the page.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.renderErrorDetails()}
              {this.renderErrorActions()}
            </CardContent>
          </Card>
        </div>
      );
    }

    if (level === "section") {
      return (
        <Card className="border-destructive/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bug className="w-5 h-5 text-destructive" />
                <CardTitle className="text-lg">Section Error</CardTitle>
              </div>
              <Badge
                variant="outline"
                className={cn("text-white", this.getSeverityColor(severity))}
              >
                {severity.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>
              This section encountered an error and couldn't be loaded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {this.renderErrorDetails()}
            {this.renderErrorActions()}
          </CardContent>
        </Card>
      );
    }

    // Component level error
    return (
      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">
            Component Error
          </span>
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          This component failed to render properly.
        </p>
        {this.renderErrorActions(true)}
      </div>
    );
  }

  private renderErrorDetails() {
    const { error, errorInfo, eventId, showDetails } = this.state;
    const severity = this.getErrorSeverity();
    const category = this.getErrorCategory();

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{category}</Badge>
            <Badge
              variant="outline"
              className={cn("text-white", this.getSeverityColor(severity))}
            >
              {severity}
            </Badge>
            {eventId && (
              <Badge variant="secondary" className="font-mono text-xs">
                ID: {eventId}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={this.toggleDetails}
            className="h-8"
          >
            {showDetails ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Details
          </Button>
        </div>

        <Collapsible open={showDetails}>
          <CollapsibleContent>
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium text-sm mb-1">Error Message</h4>
                <code className="text-sm bg-background p-2 rounded border block">
                  {error?.message || "Unknown error occurred"}
                </code>
              </div>

              {error?.stack && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Stack Trace</h4>
                  <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Component Stack</h4>
                  <pre className="text-xs bg-background p-2 rounded border overflow-auto max-h-32">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  private renderErrorActions(compact: boolean = false) {
    const { isRetrying, retryCount } = this.state;
    const { maxRetries = 3 } = this.props;
    const canRetry = retryCount < maxRetries;

    if (compact) {
      return (
        <div className="flex items-center space-x-2">
          {canRetry && (
            <Button
              onClick={this.handleRetry}
              disabled={isRetrying}
              size="sm"
              variant="outline"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry ({retryCount}/{maxRetries})
                </>
              )}
            </Button>
          )}
          <Button onClick={this.copyErrorToClipboard} size="sm" variant="ghost">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center space-x-2">
          {canRetry && (
            <Button
              onClick={this.handleRetry}
              disabled={isRetrying}
              variant="outline"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again ({retryCount}/{maxRetries})
                </>
              )}
            </Button>
          )}

          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={this.copyErrorToClipboard} variant="ghost" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Error
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

// Hook for error boundary context
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // In a React component, this would trigger the nearest error boundary
    throw error;
  };
}

export default ErrorBoundary;
