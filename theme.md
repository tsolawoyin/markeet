# Markeet Theme Specification

## Brand Colors

### Primary (Blue)

- **Brand Primary**: `blue-900` (Light mode) / `blue-400` (Dark mode)
- **Brand Accent**: `blue-600` (Dark mode backgrounds)
- **Hover States**: `blue-800` (Light) / `blue-700` (Dark)

### Backgrounds

- **Light Mode**:
  - Primary: `white`
  - Secondary: `blue-50` to `blue-100` (gradients)
  - Cards: `white`
- **Dark Mode**:
  - Primary: `gray-800`
  - Secondary: `gray-900` to `gray-800` (gradients)
  - Cards: `gray-800`

### Text Colors

- **Light Mode**:
  - Primary: `blue-900` (brand elements)
  - Secondary: `gray-600` (inactive/secondary text)
  - Body: default (black/gray-900)
- **Dark Mode**:
  - Primary: `blue-400` (brand elements)
  - Secondary: `gray-400` (inactive/secondary text)
  - Body: `white` / `gray-200`

### Borders

- **Light Mode**: `gray-200`
- **Dark Mode**: `gray-700` / `gray-600`

## Component Patterns

### Interactive Elements

- **Active State**: `blue-900` (light) / `blue-400` (dark)
- **Inactive State**: `gray-600` (light) / `gray-400` (dark)
- **Hover Background**: `gray-100` (light) / `gray-600` (dark)

### Form Inputs

- Background: `white` (light) / `gray-700` (dark)
- Border: default (light) / `gray-600` (dark)
- Text: default (light) / `white` (dark)
- Placeholder: default (light) / `gray-400` (dark)

### Cards

- Background: `white` (light) / `gray-800` (dark)
- Border: default (light) / `gray-700` (dark)

### Alerts & Notifications

- Error indicator: `red-500` (both modes)
- Destructive alerts: Use shadcn/ui `Alert` component with `variant="destructive"`

## Typography Scale

- Extra Small: `text-xs` (0.75rem)
- Small: `text-sm` (0.875rem)
- Base: `text-base` (1rem)
- Large: `text-3xl` to `text-4xl` (headings)

## Responsive Breakpoints

Use Tailwind's default breakpoints:

- `md:` - 768px and up (tablet)
- `lg:` - 1024px and up (desktop)
- `xl:` - 1280px and up (large desktop)

## Icon Sizing

- Small: `w-4 h-4`
- Medium: `w-6 h-6`
- Large: `w-7 h-7` to `w-8 h-8`
- Extra Large: `w-12 h-12` to `w-14 h-14` (logos)

## Spacing

- Gap between elements: `gap-1` to `gap-3`
- Padding: `p-4` to `p-8`
- Component padding: `py-2` to `py-3`

## Dark Mode Implementation

Use Tailwind's `dark:` prefix for all color variations. The dark mode is expected to be controlled at the root level (likely via `next-themes` or similar).

Example pattern:

```jsx
className = "bg-white dark:bg-gray-800 text-gray-900 dark:text-white";
```

## Brand Identity

- **Logo**: ShoppingBag icon in a rounded square container
- **Name**: "Markeet" in bold text
- **Tagline**: "Campus marketplace" theme throughout
