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
                placeholder: placeholder || 'Start typing your professional document...',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 cursor-pointer',
                },
            }),
            CharacterCount,
        ],
        content: content || '',
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col bg-background rounded-lg border border-border overflow-hidden min-h-[600px] transition-all">
            {/* Professional Toolbar */}
            <div className="bg-muted/30 border-b border-border p-1 flex flex-wrap items-center gap-1 sticky top-0 z-20">
                <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background transition-colors"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        type="button"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md hover:bg-background transition-colors"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        type="button"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('underline')}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Heading1 className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <Heading2 className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                </div>

                <div className="flex items-center gap-0.5 px-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                </div>
            </div>

            {/* Full-width Editing Area */}
            <div
                className="flex-1 overflow-auto p-6 md:p-10 cursor-text min-h-[500px]"
                onClick={() => editor.chain().focus().run()}
            >
                <EditorContent
                    editor={editor}
                    className="prose prose-slate dark:prose-invert focus:outline-none max-w-none h-full text-foreground selection:bg-primary/20"
                />
            </div>

            {/* Professional Status Bar */}
            <div className="bg-muted border-t border-border px-4 py-1.5 text-[12px] font-medium flex justify-between items-center text-muted-foreground">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span>{editor.storage.characterCount?.words?.() || 0} words</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>{editor.storage.characterCount?.characters?.() || 0} characters</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Ready</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

