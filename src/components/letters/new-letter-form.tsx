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
                <div className="bg-destructive/5 border border-destructive/10 text-destructive px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
                    <div className="size-2 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            {/* Document Properties Header */}
            <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-xl shadow-foreground/[0.02] flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Recipient</Label>
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient} required>
                            <SelectTrigger className="rounded-xl border-border/50 bg-muted/20 h-12 px-4 focus:ring-primary/10 transition-all font-bold text-sm">
                                <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl p-2 shadow-2xl border-border/50 backdrop-blur-xl">
                                {recipients.map((recipient) => (
                                    <SelectItem key={recipient.id} value={recipient.id} className="rounded-lg py-2.5 px-3 focus:bg-primary/5 transition-colors">
                                        <span className="font-black text-xs tracking-tight">{recipient.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Category</Label>
                        <Select value={category} onValueChange={(v: any) => setCategory(v)} required>
                            <SelectTrigger className="rounded-xl border-border/50 bg-muted/20 h-12 px-4 focus:ring-primary/10 transition-all font-bold text-sm">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl p-2 shadow-2xl border-border/50 backdrop-blur-xl">
                                <SelectItem value="RESPONSE_REQUIRED" className="rounded-lg py-2.5 px-3 focus:bg-primary/5 transition-colors">
                                    <span className="font-black text-xs tracking-tight">Response Required</span>
                                </SelectItem>
                                <SelectItem value="NO_RESPONSE_REQUIRED" className="rounded-lg py-2.5 px-3 focus:bg-primary/5 transition-colors">
                                    <span className="font-black text-xs tracking-tight">Informational</span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Document Subject"
                            required
                            defaultValue={defaultSubject}
                            className="rounded-xl border-border/50 bg-muted/20 h-12 px-4 focus-visible:ring-primary/10 transition-all font-black text-sm tracking-tight"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
                    <Button
                        type="submit"
                        disabled={isPending || !selectedRecipient || !body}
                        onClick={() => setShouldSend(false)}
                        variant="ghost"
                        className="rounded-xl h-11 px-6 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-muted transition-all active:scale-[0.98]"
                    >
                        {isPending && !shouldSend ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending || !selectedRecipient || !body}
                        onClick={() => setShouldSend(true)}
                        className="rounded-xl h-11 px-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-[#0078D4] hover:bg-[#006ABD] text-white border-none"
                    >
                        {isPending && shouldSend ? 'Sending...' : 'Send Document'}
                    </Button>
                </div>
            </div>

            {/* The Word Editor */}
            <div className="flex-1 min-h-[800px]">
                <RichTextEditor
                    content={body}
                    onChange={setBody}
                    placeholder="Start typing your professional document..."
                />
            </div>
        </form>
    )
}
