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
            <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No available recipients</p>
            </div>
        )
    }

    return (
        <form action={formAction} className="flex flex-col h-full gap-6">
            {state?.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm font-semibold flex items-center gap-3">
                    <div className="size-2 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            {/* Document Properties Header */}
            <div className="bg-background border border-border rounded-lg p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Recipient</Label>
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                            <SelectTrigger className="rounded-md border-border bg-muted/30 h-10 px-3 focus:ring-1 focus:ring-ring transition-all font-medium text-sm">
                                <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md p-1 shadow-lg border-border">
                                {recipients.map((recipient) => (
                                    <SelectItem key={recipient.id} value={recipient.id} className="rounded-sm py-2 px-2 focus:bg-accent transition-colors">
                                        <span className="font-semibold text-xs">{recipient.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Category</Label>
                        <Select value={category} onValueChange={(v: any) => setCategory(v)} required>
                            <SelectTrigger className="rounded-md border-border bg-muted/30 h-10 px-3 focus:ring-1 focus:ring-ring transition-all font-medium text-sm">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-md p-1 shadow-lg border-border">
                                <SelectItem value="RESPONSE_REQUIRED" className="rounded-sm py-2 px-2 focus:bg-accent transition-colors">
                                    <span className="font-semibold text-xs">Response Required</span>
                                </SelectItem>
                                <SelectItem value="NO_RESPONSE_REQUIRED" className="rounded-sm py-2 px-2 focus:bg-accent transition-colors">
                                    <span className="font-semibold text-xs">Informational</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Document Subject"
                            required
                            defaultValue={defaultSubject}
                            className="rounded-md border-border bg-muted/30 h-10 px-3 focus-visible:ring-1 focus-visible:ring-ring transition-all font-semibold text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button
                        type="submit"
                        disabled={isPending || !selectedRecipient || !body}
                        onClick={() => setShouldSend(false)}
                        variant="outline"
                        className="rounded-md h-9 px-4 font-bold uppercase tracking-wider text-[11px] hover:bg-muted transition-colors"
                    >
                        {isPending && !shouldSend ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || !selectedRecipient || !body}
                        onClick={() => setShouldSend(true)}
                        className="rounded-md h-9 px-6 font-bold uppercase tracking-wider text-[11px] transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                    >
                        {isPending && shouldSend ? 'Sending...' : 'Send Document'}
                    </Button>
                </div>
            </div>

            {/* The Editor */}
            <div className="flex-1 min-h-[600px]">
                <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Start typing your professional document..."
                />
            </div>
        </form>
    )
}

