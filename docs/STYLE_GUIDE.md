# Style Guide

## Colors 🎨

### Primary Colors
```css
primary-light: #1fb6ff
primary-dark: #0e9de8
secondary-light: #7e5bef
secondary-dark: #6544d4
```

### Background Colors
```css
background-light: #ffffff
background-dark: #1a1a1a
surface-light: #f5f5f5
surface-dark: #2a2a2a
```

### Text Colors
```css
text-light: #1a1a1a
text-dark: #ffffff
```

### Accent Colors
```css
accent-light: #ff49db
accent-dark: #e622c3
success-light: #13ce66
success-dark: #0fb857
warning-light: #ffc82c
warning-dark: #e6b425
error-light: #ff4949
error-dark: #e63333
```

## Typography 📝

### Font Families
- System font stack for optimal performance
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

### Font Sizes
```css
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
text-3xl: 1.875rem  /* 30px */
text-4xl: 2.25rem   /* 36px */
text-5xl: 3rem      /* 48px */
```

### Font Weights
```css
font-light: 300
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

## Spacing 📏

### Padding & Margin
```css
p-0: 0
p-1: 0.25rem  /* 4px */
p-2: 0.5rem   /* 8px */
p-3: 0.75rem  /* 12px */
p-4: 1rem     /* 16px */
p-6: 1.5rem   /* 24px */
p-8: 2rem     /* 32px */
p-12: 3rem    /* 48px */
p-16: 4rem    /* 64px */
```

### Gap
```css
gap-1: 0.25rem
gap-2: 0.5rem
gap-4: 1rem
gap-6: 1.5rem
gap-8: 2rem
```

## Breakpoints 📱

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Components 🧩

### Buttons
```css
/* Primary Button */
.primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
  @apply p-2 rounded-md transition-colors;
}

/* Secondary Button */
.secondary {
  @apply bg-red-500 hover:bg-red-600 text-white;
  @apply p-2 rounded-md transition-colors;
}

/* Tertiary Button */
.tertiary {
  @apply bg-gray-500 hover:bg-gray-600 text-white;
  @apply p-2 rounded-md transition-colors;
}
```

### Cards
```css
.card {
  @apply rounded-2xl overflow-hidden;
  @apply transform transition-all duration-300;
  @apply hover:-translate-y-1 hover:shadow-xl;
  @apply theme-surface;
}
```

### Inputs
```css
.input {
  @apply w-full px-4 py-2 rounded-lg;
  @apply border border-gray-300 dark:border-gray-700;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply outline-none transition-all duration-200;
}
```

## Theme Classes 🌗

### Background
```css
.theme-bg {
  @apply bg-background-light dark:bg-background-dark;
}

.theme-surface {
  @apply bg-surface-light dark:bg-surface-dark;
}
```

### Text
```css
.theme-text {
  @apply text-text-light dark:text-text-dark;
}

.inverse-text {
  @apply text-text-dark dark:text-text-light;
}
```

## Animations 🎬

### Transitions
```css
.transition-default {
  @apply transition-all duration-300 ease-in-out;
}

.hover-scale {
  @apply hover:scale-105 transition-transform duration-300;
}
```

### Loading States
```css
.loading-spin {
  @apply animate-spin;
}

.loading-pulse {
  @apply animate-pulse;
}
```

## Best Practices 📚

1. **Theme Consistency**
   - Always use theme classes for colors and backgrounds
   - Use CSS variables for dynamic values
   - Maintain dark mode compatibility

2. **Responsive Design**
   - Mobile-first approach
   - Use Tailwind breakpoints consistently
   - Test all components at different screen sizes

3. **Accessibility**
   - Maintain color contrast ratios (WCAG 2.1)
   - Include ARIA labels
   - Support keyboard navigation
   - Provide focus indicators

4. **Performance**
   - Use system fonts
   - Optimize images
   - Minimize animation complexity
   - Lazy load when possible

5. **Code Organization**
   - Keep CSS modules scoped
   - Use consistent naming conventions
   - Document complex styles
   - Maintain separation of concerns