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
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
                    Letter signed successfully!
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="response" className="text-slate-200">
                    Response (Optional)
                </Label>
                <Textarea
                    id="response"
                    name="response"
                    placeholder="Add your response here..."
                    rows={4}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <p className="text-xs text-slate-500">
                    You can add an optional response when signing this letter
                </p>
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
                {isPending ? 'Signing...' : 'Sign Letter'}
            </Button>
        </form>
    )
}
