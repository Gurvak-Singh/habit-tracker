"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, AlertTriangle, Info } from "lucide-react"
import * as Sentry from "@sentry/nextjs"

export default function TestSentryPage() {
  const testError = () => {
    throw new Error("This is a test error for Sentry debugging")
  }

  const testSentryCapture = () => {
    Sentry.captureMessage("This is a test message from Sentry", "info")
  }

  const testSentryException = () => {
    try {
      throw new Error("This is a test exception for Sentry")
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Sentry Testing Page
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Test Sentry error reporting and monitoring functionality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bug className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-600">Test Error</CardTitle>
                </div>
                <CardDescription>
                  This will throw an unhandled error to test Sentry error reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testError}
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Throw Test Error
                </Button>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-yellow-600">Test Exception</CardTitle>
                </div>
                <CardDescription>
                  This will capture a handled exception in Sentry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testSentryException}
                  variant="outline" 
                  className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 dark:border-yellow-800 dark:text-yellow-400 dark:hover:bg-yellow-950"
                >
                  Capture Exception
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-blue-600">Test Message</CardTitle>
                </div>
                <CardDescription>
                  This will send a test message to Sentry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={testSentryCapture}
                  variant="outline" 
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  Send Test Message
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Sentry Configuration Status
            </h2>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Sentry SDK installed and configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Server-side error tracking enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Client-side error tracking enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Performance monitoring enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>✅ Global error boundary configured</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Check your Sentry dashboard at{" "}
              <a 
                href="https://sentry.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                sentry.io
              </a>{" "}
              to see captured errors and performance data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 