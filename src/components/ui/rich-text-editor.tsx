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
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col border-2 border-foreground bg-background shadow-brutal overflow-hidden min-h-[600px]">
            {/* WPS-style Ribbon Toolbar */}
            <div className="bg-muted/50 border-b-2 border-foreground p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                <div className="flex items-center gap-1 px-2 border-r-2 border-foreground/20 mr-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1 px-2 border-r-2 border-foreground/20 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2 border-r-2 border-foreground/20 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2 border-r-2 border-foreground/20 mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-1 px-2">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                        className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Quote className="h-4 w-4" />
                    </Toggle>
                </div>
            </div>

            {/* Page-like Editing Area */}
            <div className="flex-1 bg-muted/30 p-8 overflow-auto flex justify-center">
                <div className="w-full max-w-[800px] bg-background shadow-2xl border border-foreground/10 min-h-[1000px] p-[2cm] relative">
                    {/* Page Watermark or Guide Lines could go here */}
                    <EditorContent
                        editor={editor}
                        className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none h-full"
                    />
                </div>
            </div>

            {/* Status Bar */}
            <div className="bg-muted border-t-2 border-foreground px-4 py-1 text-[10px] font-bold uppercase flex justify-between items-center">
                <div className="flex gap-4">
                    <span>Words: {editor.storage.characterCount?.words?.() || 0}</span>
                    <span>Characters: {editor.storage.characterCount?.characters?.() || 0}</span>
                </div>
                <div>
                    <span>WPS Mode: Active</span>
                </div>
            </div>
        </div>
    )
}
