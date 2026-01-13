import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { canViewLetter } from '@/lib/hierarchy'
import { FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FullscreenLetterPageProps {
    params: Promise<{ id: string }>
}

export default async function FullscreenLetterPage({ params }: FullscreenLetterPageProps) {
    const { id } = await params
    const currentNode = await requireAuth()

    // Check if user can view this letter
    const canView = await canViewLetter(currentNode.id, id)
    if (!canView) {
        redirect('/dashboard/letters')
    }

    const letter = db.letters.find(l => l.id === id)

    if (!letter || !letter.attachment) {
        notFound()
    }

    const isPdf = letter.attachment.startsWith('data:application/pdf')

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="h-14 border-b border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <FileText className="size-5 text-primary" />
                    <h1 className="font-bold text-sm truncate max-w-md">{letter.subject} - Fullscreen View</h1>
                </div>
                <Link href={`/dashboard/letters/${id}`}>
                    <Button variant="ghost" size="sm" className="rounded-full gap-2">
                        <X className="size-4" />
                        Exit Fullscreen
                    </Button>
                </Link>
            </div>
            <div className="flex-1 bg-muted/10 relative">
                {isPdf ? (
                    <iframe src={letter.attachment} className="w-full h-full border-none" />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <FileText className="size-24 text-muted-foreground/30" />
                        <p className="text-lg font-medium text-muted-foreground">Preview not available for this file type</p>
                        <a href={letter.attachment} download={`attachment-${id}`}>
                            <Button variant="outline">Download File</Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
