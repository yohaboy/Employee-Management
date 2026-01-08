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
        <form action={formAction} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {state?.error && (
                <div className="bg-destructive/5 border border-destructive/10 text-destructive px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <div className="size-2 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="recipient" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Recipient *</Label>
                    <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                        <SelectTrigger className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus:ring-primary/10 transition-all font-bold">
                            <SelectValue placeholder="Select a recipient" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2 shadow-2xl border-border/50 backdrop-blur-xl">
                            {recipients.map((recipient) => (
                                <SelectItem key={recipient.id} value={recipient.id} className="rounded-xl py-3 px-4 focus:bg-primary/5 transition-colors">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-black text-sm tracking-tight">{recipient.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="category" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Category *</Label>
                    <Select value={category} onValueChange={(v: any) => setCategory(v)} required>
                        <SelectTrigger className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus:ring-primary/10 transition-all font-bold">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2 shadow-2xl border-border/50 backdrop-blur-xl">
                            <SelectItem value="RESPONSE_REQUIRED" className="rounded-xl py-3 px-4 focus:bg-primary/5 transition-colors">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-black text-sm tracking-tight">Response Required</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="NO_RESPONSE_REQUIRED" className="rounded-xl py-3 px-4 focus:bg-primary/5 transition-colors">
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-black text-sm tracking-tight">No Response Required</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="subject" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Subject *</Label>
                <Input
                    id="subject"
                    name="subject"
                    placeholder="Enter a descriptive subject line"
                    required
                    defaultValue={defaultSubject}
                    className="rounded-2xl border-border/50 bg-muted/20 h-14 px-5 focus-visible:ring-primary/10 transition-all font-black text-lg tracking-tight placeholder:font-bold placeholder:text-muted-foreground/30"
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="body" className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Message *</Label>
                <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Write your professional letter here..."
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-border/50">
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient || !body}
                    onClick={() => setShouldSend(false)}
                    variant="outline"
                    className="flex-1 rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs hover:bg-muted/50 hover:border-border transition-all active:scale-[0.98]"
                >
                    {isPending && !shouldSend ? 'Saving Draft...' : 'Save as Draft'}
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !selectedRecipient || !body}
                    onClick={() => setShouldSend(true)}
                    className="flex-1 rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isPending && shouldSend ? 'Sending...' : 'Send Letter'}
                </Button>
            </div>
        </form>
    )
}
