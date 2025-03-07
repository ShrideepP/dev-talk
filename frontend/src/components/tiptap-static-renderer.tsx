import { useEditor, EditorContent } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import Document from "@tiptap/extension-document";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";

export const TiptapStaticRenderer = ({
  content,
}: {
  content: string | undefined;
}) => {
  const editor = useEditor({
    content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "font-geist text-base leading-normal md:text-sm md:leading-normal",
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
            "bg-accent text-accent-foreground font-jetbrains-mono rounded-lg px-3 py-2",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-primary text-primary-foreground rounded px-1 py-0.5",
        },
      }),
    ],
  });

  return <EditorContent editor={editor} />;
};
