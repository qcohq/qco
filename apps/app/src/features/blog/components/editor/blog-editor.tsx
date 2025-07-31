"use client";

import type { Value } from "platejs";
import { EditorFieldWithToolbar } from "./editor-field-with-toolbar";

interface BlogEditorProps {
  value?: Value;
  onChange: (value: Value) => void;
  placeholder?: string;
}

export function BlogEditor({
  value,
  onChange,
  placeholder = "Напишите содержание записи...",
}: BlogEditorProps) {
  return (
    <EditorFieldWithToolbar
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      showToolbar={true}
    />
  );
}
