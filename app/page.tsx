import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Target, Plus, BarChart, Calendar, Play, BarChart3, CreditCard } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">TrackMyHabits</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              How it Works
            </Link>
            <ThemeToggle />
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 bg-transparent"
              >
                <Play className="w-4 h-4 mr-2" />
                Demo App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight slide-in">
              Track<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">My</span>Habits
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed fade-in">
              Build better habits, one day at a time
            </p>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto fade-in">
              Transform your life with our intuitive habit tracking app. Set goals, track progress, and build lasting
              positive changes.
            </p>
            
            {/* Demo Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 scale-in">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="fluid-button text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 glass-effect"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/habit-cards">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 glass-effect"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Habit Cards
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 bounce-in">
              🚀 Demo mode - All features are fully functional with sample data
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 slide-in">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto fade-in">
              Our powerful features help you build and maintain habits that stick
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 fluid-card scale-in">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 floating-animation">
                  <BarChart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Track Daily Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                  Monitor your habits with simple check-ins and detailed progress tracking to stay on course.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 fluid-card scale-in">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 floating-animation">
                  <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  Visualize Your Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                  See your progress with beautiful charts and streak counters that motivate you to keep going.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 fluid-card scale-in">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 floating-animation">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">Stay Motivated</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                  Get personalized insights, reminders, and achievements to maintain momentum on your journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How it works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started in three simple steps and begin your transformation today
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Create Your Habits</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Add the habits you want to build. Set custom goals and choose how often you want to practice them.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. Track Daily</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Check in each day with a simple tap. Build consistency and watch your streaks grow over time.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. See Progress</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Review your progress with detailed analytics and celebrate your achievements along the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your life?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who have already built lasting habits with TrackMyHabits
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Building Habits
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">TrackMyHabits</span>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TrackMyHabits. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
