'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
            <input type="hidden" name="letterId" value={letterId} />

            {state?.error && (
                <div className="bg-destructive/5 border border-destructive/10 text-destructive px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            {state && 'success' in state && state.success && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Document authenticated successfully
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label htmlFor="response" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">
                        Official Response / Remarks
                    </Label>
                    <Textarea
                        id="response"
                        name="response"
                        placeholder="Enter your official response or remarks here..."
                        className="min-h-[120px] rounded-2xl border-border/50 bg-muted/20 focus:ring-primary/10 transition-all p-5 font-medium resize-none"
                    />
                </div>

                <div className="flex items-start space-x-4 p-5 rounded-2xl bg-primary/[0.02] border border-primary/10 group hover:bg-primary/[0.04] transition-all">
                    <Checkbox id="confirm" name="confirm" required className="mt-1 rounded-md border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="confirm"
                            className="text-xs font-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer tracking-tight"
                        >
                            I confirm my digital signature
                        </label>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">
                            Applying official cryptographic seal to this document
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                {isPending ? 'Authenticating...' : 'Sign and Authenticate'}
            </Button>
        </form>
    )
}
