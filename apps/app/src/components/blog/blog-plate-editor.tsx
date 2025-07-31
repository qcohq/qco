"use client";

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { Editor, EditorContainer } from "@qco/ui/components/editor";
import { FixedToolbar } from "@qco/ui/components/fixed-toolbar";
import { MarkToolbarButton } from "@qco/ui/components/mark-toolbar-button";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

// Начальное значение для пустого редактора
const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

interface BlogPlateEditorProps {
  value?: Value;
  onChange: (value: Value) => void;
  placeholder?: string;
}

export function BlogPlateEditor({
  value,
  onChange,
  placeholder = "Напишите содержание...",
}: BlogPlateEditorProps) {
  // Используем пустое значение если value undefined
  const editorValue = value || emptyValue;

  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin],
    value: editorValue,
  });

  return (
    <Plate editor={editor} onChange={({ value }) => onChange(value)}>
      <FixedToolbar className="justify-start rounded-t-lg">
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
          B
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
          I
        </MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
          U
        </MarkToolbarButton>
      </FixedToolbar>
      <EditorContainer>
        <Editor placeholder={placeholder} />
      </EditorContainer>
    </Plate>
  );
}
