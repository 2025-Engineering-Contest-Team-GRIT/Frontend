# CSR/SSR Architecture Documentation

## Overview

This document outlines the Client-Side Rendering (CSR) and Server-Side Rendering (SSR) architecture implemented in the 한성 길라잡이 (Hansung Guide) application.

## Architecture Goals

1. **Clear separation** between server-side and client-side concerns
2. **Optimal performance** through SSR for initial page loads and CSR for interactions
3. **Type safety** maintained throughout the codebase
4. **Proper state management** with React Query and Zustand
5. **Error handling** with boundaries and proper fallbacks

## Directory Structure

```
src/
├── components/
│   ├── csr/                    # Client-side components
│   │   ├── DashboardPageClient.tsx
│   │   ├── Navigation.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ...
│   ├── ssr/                    # Server-safe components
│   │   └── Layout.tsx
│   ├── views/                  # View components (with 'use client')
│   └── common.tsx              # Shared UI components
├── hooks/
│   ├── useData.ts              # React Query hooks
│   └── useStore.ts             # Zustand state hooks
├── app/                        # Next.js App Router
│   ├── (app)/                  # Main app routes
│   │   ├── dashboard/
│   │   ├── roadmap/
│   │   └── ...
│   └── layout.tsx              # Root layout
└── store/
    └── index.ts                # Zustand stores
```

## Component Architecture

### SSR Components (`components/ssr/`)

- **Purpose**: Server-safe components for initial rendering
- **Characteristics**:
  - No `'use client'` directive
  - No browser APIs
  - No React hooks that require client-side execution
  - Focus on layout, static content, and SEO

Example:
```tsx
// components/ssr/Layout.tsx
export const SSRHeader = ({ student, title }) => (
  <header className="...">
    {/* Static header content */}
  </header>
);
```

### CSR Components (`components/csr/`)

- **Purpose**: Client-side interactive components
- **Characteristics**:
  - Include `'use client'` directive
  - Use React Query, Zustand, and browser APIs
  - Handle user interactions and dynamic updates
  - Include error boundaries

Example:
```tsx
// components/csr/DashboardPageClient.tsx
'use client';

export function DashboardPageClient() {
  const { data: student } = useStudent();
  // ... interactive logic
}
```

## State Management

### React Query (Server State)

- **Location**: `hooks/useData.ts`
- **Purpose**: Server state management and caching
- **Usage**: Only in CSR components

```tsx
// hooks/useData.ts
export const useStudent = (status: StudentStatus) => {
  return useQuery({
    queryKey: ['student', status],
    queryFn: () => fetchStudent(status),
    staleTime: 5 * 60 * 1000,
  });
};
```

### Zustand (Client State)

- **Location**: `store/index.ts` and `hooks/useStore.ts`
- **Purpose**: Client-side UI state and interactions
- **Usage**: Through custom hooks for better encapsulation

```tsx
// hooks/useStore.ts
export const useNavigation = () => {
  const { setActiveView } = useUIStore();
  return {
    navigateToView: useCallback((view: string) => setActiveView(view), [setActiveView]),
  };
};
```

## Data Flow

### SSR Pages (app/*)

1. Handle routing and initial rendering
2. Pass minimal props to CSR components
3. Focus on SEO and initial page load performance

```tsx
// app/(app)/dashboard/page.tsx
export default function DashboardPage() {
  return <DashboardPageClient />;
}
```

### CSR Components

1. Receive initial props from SSR
2. Use React Query for data fetching
3. Use Zustand for UI state management
4. Handle all user interactions

## Error Handling

### Error Boundaries

- **CSRErrorBoundary**: Catches errors in CSR components
- **Fallback Components**: Provide user-friendly error messages
- **Error Recovery**: Allow users to retry failed operations

```tsx
// components/csr/ErrorBoundary.tsx
export function DashboardPageClient() {
  return (
    <CSRErrorBoundary>
      <DashboardContent />
    </CSRErrorBoundary>
  );
}
```

## Performance Optimizations

### Code Splitting

- SSR components load first for immediate rendering
- CSR components load asynchronously for interactivity
- React Query provides intelligent caching

### Hydration Strategy

1. SSR renders static layout and content
2. CSR components hydrate with minimal layout shift
3. Progressive enhancement approach

## Best Practices

### DO ✅

- Use SSR for initial page structure and SEO content
- Use CSR for interactive features and real-time updates
- Centralize data fetching logic in custom hooks
- Implement proper error boundaries
- Maintain type safety throughout

### DON'T ❌

- Use React Query hooks in SSR components
- Access browser APIs in SSR components
- Mix server and client state without clear boundaries
- Ignore error handling and loading states

## Testing Strategy

### Unit Tests

- Test individual hooks and components
- Mock external dependencies (React Query, Zustand)
- Focus on business logic and user interactions

### Integration Tests

- Test SSR/CSR component integration
- Verify proper data flow and state management
- Test error handling scenarios

## Future Improvements

1. **Streaming SSR**: Implement React 18 streaming for better performance
2. **Prefetching**: Add intelligent data prefetching strategies
3. **Offline Support**: Implement service workers for offline functionality
4. **Performance Monitoring**: Add metrics for CSR/SSR performance tracking

## Migration Guide

For existing components:

1. **Identify Component Type**: Determine if component should be SSR or CSR
2. **Move to Appropriate Directory**: Place in `components/ssr/` or `components/csr/`
3. **Update Imports**: Use custom hooks from `hooks/` directory
4. **Add Error Handling**: Wrap CSR components with error boundaries
5. **Test Thoroughly**: Verify SSR/CSR behavior in different scenarios