'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { createNodeAction } from '@/app/actions/auth'

interface CreateUserDialogProps {
    parentId: string
}

export function CreateUserDialog({ parentId }: CreateUserDialogProps) {
    const [open, setOpen] = useState(false)

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('parentId', parentId)
        const result = await createNodeAction(_prevState, formData)

        if (result?.success) {
            setOpen(false)
        }

        return result
    }

    const [state, formAction, isPending] = useActionState(handleSubmit, null)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Create User
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">Create New User</DialogTitle>
                    <DialogDescription>
                        Add a new employee as your direct report
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-6">
                    {state?.error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@company.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="position">Position *</Label>
                        <Input
                            id="position"
                            name="position"
                            placeholder="Software Engineer"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Minimum 8 characters"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-muted-foreground font-medium">
                            This password will be used by the employee to log in
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1"
                        >
                            {isPending ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
