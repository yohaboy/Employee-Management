'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { signLetterAction } from '@/app/actions/letters'

interface SignLetterFormProps {
    letterId: string
}

export function SignLetterForm({ letterId }: SignLetterFormProps) {
    const [state, formAction, isPending] = useActionState(
        async (_prevState: any, formData: FormData) => {
            return signLetterAction(letterId, formData)
        },
        null
    )

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm font-semibold">
                    {state.error}
                </div>
            )}

            {state && 'success' in state && state.success && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold">
                    Letter signed and authenticated successfully!
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="response" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Official Response / Remarks
                    </label>
                    <Textarea
                        id="response"
                        name="response"
                        placeholder="Enter your official response or remarks here..."
                        className="min-h-[100px] rounded-xl border-muted-foreground/20 focus:ring-primary/20"
                    />
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                    <input
                        type="checkbox"
                        id="confirm"
                        name="confirm"
                        required
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="confirm"
                            className="text-xs font-semibold leading-none cursor-pointer"
                        >
                            I confirm my digital signature
                        </label>
                        <p className="text-[10px] text-muted-foreground font-medium">
                            By checking this, you are applying your official digital signature to this document.
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl h-11 font-bold shadow-sm transition-all"
            >
                {isPending ? 'Authenticating...' : 'Sign and Authenticate Document'}
            </Button>
        </form>
    )
}
