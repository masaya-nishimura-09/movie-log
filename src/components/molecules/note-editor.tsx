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
import { type ReactNode, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { notebookProseStyles } from "@/lib/note/prose-styles";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";

type NoteEditorProps = {
  name: string;
  defaultValue?: JSONContent;
  dict: Dictionary["noteEditor"];
  heading: ReactNode;
  id?: string;
  invalid?: boolean;
  error?: string;
};

type ToolKey =
  | "bold"
  | "italic"
  | "heading"
  | "subheading"
  | "bulletList"
  | "orderedList"
  | "blockquote";

export function NoteEditor({
  name,
  defaultValue,
  dict,
  heading,
  id,
  invalid = false,
  error,
}: NoteEditorProps) {
  const [json, setJson] = useState<JSONContent | undefined>(defaultValue);
  const [count, setCount] = useState(0);
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
        "data-field": name,
        class: cn(
          "min-h-[calc(100%-1.75rem)] px-0.5 outline-none",
          notebookProseStyles,
        ),
        role: "textbox",
        "aria-label": dict.body,
        "aria-multiline": "true",
      },
    },
    onCreate: ({ editor: current }) => {
      setJson(current.getJSON());
      setCount(current.getText().replace(/\s/g, "").length);
    },
    onUpdate: ({ editor: current }) => {
      setJson(current.getJSON());
      setCount(current.getText().replace(/\s/g, "").length);
    },
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
    <div className="flex h-full min-h-56 flex-col">
      <div className="flex flex-col items-start gap-x-2 lg:h-7 lg:flex-row lg:items-center lg:justify-between">
        {heading}
        <div
          role="toolbar"
          aria-label={dict.toolbar}
          className="flex h-7 items-center rounded-lg bg-[rgb(10_41_71/0.05)] px-0.5"
        >
          {tools.map(({ key, label, Icon, run }) => (
            <button
              key={key}
              type="button"
              aria-label={label}
              title={label}
              aria-pressed={active?.[key] ?? false}
              className={cn(
                "grid h-6 w-7 place-items-center rounded-md text-paper-ink outline-none hover:bg-[rgb(10_41_71/0.08)] focus-visible:ring-2 focus-visible:ring-ring lg:w-7.5",
                active?.[key] && "bg-[rgb(139_94_60/0.18)]",
              )}
              onClick={run}
            >
              <Icon className="size-3.5" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "mt-7 min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,transparent_27px,var(--paper-line)_27px,var(--paper-line)_28px)] bg-size-[100%_28px] bg-local",
          invalid && "rounded-sm ring-1 ring-destructive",
        )}
      >
        <EditorContent editor={editor} className="h-full" />
      </div>
      <p className="flex h-7 shrink-0 items-center justify-between gap-3 text-paper-muted text-xs">
        <span role="alert" className="text-destructive-foreground">
          {error}
        </span>
        {interpolate(dict.charCount, { count: count.toLocaleString() })}
      </p>
      <input type="hidden" name={name} value={JSON.stringify(json ?? null)} />
    </div>
  );
}
