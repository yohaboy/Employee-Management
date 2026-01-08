import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Shield, User, Bell, Lock } from 'lucide-react'

export default async function SettingsPage() {
    const currentNode = await requireAuth()

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Settings</h2>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest opacity-60">Manage your account and security preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/5 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <User className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-black tracking-tight">Profile Information</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Update your personal details and position</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Full Name</Label>
                                    <Input defaultValue={currentNode.name} className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus-visible:ring-primary/10 transition-all font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Email Address</Label>
                                    <Input defaultValue={currentNode.email} disabled className="rounded-2xl border-border/50 bg-muted/10 h-14 px-5 font-bold text-muted-foreground/50 cursor-not-allowed" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Position / Title</Label>
                                <Input defaultValue={currentNode.position} disabled className="rounded-2xl border-border/50 bg-muted/10 h-14 px-5 font-bold text-muted-foreground/50 cursor-not-allowed" />
                            </div>
                            <div className="pt-4">
                                <Button className="rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-14 px-10 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/5 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <Lock className="size-4" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-black tracking-tight">Security</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Manage your password and authentication methods</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Current Password</Label>
                                <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus-visible:ring-primary/10 transition-all font-bold" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus-visible:ring-primary/10 transition-all font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus-visible:ring-primary/10 transition-all font-bold" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button variant="outline" className="rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-14 px-10 hover:bg-muted/50 transition-all active:scale-[0.98]">Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-xl shadow-foreground/[0.02] ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="border-b border-border/50 bg-muted/5 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                    <Bell className="size-4" />
                                </div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em]">Notifications</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-xs font-black tracking-tight">Email Notifications</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">New letter alerts</p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary/20 relative cursor-pointer group-hover:bg-primary/30 transition-colors">
                                    <div className="absolute right-1 top-1 size-4 rounded-full bg-primary shadow-sm" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-all">
                                <div className="space-y-1">
                                    <p className="text-xs font-black tracking-tight">Security Alerts</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">Account activity</p>
                                </div>
                                <div className="h-6 w-11 rounded-full bg-primary/20 relative cursor-pointer group-hover:bg-primary/30 transition-colors">
                                    <div className="absolute right-1 top-1 size-4 rounded-full bg-primary shadow-sm" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-primary/5 ring-1 ring-primary/20 bg-primary/[0.02] overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20" />
                        <CardHeader className="border-b border-primary/10 bg-primary/5 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Shield className="size-4" />
                                </div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">System Status</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Encryption</span>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                    Active
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Audit Logging</span>
                                <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                                    Enabled
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hierarchy Level</span>
                                <span className="font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-1 rounded-md">{currentNode.position}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
