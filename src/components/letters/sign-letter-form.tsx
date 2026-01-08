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
        const confirmed = formData.get('confirm_signature')
        if (!confirmed) {
            return { error: 'You must confirm your digital signature' }
        }
        return signLetterAction(letterId, formData)
    }

    const [state, formAction, isPending] = useActionState(handleSign, null)

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    {state.error}
                </div>
            )}

            {state && 'success' in state && state.success && (
                <div className="bg-green-500/10 border-2 border-green-500 text-green-600 dark:text-green-400 px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    Letter signed and authenticated successfully!
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="response" className="text-xs font-black uppercase tracking-widest">
                        Official Response (Optional)
                    </Label>
                    <Textarea
                        id="response"
                        name="response"
                        placeholder="Add your official response or remarks here..."
                        rows={6}
                        className="rounded-none border-2 border-foreground focus:ring-0"
                    />
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/30 border-2 border-foreground/10">
                    <input
                        type="checkbox"
                        id="confirm_signature"
                        name="confirm_signature"
                        className="mt-1 w-4 h-4 rounded-none border-2 border-foreground accent-primary"
                        required
                    />
                    <Label htmlFor="confirm_signature" className="text-xs font-bold leading-tight cursor-pointer">
                        I hereby confirm that I have read and understood the contents of this letter, and I am applying my digital signature as a formal acknowledgement and/or response.
                    </Label>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-none border-2 border-foreground h-14 font-black uppercase tracking-widest shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
                {isPending ? 'Authenticating...' : 'Apply Digital Signature'}
            </Button>
        </form>
    )
}
