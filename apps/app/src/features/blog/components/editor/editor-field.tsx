"use client";

import type { Value } from "platejs";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";
import type * as React from "react";

/**
 * A reusable editor component that works like a standard <Textarea>,
 * accepting `value`, `onChange`, and optional placeholder.
 *
 * Usage:
 *
 * <FormField
 *   control={form.control}
 *   name="bio"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Bio</FormLabel>
 *       <FormControl>
 *         <EditorField
 *           {...field}
 *           placeholder="Tell us a bit about yourself"
 *         />
 *       </FormControl>
 *       <FormDescription>Some helpful description...</FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 */
export interface EditorFieldProps extends React.HTMLAttributes<HTMLDivElement> {
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
}

export function EditorField({
  value,
  onChange,
  placeholder = "Type here...",
  ...props
}: EditorFieldProps) {
  // We create our editor instance with the provided initial `value`.
  const editor = usePlateEditor({
    value: value ?? [
      { type: "p", children: [{ text: "" }] }, // Default empty paragraph
    ],
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        // Sync changes back to the caller via onChange prop
        onChange?.(value);
      }}
      {...props}
    >
      <PlateContent placeholder={placeholder} />
    </Plate>
  );
}
