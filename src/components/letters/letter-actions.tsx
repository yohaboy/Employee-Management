'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Send, Trash2 } from 'lucide-react'
import { sendLetterAction, deleteLetterAction } from '@/app/actions/letters'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LetterActionsProps {
    letter: {
        id: string
        status: string
    }
}

export function LetterActions({ letter }: LetterActionsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    async function handleSend() {
        if (confirm('Are you sure you want to send this letter?')) {
            setIsLoading(true)
            await sendLetterAction(letter.id)
            setIsLoading(false)
            router.refresh()
        }
    }

    async function handleDelete() {
        if (confirm('Are you sure you want to delete this letter? This action cannot be undone.')) {
            setIsLoading(true)
            await deleteLetterAction(letter.id)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" disabled={isLoading}>
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                {letter.status === 'DRAFT' && (
                    <DropdownMenuItem onClick={handleSend} className="text-white hover:bg-slate-700">
                        <Send className="w-4 h-4 mr-2" />
                        Send Letter
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Letter
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
