import { useEditor, EditorContent } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Toggle } from "./ui/toggle";
import { Icons } from "./icons";

export const Tiptap = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "border-input focus-visible:ring-ring font-geist rounded-md border px-3 py-2 text-base shadow-sm focus-visible:ring-1 focus-visible:outline-none md:text-sm",
      },
    },
    extensions: [
      Text,
      Paragraph,
      Document,
      Bold,
      Italic,
      Code.configure({
        HTMLAttributes: {
          class:
            "text-accent-foreground bg-accent font-jetbrains-mono rounded px-1 py-0.5",
        },
      }),
      CodeBlock.configure({
        languageClassPrefix: "language-",
        HTMLAttributes: {
          class:
            "bg-accent text-accent-foreground font-jetbrains-mono rounded-lg p-4",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-primary text-primary-foreground rounded px-1 py-0.5",
        },
      }),
      Placeholder.configure({
        placeholder: "Enter your content",
      }),
    ],
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Icons.bold className="size-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Icons.italic className="size-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Icons.code className="size-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Icons.fileCode className="size-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("highlight")}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Icons.highlighter className="size-4" />
        </Toggle>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
