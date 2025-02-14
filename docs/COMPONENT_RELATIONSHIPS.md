# Component Relationships

## High-Level Architecture

```mermaid
graph TD
    A[App] --> B[AuthProvider]
    B --> C[ThemeProvider]
    C --> D[CartProvider]
    D --> E[Layout]
    E --> F[NavBar]
    E --> G[Footer]
    E --> H[Main Content]
```

## Component Dependencies

```mermaid
graph TD
    subgraph Providers
        AuthProvider --> ThemeProvider
        ThemeProvider --> CartProvider
    end

    subgraph Layout
        NavBar --> SessionButton
        NavBar --> ThemeToggle
        NavBar --> CartButton
        NavBar --> SearchBar
    end

    subgraph Forms
        CrudForm --> Input
        CrudForm --> Select
        SearchBar --> Input
    end

    subgraph Cart
        CartButton --> ShoppingCart
        ShoppingCart --> CartProvider
    end

    subgraph Events
        EventCard --> CartButton
        EventCard --> Input
    end
```

## Data Flow

```mermaid
flowchart TD
    A[User Action] --> B[Component Event]
    B --> C{Context Provider}
    C --> D[State Update]
    D --> E[Re-render]
    E --> F[UI Update]
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant SB as SessionButton
    participant AP as AuthProvider
    participant API as Auth API

    U->>SB: Click Sign In
    SB->>AP: Trigger Auth
    AP->>API: Sign In Request
    API-->>AP: Auth Response
    AP-->>SB: Update Session
    SB-->>U: Show Auth Status
```

## Cart Flow

```mermaid
sequenceDiagram
    participant U as User
    participant EC as EventCard
    participant CP as CartProvider
    participant CB as CartButton
    participant SC as ShoppingCart

    U->>EC: Add to Cart
    EC->>CP: Update Cart
    CP->>CB: Update Count
    U->>CB: View Cart
    CB->>SC: Show Items
    SC->>CP: Get Cart Data
```

## Theme Switch Flow

```mermaid
sequenceDiagram
    participant U as User
    participant TT as ThemeToggle
    participant TP as ThemeProvider
    participant S as Storage

    U->>TT: Toggle Theme
    TT->>TP: Update Theme
    TP->>S: Save Preference
    TP-->>TT: Apply Theme
```

## Component Hierarchy

```mermaid
graph TD
    subgraph App
        A[Layout] --> B[NavBar]
        A --> C[Main Content]
        A --> D[Footer]

        subgraph NavBar
            B --> E[SessionButton]
            B --> F[ThemeToggle]
            B --> G[CartButton]
            B --> H[SearchBar]
        end

        subgraph Main Content
            C --> I[EventCard]
            C --> J[CrudForm]
            C --> K[ShoppingCart]
        end
    end
```

## State Management

```mermaid
flowchart TD
    subgraph Global State
        A[AuthProvider] --> D[User Session]
        B[ThemeProvider] --> E[Theme Preference]
        C[CartProvider] --> F[Cart Items]
    end

    subgraph Local State
        G[Component State] --> H[UI State]
        G --> I[Form Data]
        G --> J[Loading States]
    end
```

## Responsive Behavior

```mermaid
graph TD
    subgraph Desktop
        A[Full Navigation]
        B[Grid Layout]
        C[Side Panel]
    end

    subgraph Mobile
        D[Hamburger Menu]
        E[Stack Layout]
        F[Bottom Sheet]
    end

    G[Breakpoint] --> Desktop
    G --> Mobile
```

## Event Handling

```mermaid
flowchart TD
    A[User Event] --> B{Event Type}
    B -->|Click| C[Handle Click]
    B -->|Submit| D[Handle Submit]
    B -->|Change| E[Handle Change]

    C --> F[Update UI]
    D --> G[API Call]
    E --> H[State Update]
```

## Notes

1. **Component Communication**
   - Props down, events up
   - Context for global state
   - Custom hooks for shared logic

2. **State Management**
   - AuthProvider: User session, permissions
   - ThemeProvider: Theme preferences
   - CartProvider: Shopping cart state
   - Local state: Component-specific UI state

3. **Event Flow**
   - User interactions trigger component events
   - Events propagate up through props
   - Context providers manage global state updates
   - UI updates reflect state changes

4. **Responsive Design**
   - Components adapt to screen size
   - Mobile-first approach
   - Breakpoint-based layout changes
   - Conditional rendering for optimal UX