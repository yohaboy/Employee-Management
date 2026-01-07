'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { signLetterAction } from '@/app/actions/letters'

interface SignLetterFormProps {
    letterId: string
}

export function SignLetterForm({ letterId }: SignLetterFormProps) {
    async function handleSign(_prevState: any, formData: FormData) {
        return signLetterAction(letterId, formData)
    }

    const [state, formAction, isPending] = useActionState(handleSign, null)

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="bg-green-500/10 border-2 border-green-500 text-green-600 dark:text-green-400 px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    Letter signed successfully!
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="response">
                    Response (Optional)
                </Label>
                <Textarea
                    id="response"
                    name="response"
                    placeholder="Add your response here..."
                    rows={4}
                />
                <p className="text-xs text-muted-foreground font-medium">
                    You can add an optional response when signing this letter
                </p>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full"
            >
                {isPending ? 'Signing...' : 'Sign Letter'}
            </Button>
        </form>
    )
}
