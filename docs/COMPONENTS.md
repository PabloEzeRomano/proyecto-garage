# Component Documentation

## Core Components

### NavBar
Navigation bar component with responsive design and mobile menu.

**Props:** None

**Features:**
- Responsive design with mobile menu
- Dynamic navigation links based on user role
- Theme toggle
- Session management
- Cart integration

**Usage:**
```tsx
<NavBar />
```

### EventCard
Card component for displaying event information.

**Props:**
```typescript
interface EventCardProps {
  event: Event;
  onEventClick: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAddToCart?: (event: Event, quantity: number) => void;
  showActions?: boolean;
  showReservation?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  loadingDelete?: boolean;
}
```

**Usage:**
```tsx
<EventCard
  event={event}
  onEventClick={handleEventClick}
  showActions={true}
  showReservation={true}
/>
```

### Input
Reusable input component with support for various types.

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }> | string[] | number[];
  removeMargin?: boolean;
}
```

**Usage:**
```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
/>
```

### SessionButton
Button component for authentication actions.

**Features:**
- Sign in/out functionality
- Registration link
- Loading state handling

**Usage:**
```tsx
<SessionButton />
```

## Form Components

### CrudForm
Generic form component for CRUD operations.

**Props:**
```typescript
interface CrudFormProps<T> {
  data?: T;
  defaultData: T;
  table: string;
  title: string;
  inputs: InputConfig[];
  redirectPath: string;
  showImageUpload?: boolean;
}
```

**Usage:**
```tsx
<CrudForm
  data={item}
  defaultData={defaultItem}
  table="items"
  title="Item"
  inputs={inputs}
  redirectPath="/items"
/>
```

### SearchBar
Component for search functionality with filters.

**Props:**
```typescript
interface SearchBarProps {
  handleSearch: (e: React.FormEvent) => void;
  isLoading?: boolean;
}
```

**Usage:**
```tsx
<SearchBar
  handleSearch={handleSearch}
  isLoading={isLoading}
/>
```

## Layout Components

### Footer
Footer component with responsive design.

**Features:**
- Social media links
- Quick navigation links
- Contact information
- Responsive layout

**Usage:**
```tsx
<Footer />
```

### ClientOnly
Component for client-side only rendering.

**Props:**
```typescript
interface ClientOnlyProps {
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<ClientOnly>
  <DynamicComponent />
</ClientOnly>
```

## Cart Components

### CartButton
Shopping cart button with item counter.

**Features:**
- Item count display
- Cart navigation
- Dynamic updates

**Usage:**
```tsx
<CartButton />
```

### ShoppingCart
Full shopping cart component with item management.

**Props:**
```typescript
interface ShoppingCartProps {
  initialItems: CartItemWithDetails[];
}
```

**Usage:**
```tsx
<ShoppingCart initialItems={items} />
```

## Context Providers

### AuthProvider
Authentication context provider.

**Features:**
- User authentication state
- Role-based access control
- Permission management

**Usage:**
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### ThemeProvider
Theme context provider for light/dark mode.

**Features:**
- Theme switching
- Theme persistence
- System theme detection

**Usage:**
```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### CartProvider
Shopping cart context provider.

**Features:**
- Cart state management
- Item quantity updates
- Cart persistence

**Usage:**
```tsx
<CartProvider>
  <App />
</CartProvider>
```

## Utility Components

### ThemeToggle
Button component for switching themes.

**Features:**
- Theme switching
- Animated icon
- Accessibility support

**Usage:**
```tsx
<ThemeToggle />
```

### Select
Custom select component with styling.

**Props:**
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}
```

**Usage:**
```tsx
<Select
  label="Category"
  options={categories}
  value={category}
  onChange={handleChange}
/>
```

## Best Practices

1. **Component Organization:**
   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for props
   - Document complex prop types

2. **State Management:**
   - Use appropriate hooks for state
   - Leverage context for global state
   - Keep state as local as possible

3. **Styling:**
   - Follow Tailwind CSS conventions
   - Use theme variables for consistency
   - Maintain responsive design principles

4. **Performance:**
   - Use memo when needed
   - Implement proper loading states
   - Handle error boundaries

5. **Accessibility:**
   - Include ARIA labels
   - Support keyboard navigation
   - Maintain proper contrast ratios