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
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Add a new employee as your direct report
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {state?.error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200">Full Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@company.com"
                            required
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="position" className="text-slate-200">Position *</Label>
                        <Input
                            id="position"
                            name="position"
                            placeholder="Software Engineer"
                            required
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-200">Password *</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Minimum 8 characters"
                            required
                            minLength={8}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <p className="text-xs text-slate-500">
                            This password will be used by the employee to log in
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 border-slate-600 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            {isPending ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
