'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import CharacterCount from '@tiptap/extension-character-count'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start typing your letter...',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 cursor-pointer',
                },
            }),
            CharacterCount,
        ],
        content: content || `
            <h1>Official Communication</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Subject:</strong> [Enter Subject Here]</p>
            <hr />
            <p>Dear [Recipient Name],</p>
            <p>I am writing to inform you regarding...</p>
            <br />
            <br />
            <p>Sincerely,</p>
            <p>[Your Name]<br />[Your Position]</p>
        `,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col bg-[#F3F2F1] dark:bg-[#1B1A19] rounded-2xl overflow-hidden border border-border/50 shadow-2xl min-h-[800px] transition-all">
            {/* Word-style Ribbon Toolbar */}
            <div className="bg-background border-b border-border/50 p-2 flex flex-col gap-2 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4 px-2 overflow-x-auto no-scrollbar pb-1">
                    <div className="flex items-center gap-1 pr-4 border-r border-border/50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-muted transition-all"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            type="button"
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-muted transition-all"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            type="button"
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-1 pr-4 border-r border-border/50">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('bold')}
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <Bold className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('italic')}
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <Italic className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('underline')}
                            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Toggle>
                    </div>

                    <div className="flex items-center gap-1 pr-4 border-r border-border/50">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('heading', { level: 1 })}
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <Heading1 className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('heading', { level: 2 })}
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <Heading2 className="h-4 w-4" />
                        </Toggle>
                    </div>

                    <div className="flex items-center gap-1 pr-4 border-r border-border/50">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive({ textAlign: 'left' })}
                            onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive({ textAlign: 'center' })}
                            onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive({ textAlign: 'right' })}
                            onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <AlignRight className="h-4 w-4" />
                        </Toggle>
                    </div>

                    <div className="flex items-center gap-1">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('bulletList')}
                            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <List className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('orderedList')}
                            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                            className="h-9 w-9 rounded-lg data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Toggle>
                    </div>
                </div>
            </div>

            {/* Ruler / Margin Indicator */}
            <div className="h-6 bg-background border-b border-border/50 flex items-center px-4 md:px-8 lg:px-12">
                <div className="w-full max-w-[816px] mx-auto h-full border-x border-border/20 flex items-center justify-between px-2">
                    <div className="flex gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-1 w-px bg-border/30" />
                        ))}
                    </div>
                    <div className="flex gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-1 w-px bg-border/30" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Editing Area - The "Desk" */}
            <div
                className="flex-1 overflow-auto p-4 md:p-8 lg:p-12 flex justify-center cursor-text no-scrollbar"
                onClick={() => editor.chain().focus().run()}
            >
                {/* The "Paper" */}
                <div className="w-full max-w-[816px] bg-background shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] min-h-[1056px] p-[2cm] md:p-[2.5cm] lg:p-[3cm] relative transition-all animate-in fade-in zoom-in-95 duration-500">
                    <EditorContent
                        editor={editor}
                        className="prose prose-slate dark:prose-invert focus:outline-none max-w-none h-full text-foreground selection:bg-primary/20"
                    />
                </div>
            </div>

            {/* Word-style Status Bar */}
            <div className="bg-[#0078D4] text-white px-4 py-1 text-[11px] font-medium flex justify-between items-center select-none">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span>Page 1 of 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{editor.storage.characterCount?.words?.() || 0} words</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        <span>English (United States)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-80">
                        <span>100%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
