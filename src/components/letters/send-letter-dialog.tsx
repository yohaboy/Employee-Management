'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createLetterAction, sendLetterAction } from '@/app/actions/letters'
import { Mail, Send, Upload, FileText, PenTool } from 'lucide-react'

interface SendLetterDialogProps {
    recipient: {
        id: string
        name: string
        position: string
    }
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SendLetterDialog({ recipient, open, onOpenChange }: SendLetterDialogProps) {
    const [shouldSend, setShouldSend] = useState(false)
    const [category, setCategory] = useState<'RESPONSE_REQUIRED' | 'NO_RESPONSE_REQUIRED'>('RESPONSE_REQUIRED')
    const [body, setBody] = useState('')
    const [attachment, setAttachment] = useState<string | null>(null)
    const [isSigned, setIsSigned] = useState(false)

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('receiverId', recipient.id)
        formData.set('category', category)
        formData.set('body', body || (attachment ? 'See attached document' : ''))
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

        onOpenChange(false)
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

    const isPdf = attachment?.startsWith('data:application/pdf')

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <Mail className="size-6 text-primary" />
                        Compose Document for {recipient.name}
                    </DialogTitle>
                    <DialogDescription className="font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                        {recipient.position}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-6 mt-4">
                    {state?.error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm font-semibold flex items-center gap-3">
                            <div className="size-2 rounded-full bg-destructive animate-pulse" />
                            {state.error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="space-y-4">
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
                                        className="rounded-md border-border bg-muted/30 h-10 px-3 focus-visible:ring-1 focus-visible:ring-ring transition-all font-semibold text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Remarks / Notes</Label>
                                    <Textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        placeholder="Add any additional notes or remarks here..."
                                        className="min-h-[150px] border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex flex-col h-full gap-4">
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
                                    <div className="flex-1 min-h-[200px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 bg-muted/5 hover:bg-muted/10 transition-colors relative group cursor-pointer">
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
                                    <div className="flex-1 min-h-[200px] flex flex-col relative border border-border rounded-xl overflow-hidden bg-muted/10">
                                        {isPdf ? (
                                            <iframe src={attachment} className="w-full h-full flex-1" />
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                                                <FileText className="size-12 text-muted-foreground/50" />
                                                <p className="text-xs font-medium text-muted-foreground">Preview not available</p>
                                            </div>
                                        )}

                                        {isSigned && (
                                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-primary text-primary px-4 py-2 rounded-lg shadow-xl transform -rotate-2 flex flex-col items-center z-20">
                                                <span className="font-serif italic text-lg font-bold">Digitally Signed</span>
                                                <span className="text-[8px] uppercase tracking-widest font-bold opacity-70">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Button
                                    type="button"
                                    variant={isSigned ? "default" : "outline"}
                                    onClick={() => setIsSigned(!isSigned)}
                                    disabled={!attachment}
                                    className={`w-full gap-2 ${isSigned ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : ''}`}
                                >
                                    <PenTool className="size-4" />
                                    {isSigned ? 'Signed' : 'Sign Document'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-border">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isPending || (!body && !attachment)}
                            onClick={() => setShouldSend(false)}
                            className="flex-1 h-11 font-bold uppercase tracking-widest text-[10px]"
                        >
                            {isPending && !shouldSend ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || (!body && !attachment)}
                            onClick={() => setShouldSend(true)}
                            className="flex-1 h-11 font-bold uppercase tracking-widest text-[10px] gap-2"
                        >
                            <Send className="size-4" />
                            {isPending && shouldSend ? 'Sending...' : 'Send Document'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
