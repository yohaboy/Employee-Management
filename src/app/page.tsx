import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentNode } from '@/lib/auth'
import { Shield, TreePine, Mail, Lock, CheckCircle2, ArrowRight, Globe, Zap } from 'lucide-react'

export default async function Home() {
  const currentNode = await getCurrentNode()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2.5" href="/">
          <div className="bg-primary p-1.5 rounded-md">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">SecureHierarchy</span>
        </Link>
        <nav className="ml-auto flex gap-8 items-center">
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#solutions">
            Solutions
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          {currentNode ? (
            <Button asChild variant="default" size="sm" className="font-semibold">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="/login">
                Sign in
              </Link>
              <Button asChild variant="default" size="sm" className="font-semibold">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-32 lg:pb-40">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                Enterprise-Grade Security
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl max-w-4xl leading-[1.1]">
                The Operating System for <span className="text-primary">Secure Organizations</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                Streamline your organizational hierarchy with military-grade security.
                Manage communications, track audit trails, and ensure compliance with
                our unified hierarchy management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
                  <Link href={currentNode ? "/dashboard" : "/login"}>
                    Start Building Your Hierarchy <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
                  Book a Demo
                </Button>
              </div>

              {/* Hero Image */}
              <div className="mt-16 w-full max-w-5xl mx-auto rounded-xl border bg-muted/30 p-2 shadow-2xl">
                <div className="rounded-lg border bg-background overflow-hidden aspect-[16/9] relative">
                  <Image
                    src="/dark.png"
                    alt="Dashboard Preview Light"
                    fill
                    className="object-cover block dark:hidden"
                    priority
                    unoptimized
                  />
                  <Image
                    src="/light.png"
                    alt="Dashboard Preview Dark"
                    fill
                    className="object-cover hidden dark:block"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-[0.03] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[grid-linear-gradient(to_right,#80808012_1px,transparent_1px),grid-linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 mx-auto">
            <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
              Trusted by forward-thinking institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale">
              <div className="font-bold text-2xl tracking-tighter">TECHCORP</div>
              <div className="font-bold text-2xl tracking-tighter">SECURENET</div>
              <div className="font-bold text-2xl tracking-tighter">GLOBALBANK</div>
              <div className="font-bold text-2xl tracking-tighter">NODESYSTEMS</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Built for Scale and Security</h2>
              <p className="max-w-[700px] text-muted-foreground text-lg">
                Our platform provides the tools necessary for modern organizations to maintain
                clear structures and secure communication channels.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <TreePine className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dynamic Hierarchy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize and manage complex organizational structures with our intuitive tree-based node system.
                </p>
              </div>
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Verified Letters</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Official communications are cryptographically signed and tracked from creation to delivery.
                </p>
              </div>
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Zero-Trust Access</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Granular permissions ensure that users only access information relevant to their position.
                </p>
              </div>
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Immutable Audit</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every action is recorded in a tamper-proof audit log, providing full transparency and accountability.
                </p>
              </div>
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Compliance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Meet international standards for data protection and organizational management out of the box.
                </p>
              </div>
              <div className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-all">
                <div className="mb-6 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor organizational health and communication flow with advanced real-time analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg tracking-tight">SecureHierarchy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SecureHierarchy Inc. All rights reserved. Built for secure enterprises.
            </p>
            <nav className="flex gap-6">
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
                Terms
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
                Privacy
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-primary transition-colors" href="#">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}


