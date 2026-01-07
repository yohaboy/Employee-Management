'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLetterAction, sendLetterAction } from '@/app/actions/letters'
import { useState } from 'react'

interface Recipient {
    id: string
    name: string
    email: string
    position: string
}

interface NewLetterFormProps {
    recipients: Recipient[]
}

export function NewLetterForm({ recipients }: NewLetterFormProps) {
    const router = useRouter()
    const [selectedRecipient, setSelectedRecipient] = useState('')
    const [shouldSend, setShouldSend] = useState(false)

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('receiverId', selectedRecipient)

        const result = await createLetterAction(formData)

        if (result?.error) {
            return result
        }

        if (result?.success && result.letterId && shouldSend) {
            await sendLetterAction(result.letterId)
        }

        router.push('/dashboard/letters')
        return result
    }

    const [state, formAction, isPending] = useActionState(handleSubmit, null)

    if (recipients.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <p>No available recipients. You need a parent or subordinates to send letters.</p>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="recipient" className="text-slate-200">Recipient *</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                    <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select a recipient" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                        {recipients.map((recipient) => (
                            <SelectItem key={recipient.id} value={recipient.id} className="text-white">
                                {recipient.name} - {recipient.position}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-200">Subject *</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter letter subject"
                    required
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body" className="text-slate-200">Message *</Label>
                <Textarea
                    id="body"
                    name="body"
                    placeholder="Write your message here..."
                    required
                    rows={10}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
            </div>

            <div className="flex gap-3">
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient}
                    onClick={() => setShouldSend(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                    {isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient}
                    onClick={() => setShouldSend(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {isPending ? 'Sending...' : 'Send Letter'}
                </Button>
            </div>
        </form>
    )
}
