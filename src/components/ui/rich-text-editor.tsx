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
        <div className="flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden min-h-[600px] focus-within:ring-2 focus-within:ring-primary/10 transition-all border-border/50">
            {/* Ribbon Toolbar */}
            <div className="bg-muted/20 border-b p-1.5 flex flex-wrap gap-0.5 items-center sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-0.5 px-1.5 border-r border-border/50 mr-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        type="button"
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background hover:shadow-sm transition-all"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        type="button"
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-0.5 px-1.5 border-r border-border/50 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1.5 border-r border-border/50 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1.5 border-r border-border/50 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1.5">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Ordered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-background data-[state=on]:shadow-sm"
                        title="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                </div>
            </div>

            {/* Editing Area */}
            <div
                className="flex-1 bg-muted/10 p-4 md:p-8 lg:p-12 overflow-auto flex justify-center cursor-text"
                onClick={() => editor.chain().focus().run()}
            >
                <div className="w-full max-w-4xl bg-background shadow-xl ring-1 ring-border/50 rounded-sm min-h-[1000px] p-12 md:p-20 lg:p-24 relative transition-all">
                    <EditorContent
                        editor={editor}
                        className="prose prose-slate dark:prose-invert focus:outline-none max-w-none h-full text-foreground"
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-muted/20 border-t px-4 py-2 text-[10px] font-bold text-muted-foreground/60 flex justify-between items-center uppercase tracking-widest">
                <div className="flex gap-6">
                    <span className="flex items-center gap-1.5">
                        <span className="text-foreground/40">Words</span>
                        {editor.storage.characterCount?.words?.() || 0}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-foreground/40">Characters</span>
                        {editor.storage.characterCount?.characters?.() || 0}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span>System Online</span>
                </div>
            </div>
        </div>
    )
}
