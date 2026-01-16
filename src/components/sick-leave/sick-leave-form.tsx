'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, FileText, Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createLetterAction, sendLetterAction } from '@/app/actions/letters'
import { format, differenceInDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'

interface SickLeaveRequestFormProps {
    parent: {
        id: string
        name: string
        position: string
    }
    currentBalance: number
}

export function SickLeaveRequestForm({ parent, currentBalance }: SickLeaveRequestFormProps) {
    const router = useRouter()
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [reason, setReason] = useState('')
    const [shouldSend, setShouldSend] = useState(true)

    const daysCount = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1

    async function handleSubmit(_prevState: any, formData: FormData) {
        if (daysCount <= 0) {
            return { error: 'End date must be after start date' }
        }

        if (daysCount > currentBalance) {
            return { error: 'Insufficient sick leave balance' }
        }

        formData.set('receiverId', parent.id)
        formData.set('category', 'RESPONSE_REQUIRED')
        formData.set('subject', `Sick Leave Request: ${startDate} to ${endDate}`)
        formData.set('body', reason || `I am requesting sick leave from ${startDate} to ${endDate} (${daysCount} days).`)
        formData.set('requestType', 'SICK_LEAVE')
        formData.set('startDate', startDate)
        formData.set('endDate', endDate)
        formData.set('daysCount', String(daysCount))
        formData.set('signedBySender', 'true')

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

    return (
        <form action={formAction} className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {state?.error && (
                <div className="bg-destructive/10 border-2 border-destructive text-destructive px-4 py-3 font-bold flex items-center gap-3">
                    <div className="size-2 rounded-full bg-destructive animate-pulse" />
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-6 bg-card border-2 border-border shadow-brutal">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="size-5 text-primary" />
                        <h3 className="font-black uppercase tracking-tight text-sm">Duration</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-bold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">End Date</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-bold"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t-2 border-dashed border-border flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Total Days</span>
                        <span className={cn("text-2xl font-black", daysCount > currentBalance ? "text-destructive" : "text-primary")}>
                            {daysCount > 0 ? daysCount : 0}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 p-6 bg-primary text-primary-foreground border-2 border-primary shadow-brutal">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="size-5" />
                        <h3 className="font-black uppercase tracking-tight text-sm text-primary-foreground/90">Balance Info</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Balance</p>
                            <p className="text-4xl font-black">{currentBalance} Days</p>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Approver (Parent)</p>
                            <p className="font-bold">{parent.name}</p>
                            <p className="text-xs opacity-80">{parent.position}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 p-6 bg-card border-2 border-border shadow-brutal">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="size-5 text-primary" />
                    <h3 className="font-black uppercase tracking-tight text-sm">Reason / Notes</h3>
                </div>
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly explain the reason for your sick leave..."
                    className="min-h-[120px] rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-medium resize-none"
                />
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="submit"
                    disabled={isPending || daysCount <= 0 || daysCount > currentBalance}
                    className="rounded-none h-12 px-8 font-black uppercase tracking-widest bg-primary text-primary-foreground border-2 border-primary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal transition-all active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                    {isPending ? 'Submitting...' : (
                        <>
                            Submit Request
                            <Send className="ml-2 size-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}

