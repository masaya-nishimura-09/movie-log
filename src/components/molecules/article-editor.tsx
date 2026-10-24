"use client";

import {
  EditorContent,
  type JSONContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Quote,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import { articleProseStyles } from "@/lib/article/prose-styles";
import { cn } from "@/lib/style/cn";

type ArticleEditorProps = {
  name: string;
  defaultValue?: JSONContent;
  dict: Dictionary["articleEditor"];
  id?: string;
  invalid?: boolean;
};

type ToolKey =
  | "bold"
  | "italic"
  | "heading"
  | "subheading"
  | "bulletList"
  | "orderedList"
  | "blockquote";

export function ArticleEditor({
  name,
  defaultValue,
  dict,
  id,
  invalid = false,
}: ArticleEditorProps) {
  const [json, setJson] = useState<JSONContent | undefined>(defaultValue);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: false,
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: cn("min-h-64 px-3.5 py-3 outline-none", articleProseStyles),
        role: "textbox",
        "aria-label": dict.body,
        "aria-multiline": "true",
      },
    },
    onCreate: ({ editor: current }) => setJson(current.getJSON()),
    onUpdate: ({ editor: current }) => setJson(current.getJSON()),
  });
  const active = useEditorState({
    editor,
    selector: ({ editor: current }): Record<ToolKey, boolean> => ({
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      heading: current?.isActive("heading", { level: 2 }) ?? false,
      subheading: current?.isActive("heading", { level: 3 }) ?? false,
      bulletList: current?.isActive("bulletList") ?? false,
      orderedList: current?.isActive("orderedList") ?? false,
      blockquote: current?.isActive("blockquote") ?? false,
    }),
  });

  const tools: {
    key: ToolKey;
    label: string;
    Icon: LucideIcon;
    run: () => void;
  }[] = [
    {
      key: "bold",
      label: dict.bold,
      Icon: Bold,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      label: dict.italic,
      Icon: Italic,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      key: "heading",
      label: dict.heading,
      Icon: Heading2,
      run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "subheading",
      label: dict.subheading,
      Icon: Heading3,
      run: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      key: "bulletList",
      label: dict.bulletList,
      Icon: List,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      key: "orderedList",
      label: dict.orderedList,
      Icon: ListOrdered,
      run: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      key: "blockquote",
      label: dict.blockquote,
      Icon: Quote,
      run: () => editor?.chain().focus().toggleBlockquote().run(),
    },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-field transition-colors focus-within:bg-card focus-within:ring-1 focus-within:ring-selected-border",
        invalid && "ring-1 ring-destructive",
      )}
    >
      <div
        role="toolbar"
        aria-label={dict.toolbar}
        className="flex flex-wrap gap-0.5 border-input border-b border-dashed px-1.5 py-1.5 md:gap-1 md:px-2"
      >
        {tools.map(({ key, label, Icon, run }) => (
          <Button
            key={key}
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            title={label}
            aria-pressed={active?.[key] ?? false}
            className={cn(
              "size-8 md:size-9",
              active?.[key] && "bg-secondary text-foreground",
            )}
            onClick={run}
          >
            <Icon className="size-4.5" aria-hidden />
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={JSON.stringify(json ?? null)} />
    </div>
  );
}
