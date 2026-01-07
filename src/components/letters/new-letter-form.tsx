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
            <div className="text-center py-8 text-muted-foreground">
                <p>No available recipients. You need a parent or subordinates to send letters.</p>
            </div>
        )
    }

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 rounded-none text-sm font-bold shadow-brutal-sm">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="recipient">Recipient *</Label>
                <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                    <SelectTrigger className="rounded-none border-2">
                        <SelectValue placeholder="Select a recipient" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-2">
                        {recipients.map((recipient) => (
                            <SelectItem key={recipient.id} value={recipient.id} className="font-medium">
                                {recipient.name} - {recipient.position}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter letter subject"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Message *</Label>
                <Textarea
                    id="body"
                    name="body"
                    placeholder="Write your message here..."
                    required
                    rows={10}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient}
                    onClick={() => setShouldSend(false)}
                    variant="outline"
                    className="flex-1"
                >
                    {isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient}
                    onClick={() => setShouldSend(true)}
                    className="flex-1"
                >
                    {isPending ? 'Sending...' : 'Send Letter'}
                </Button>
            </div>
        </form>
    )
}
