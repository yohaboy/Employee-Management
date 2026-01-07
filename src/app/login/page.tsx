import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-foreground mb-2 uppercase tracking-tighter">Office Management</h1>
                    <p className="text-muted-foreground font-medium">Hierarchical Letter System</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-black uppercase tracking-tight">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
