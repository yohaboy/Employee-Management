'use client'

import { useState, useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createLetterAction, sendLetterAction } from '@/app/actions/letters'
import { Mail, Send } from 'lucide-react'

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

    async function handleSubmit(_prevState: any, formData: FormData) {
        formData.set('receiverId', recipient.id)

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="size-5 text-primary" />
                        Send Letter to {recipient.name}
                    </DialogTitle>
                    <DialogDescription>
                        {recipient.position}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4 mt-4">
                    {state?.error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md text-sm font-medium">
                            {state.error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Enter letter subject"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Message</Label>
                        <Textarea
                            id="body"
                            name="body"
                            placeholder="Write your secure message here..."
                            required
                            rows={6}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => setShouldSend(false)}
                            className="flex-1"
                        >
                            Save Draft
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            onClick={() => setShouldSend(true)}
                            className="flex-1 gap-2"
                        >
                            <Send className="size-4" />
                            {isPending ? 'Sending...' : 'Send Now'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
