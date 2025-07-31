"use client";

import {
  BlockquotePlugin,
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import {
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@platejs/table/react";
import { Editor, EditorContainer } from "@qco/ui/components/editor";
import { FixedToolbar } from "@qco/ui/components/fixed-toolbar";
import { MarkToolbarButton } from "@qco/ui/components/mark-toolbar-button";
import { ToolbarButton } from "@qco/ui/components/toolbar";
import type { Value } from "platejs";
import { Plate, usePlateEditor } from "platejs/react";

/**
 * A reusable editor component with toolbar that works like a standard <Textarea>,
 * accepting `value`, `onChange`, and optional placeholder.
 */
export interface EditorFieldWithToolbarProps {
  /**
   * The current Plate Value. Should be an array of Plate nodes.
   */
  value?: Value;

  /**
   * Called when the editor value changes.
   */
  onChange?: (value: Value) => void;

  /**
   * Placeholder text to display when editor is empty.
   */
  placeholder?: string;

  /**
   * Show toolbar with formatting buttons
   */
  showToolbar?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export function EditorFieldWithToolbar({
  value,
  onChange,
  placeholder = "Type here...",
  showToolbar = true,
  className,
}: EditorFieldWithToolbarProps) {
  // We create our editor instance with the provided initial `value`.
  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      H1Plugin,
      H2Plugin,
      H3Plugin,
      BlockquotePlugin,
      TablePlugin,
      TableRowPlugin,
      TableCellPlugin,
    ],
    value: value ?? [
      { type: "p", children: [{ text: "" }] }, // Default empty paragraph
    ],
  });

  return (
    <div className={className}>
      <Plate
        editor={editor}
        onChange={({ value }) => {
          // Sync changes back to the caller via onChange prop
          onChange?.(value);
        }}
      >
        {showToolbar && (
          <FixedToolbar className="flex flex-wrap gap-1 rounded-t-lg">
            <ToolbarButton
              onClick={() =>
                (
                  editor as { tf: { h1: { toggle: () => void } } }
                ).tf.h1.toggle()
              }
              tooltip="Heading 1"
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                (
                  editor as { tf: { h2: { toggle: () => void } } }
                ).tf.h2.toggle()
              }
              tooltip="Heading 2"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                (
                  editor as { tf: { h3: { toggle: () => void } } }
                ).tf.h3.toggle()
              }
              tooltip="Heading 3"
            >
              H3
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                (
                  editor as { tf: { blockquote: { toggle: () => void } } }
                ).tf.blockquote.toggle()
              }
              tooltip="Blockquote"
            >
              Quote
            </ToolbarButton>
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
        )}
        <EditorContainer className="min-h-[120px] border rounded-b-lg">
          <Editor placeholder={placeholder} />
        </EditorContainer>
      </Plate>
    </div>
  );
}
