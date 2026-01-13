'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, FileText, PenTool } from 'lucide-react'
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
    const [attachment, setAttachment] = useState<string | null>(null)
    const [isSigned, setIsSigned] = useState(false)

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('receiverId', selectedRecipient)
        formData.set('category', category)
        formData.set('body', body || (attachment ? 'See attached document' : ''))
        if (parentId) {
            formData.set('parentId', parentId)
        }
        if (attachment) {
            formData.set('attachment', attachment)
        }
        formData.set('signedBySender', String(isSigned))

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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAttachment(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    if (recipients.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">No available recipients</p>
            </div>
        )
    }

    const isPdf = attachment?.startsWith('data:application/pdf')

    return (
        <form action={formAction} className="flex flex-col h-full gap-6">
            {state?.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm font-semibold flex items-center gap-3">
                    <div className="size-2 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                {/* Left Column: Properties & Editor */}
                <div className="flex flex-col gap-6 overflow-y-auto pr-2">
                    <div className="bg-background border border-border rounded-lg p-6 flex flex-col gap-6 shadow-sm">
                        <div className="space-y-4">
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
                    </div>

                    <div className="flex-1 min-h-[300px] border border-border rounded-lg overflow-hidden flex flex-col bg-background shadow-sm">
                        <div className="bg-muted/30 border-b border-border px-4 py-2 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Message Body</span>
                        </div>
                        <div className="flex-1">
                            <RichTextEditor
                                content={body}
                                onChange={setBody}
                                placeholder="Type your message here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Attachment & Preview */}
                <div className="flex flex-col gap-6 h-full min-h-0">
                    <div className="bg-background border border-border rounded-lg p-6 flex flex-col gap-6 shadow-sm flex-1 min-h-0">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Document Attachment</Label>
                            {attachment && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setAttachment(null)
                                        setIsSigned(false)
                                    }}
                                    className="h-6 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>

                        {!attachment ? (
                            <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors relative group cursor-pointer">
                                <Input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <Upload className="size-6" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-bold">Click to upload document</p>
                                    <p className="text-xs text-muted-foreground">PDF or Word files supported</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 relative border border-border rounded-xl overflow-hidden bg-muted/10">
                                {isPdf ? (
                                    <iframe src={attachment} className="w-full h-full flex-1" />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                        <FileText className="size-16 text-muted-foreground/50" />
                                        <p className="text-sm font-medium text-muted-foreground">Preview not available for this file type</p>
                                    </div>
                                )}

                                {isSigned && (
                                    <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm border-2 border-primary text-primary px-6 py-3 rounded-lg shadow-xl transform -rotate-2 flex flex-col items-center z-20">
                                        <span className="font-serif italic text-2xl font-bold">Digitally Signed</span>
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Verified & Approved</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <Button
                                type="button"
                                variant={isSigned ? "default" : "outline"}
                                onClick={() => setIsSigned(!isSigned)}
                                disabled={!attachment}
                                className={`gap-2 ${isSigned ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : ''}`}
                            >
                                <PenTool className="size-4" />
                                {isSigned ? 'Signed' : 'Sign Document'}
                            </Button>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={isPending || !selectedRecipient || (!body && !attachment)}
                                    onClick={() => setShouldSend(false)}
                                    variant="outline"
                                    className="rounded-md h-9 px-4 font-bold uppercase tracking-wider text-[11px] hover:bg-muted transition-colors"
                                >
                                    {isPending && !shouldSend ? 'Saving...' : 'Save Draft'}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending || !selectedRecipient || (!body && !attachment)}
                                    onClick={() => setShouldSend(true)}
                                    className="rounded-md h-9 px-6 font-bold uppercase tracking-wider text-[11px] transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                                >
                                    {isPending && shouldSend ? 'Sending...' : 'Send Document'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

