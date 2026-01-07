'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/actions/auth'

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@company.com"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full"
            >
                {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>
    )
}
