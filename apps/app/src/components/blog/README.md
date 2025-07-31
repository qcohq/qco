# Blog Components

Компоненты для управления блогом с использованием Plate.js для богатого редактирования контента.

## Основные компоненты

### BlogEditor
Основной компонент редактора, использующий Plate.js:

```tsx
import { BlogEditor } from "./blog-editor";
import type { Value } from "platejs";

<BlogEditor
  value={value}
  onChange={(value) => setValue(value)}
  placeholder="Напишите содержание записи..."
/>
```

**Особенности:**
- Богатое форматирование текста (жирный, курсив, подчеркивание)
- Современный дизайн в стиле shadcn/ui
- Поддержка undefined значений
- Интеграция с React Hook Form
- Адаптивный дизайн

### BlogPlateEditor
Базовый редактор с Plate.js и тулбаром:

```tsx
import { BlogPlateEditor } from "./blog-plate-editor";

<BlogPlateEditor
  value={value}
  onChange={setValue}
  placeholder="Начните писать..."
/>
```

**Возможности:**
- Форматирование текста (B, I, U)
- Горячие клавиши (⌘+B, ⌘+I, ⌘+U)
- Автоматическое создание параграфов
- Поддержка пустых значений

## Утилиты

### stringToValue
Конвертирует строку в Value для Plate.js:

```tsx
import { stringToValue } from "./editor-utils";

const value = stringToValue("Простой текст");
// Результат: [{ type: 'p', children: [{ text: 'Простой текст' }] }]
```

### valueToString
Конвертирует Value в строку для сохранения:

```tsx
import { valueToString } from "./editor-utils";

const string = valueToString(value);
// Результат: "Простой текст" или JSON строка
```

### isValueEmpty
Проверяет, является ли Value пустым:

```tsx
import { isValueEmpty } from "./editor-utils";

const isEmpty = isValueEmpty(value);
```

## Интеграция с React Hook Form

### Прямое использование
```tsx
import { stringToValue, valueToString } from "./editor-utils";

<BlogEditor
  value={stringToValue(form.watch("content"))}
  onChange={(value) => form.setValue("content", valueToString(value))}
/>
```

### Использование useController
```tsx
import { useController } from "react-hook-form";

const {
  field: { value, onChange },
} = useController({
  name: "content",
  control,
});

<BlogEditor
  value={stringToValue(value)}
  onChange={(value) => onChange(valueToString(value))}
/>
```

## Поддерживаемые форматы

### Простой текст
```tsx
"Простой текст с переносами строк"
```

### Богатый контент (Value)
```tsx
[
  { type: 'p', children: [{ text: 'Параграф' }] },
  { type: 'p', children: [{ text: 'Другой параграф' }] }
]
```

### Форматированный текст
```tsx
[
  {
    type: 'p',
    children: [
      { text: 'Обычный текст ' },
      { text: 'жирный', bold: true },
      { text: ' и ' },
      { text: 'курсив', italic: true }
    ]
  }
]
```

## Стилизация

Все компоненты используют темы shadcn/ui и поддерживают:
- Темную/светлую тему
- Кастомные CSS переменные
- Адаптивный дизайн
- Доступность (WCAG)

## Зависимости

- `platejs` - основной редактор
- `@platejs/basic-nodes` - базовые плагины
- `react-hook-form` - интеграция с формами
- `zod` - валидация данных 