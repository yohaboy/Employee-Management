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

import { RichTextEditor } from '@/components/ui/rich-text-editor'

interface Recipient {
    id: string
    name: string
    email: string
    position: string
}

interface NewLetterFormProps {
    recipients: Recipient[]
    parentId?: string
    defaultSubject?: string
    defaultRecipientId?: string
}

export function NewLetterForm({ recipients, parentId, defaultSubject, defaultRecipientId }: NewLetterFormProps) {
    const router = useRouter()
    const [selectedRecipient, setSelectedRecipient] = useState(defaultRecipientId || '')
    const [category, setCategory] = useState<'RESPONSE_REQUIRED' | 'NO_RESPONSE_REQUIRED'>('RESPONSE_REQUIRED')
    const [body, setBody] = useState('')
    const [shouldSend, setShouldSend] = useState(false)

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('receiverId', selectedRecipient)
        formData.set('category', category)
        formData.set('body', body)
        if (parentId) {
            formData.set('parentId', parentId)
        }

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-xs font-black uppercase tracking-widest">Recipient *</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                        <SelectTrigger className="rounded-none border-2 border-foreground h-12">
                            <SelectValue placeholder="Select a recipient" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-foreground">
                            {recipients.map((recipient) => (
                                <SelectItem key={recipient.id} value={recipient.id} className="font-medium">
                                    {recipient.name} - {recipient.position}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest">Category *</Label>
                    <Select value={category} onValueChange={(v: any) => setCategory(v)} required>
                        <SelectTrigger className="rounded-none border-2 border-foreground h-12">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none border-2 border-foreground">
                            <SelectItem value="RESPONSE_REQUIRED" className="font-medium">Response Required</SelectItem>
                            <SelectItem value="NO_RESPONSE_REQUIRED" className="font-medium">No Response Required</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest">Subject *</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter letter subject"
                    required
                    defaultValue={defaultSubject}
                    className="rounded-none border-2 border-foreground h-12 font-bold"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body" className="text-xs font-black uppercase tracking-widest">Message *</Label>
                <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Write your professional letter here..."
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient || !body}
                    onClick={() => setShouldSend(false)}
                    variant="outline"
                    className="flex-1 rounded-none border-2 border-foreground h-14 font-black uppercase tracking-widest hover:bg-muted transition-all"
                >
                    {isPending ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient || !body}
                    onClick={() => setShouldSend(true)}
                    className="flex-1 rounded-none border-2 border-foreground h-14 font-black uppercase tracking-widest shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    {isPending ? 'Sending...' : 'Send Letter'}
                </Button>
            </div>
        </form>
    )
}
