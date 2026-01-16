import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Thermometer } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SickLeaveRequestForm } from '@/components/sick-leave/sick-leave-form'
import { redirect } from 'next/navigation'

export default async function NewSickLeavePage() {
    const currentNode = await requireAuth()

    if (!currentNode.parentId) {
        // Root nodes can't submit sick leave to parents
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Thermometer className="size-12 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-black uppercase tracking-tight">No Parent Assigned</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    You are at the top of the hierarchy. Sick leave requests must be submitted to a direct parent.
                </p>
                <Link href="/dashboard">
                    <Button variant="outline" className="rounded-none border-2 font-bold uppercase">Return to Dashboard</Button>
                </Link>
            </div>
        )
    }

    const parent = db.nodes.find(n => n.id === currentNode.parentId)

    if (!parent) {
        return redirect('/dashboard')
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="rounded-none font-black uppercase text-xs border-2 border-transparent hover:border-border transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Sick Leave Request</h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Submit for approval</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                <SickLeaveRequestForm
                    parent={{
                        id: parent.id,
                        name: parent.name,
                        position: parent.position
                    }}
                    currentBalance={currentNode.sickLeaveBalance}
                />
            </div>
        </div>
    )
}
