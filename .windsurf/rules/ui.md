---
trigger: glob
globs: apps/app/**/*.tsx, apps/web/**/*.tsx
---

Styling and UI

Tailwind CSS: Use utility-first classes for concise, flexible styling.
Shadcn UI: Leverage customizable pre-built components for faster development.
Responsiveness: Ensure full responsiveness across devices using Tailwind utilities (sm:, md:, lg:, etc.).
Accessibility: Follow WCAG guidelines, including ARIA attributes, keyboard navigation, and semantic HTML.
Performance: Minimize CSS bloat and optimize rendering efficiency.

Component Library

Consistency: Use @qco/ui for uniform UI elements.
Imports: Import components from @qco/ui/components/*.
Pre-built Preference: Favor library components over custom ones.
Customization: Adhere to shadcn/ui patterns for extending components.
Dynamic Styling: Use cn from @qco/ui/lib/utils for conditional class names.