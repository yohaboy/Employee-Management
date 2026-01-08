import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentNode } from '@/lib/auth'
import { Shield, TreePine, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react'

export default async function Home() {
  const currentNode = await getCurrentNode()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-primary p-1.5 rounded-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">SecureHierarchy</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          {currentNode ? (
            <Button asChild variant="default" size="sm" className="rounded-full px-6">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="rounded-full px-6">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
                Secure Office Management v1.0
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl">
                Manage Your Organization with <span className="text-primary">Absolute Security</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A strict tree-based hierarchy system with secure digital signatures,
                audit trails, and encrypted letter management for modern enterprises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20">
                  <Link href={currentNode ? "/dashboard" : "/login"}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Core Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage your organizational structure and communications securely.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <TreePine className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Strict Hierarchy</h3>
                <p className="text-muted-foreground text-center">
                  Define clear reporting lines with our tree-based node system. Manage departments and teams with ease.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Secure Letters</h3>
                <p className="text-muted-foreground text-center">
                  Send official communications that are tracked, signed, and archived with full integrity.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Digital Signatures</h3>
                <p className="text-muted-foreground text-center">
                  Verify authenticity with built-in digital signatures for every official document and response.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Audit Trails</h3>
                <p className="text-muted-foreground text-center">
                  Every action is logged. Track who did what, when, and from where with detailed audit logs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-muted-foreground text-center">
                  Granular permissions based on the organizational hierarchy. Users only see what they need to.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Real-time Analytics</h3>
                <p className="text-muted-foreground text-center">
                  Monitor the flow of information and task completion across your entire organization.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 SecureHierarchy Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

import { Activity } from 'lucide-react'

