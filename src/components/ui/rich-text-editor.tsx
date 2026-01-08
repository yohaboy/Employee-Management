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
        <div className="flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden min-h-[500px] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Ribbon Toolbar */}
            <div className="bg-muted/30 border-b p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-1 px-2 border-r mr-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        type="button"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        type="button"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 px-2 border-r mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        className="rounded-md"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        className="rounded-md"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        className="rounded-md"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2 border-r mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="rounded-md"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="rounded-md"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2 border-r mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        className="rounded-md"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        className="rounded-md"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        className="rounded-md"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        className="rounded-md"
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        className="rounded-md"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        className="rounded-md"
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                </div>
            </div>

            {/* Editing Area */}
            <div
                className="flex-1 bg-muted/5 p-4 md:p-8 overflow-auto flex justify-center cursor-text"
                onClick={() => editor.chain().focus().run()}
            >
                <div className="w-full bg-background shadow-sm border rounded-lg min-h-[800px] p-6 md:p-12 lg:p-16 relative">
                    <EditorContent
                        editor={editor}
                        className="prose prose-sm sm:prose-base lg:prose-lg focus:outline-none max-w-none h-full dark:prose-invert"
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-muted/30 border-t px-4 py-2 text-[10px] font-medium text-muted-foreground flex justify-between items-center">
                <div className="flex gap-4">
                    <span>Words: {editor.storage.characterCount?.words?.() || 0}</span>
                    <span>Characters: {editor.storage.characterCount?.characters?.() || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Editor Ready</span>
                </div>
            </div>
        </div>
    )
}
