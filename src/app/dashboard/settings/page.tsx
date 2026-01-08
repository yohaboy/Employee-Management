import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Shield, User, Bell, Lock } from 'lucide-react'

export default async function SettingsPage() {
    const currentNode = await requireAuth()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-1">Settings</h2>
                <p className="text-muted-foreground text-sm">Manage your account and security preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <User className="size-4 text-primary" />
                                <CardTitle className="text-sm font-bold">Profile Information</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Update your personal details and position</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</Label>
                                    <Input defaultValue={currentNode.name} className="rounded-xl border-muted-foreground/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</Label>
                                    <Input defaultValue={currentNode.email} disabled className="rounded-xl border-muted-foreground/20 bg-muted/30" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Position / Title</Label>
                                <Input defaultValue={currentNode.position} disabled className="rounded-xl border-muted-foreground/20 bg-muted/30" />
                            </div>
                            <Button className="rounded-xl font-bold px-6">Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock className="size-4 text-primary" />
                                <CardTitle className="text-sm font-bold">Security</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Manage your password and authentication methods</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Password</Label>
                                <Input type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" className="rounded-xl border-muted-foreground/20" />
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl font-bold px-6">Update Password</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-primary" />
                                <CardTitle className="text-sm font-bold">Notifications</CardTitle>
                            </div>
                            <CardDescription className="text-xs">Configure how you receive alerts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold">Email Notifications</p>
                                    <p className="text-[10px] text-muted-foreground">Receive alerts for new letters</p>
                                </div>
                                <div className="h-5 w-9 rounded-full bg-primary/20 relative cursor-pointer">
                                    <div className="absolute right-1 top-1 size-3 rounded-full bg-primary" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2 border-t border-border/50">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold">Security Alerts</p>
                                    <p className="text-[10px] text-muted-foreground">Important account activity</p>
                                </div>
                                <div className="h-5 w-9 rounded-full bg-primary/20 relative cursor-pointer">
                                    <div className="absolute right-1 top-1 size-3 rounded-full bg-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-border/50 bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-primary" />
                                <CardTitle className="text-sm font-bold">System Status</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground font-medium">Encryption</span>
                                <span className="text-emerald-600 font-bold">ACTIVE</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground font-medium">Audit Logging</span>
                                <span className="text-emerald-600 font-bold">ENABLED</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground font-medium">Hierarchy Level</span>
                                <span className="font-bold">{currentNode.position}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
