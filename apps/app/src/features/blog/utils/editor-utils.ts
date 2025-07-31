import { HeadingElementStatic } from "@qco/ui/components/heading-node-static";
import { ParagraphElementStatic } from "@qco/ui/components/paragraph-node-static";
import { BaseParagraphPlugin } from "@udecode/plate";
import { BaseHeadingPlugin } from "@udecode/plate-heading";
import type { Value } from "platejs";
import { createSlateEditor, serializeHtml } from "platejs";

export const emptyValue: Value = [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

// Конвертирует строку в Value для Plate.js
export function stringToValue(content?: string): Value {
  if (!content || typeof content !== "string" || content.trim() === "") {
    return emptyValue;
  }

  try {
    // Пытаемся распарсить как JSON (если это уже Value)
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Если не JSON, конвертируем строку в простой параграф
  }

  // Разбиваем на параграфы по переносам строк
  const paragraphs = (
    typeof content === "string" ? content.split("\n") : []
  ).filter((p): p is string => typeof p === "string" && p.trim() !== "");

  if (paragraphs.length === 0) {
    return emptyValue;
  }

  return paragraphs.map((text) => ({
    type: "p",
    children: [{ text }],
  }));
}

export async function serverSlateToHtml(slateValue: Value): Promise<string> {
  // Настройте editor и плагины согласно вашему проекту
  const editor = createSlateEditor({
    plugins: [
      BaseParagraphPlugin,
      BaseHeadingPlugin,
      // ... другие базовые плагины
    ],
    components: {
      p: ParagraphElementStatic,
      h1: HeadingElementStatic,
      // ... другие компоненты
    },
  });
  if (!editor) return "";
  editor.children = slateValue;
  const html = await serializeHtml(editor);
  return html;
}
// --- END Plate.js SSR HTML serialization ---

export async function clientSlateToHtml(slateValue: Value): Promise<string> {
  // Настройте editor и плагины согласно вашему проекту
  const editor = createSlateEditor({
    plugins: [
      BaseParagraphPlugin,
      BaseHeadingPlugin,
      // ... другие базовые плагины
    ],
    value: slateValue,
  });
  if (!editor) return "";
  const html = await serializeHtml(editor);
  return html;
}
// --- END Plate.js CLIENT HTML serialization ---
