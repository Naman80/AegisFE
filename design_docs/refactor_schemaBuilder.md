# Schema Builder – Single Page Design Document

## 1. Overview

The Schema Builder is a core module of a multi-datasource database exploration platform. It enables users to:

- Browse namespaces (schemas / databases)
- Inspect entities (tables / collections)
- View normalized field metadata
- Perform structural actions (future scope)

This component must scale across:
- Multiple database providers (Postgres, MongoDB, etc.)
- Large schemas (1000+ entities)
- High-frequency navigation patterns

---

## 2. Objectives

### Primary Goals
- Fast, reactive schema exploration
- Minimal UI latency during navigation
- Strong consistency in data rendering
- Extensible architecture for future schema editing

### Non-Goals (Current Scope)
- Schema mutation (ALTER, DROP execution)
- Query execution
- Relationship graph visualization (future)

---

## 3. Architecture Overview

### High-Level Structure

SchemaBuilder (Container)  ├── NamespaceSelector  ├── EntityList  ├── EntitySchemaView  └── SchemaSidebar

### Responsibilities

| Layer | Responsibility |
|------|----------------|
| Container | Data orchestration, query management |
| Presentational Components | Pure UI rendering |
| Services | API communication |
| State Layer | Server-state caching |

---

## 4. Data Fetching Strategy

### Problem (Current)
- Manual loading states
- Race conditions
- Redundant API calls
- State inconsistencies

### Solution

Adopt TanStack Query for server-state management.

### Query Model

#### Namespaces
queryKey: ["namespaces", datasourceId]

#### Entities
queryKey: ["entities", datasourceId, namespace]

#### Fields
queryKey: ["fields", datasourceId, namespace, entity]

### Configuration

ts {   staleTime: 5 * 60 * 1000,   cacheTime: 10 * 60 * 1000,   retry: 2,   refetchOnWindowFocus: false } 

### Benefits

- Automatic caching
- Request deduplication
- Background refetch
- Built-in loading + error states
- Eliminates useEffect chains

---

## 5. State Management Design

### Principles

1. Do not store derived state
2. Minimize local state
3. Server = source of truth

### State Breakdown

| State | Type | Source |
|------|------|--------|
| activeDatasourceId | global | context |
| selectedNamespace | local | user |
| selectedEntity | local | user |
| namespaces | server | query |
| entities | server | query |
| fields | server | query |

### Derived Defaults

ts selectedNamespace = userSelectedNamespace ?? namespaces?.[0]?.name selectedEntity = userSelectedEntity ?? entities?.[0]?.name 

---

## 6. Data Model

### Current Field Model

ts type Field = {   name: string;   type: string;   isPrimaryKey: boolean;   isNullable: boolean;   defaultValue?: string; }; 

### Extended Model (Future-Proof)

ts type Field = {   name: string;   type: string;   isPrimaryKey: boolean;   isNullable: boolean;   defaultValue?: string;    isForeignKey?: boolean;   references?: {     entity: string;     field: string;   };    isIndexed?: boolean;   enumValues?: string[];   constraints?: string[]; }; 

---

## 7. Component Design

### 7.1 SchemaBuilder (Container)

Responsibilities:
- Compose queries
- Handle selection state
- Pass props to children

No UI logic.

---

### 7.2 NamespaceSelector

Props:
- namespaces
- selectedNamespace
- onChange

Behavior:
- Dropdown selection
- Disabled during loading

---

### 7.3 EntityList

Props:
- entities
- selectedEntity
- onSelect

Enhancements:
- Search/filter (future)
- Virtualized list (for large datasets)

---

### 7.4 EntitySchemaView

Props:
- fields
- isLoading

Responsibilities:
- Display field list
- Show skeleton loaders
- Handle empty state

---

### 7.5 SchemaSidebar

Props:
- fields
- selectedEntity

Displays:
- Field count
- Primary key count
- Structural metadata

---

## 8. UX States

### Loading States

| Section | Behavior |
|--------|----------|
| Namespaces | Disabled dropdown |
| Entities | Skeleton list |
| Fields | Skeleton card |

### Empty States

- No namespaces → “No namespaces found”
- No entities → “No entities in namespace”
- No fields → “Entity has no fields”

### Error Handling

- Scoped per query
- Retry button per section
- Avoid global blocking error

---

## 9. Performance Considerations

### 9.1 Caching

- Prevent re-fetch on entity switch
- Keep schema data warm

### 9.2 Memoization

Use:
- React.memo for list components
- useMemo for derived counts

### 9.3 Avoid Re-renders

- Split components
- Pass stable props
- Avoid inline functions where possible

---

## 10. Concurrency & Race Conditions

### Problem

Rapid switching:
- Namespace → Entity → Entity

Leads to:
- Stale responses overriding state

### Solution

Handled automatically by query library:
- Cancels outdated requests
- Maintains correct response ordering

---

## 11. API Design Alignment

### Required Endpoints

GET /datasources/:id/namespaces GET /datasources/:id/namespaces/:ns/entities GET /datasources/:id/namespaces/:ns/entities/:entity/schema

### Response Expectations

- Deterministic ordering
- Lightweight payloads
- No redundant nesting

---

## 12. Extensibility Roadmap

### Near-Term

- Entity search
- Field filtering
- Inline editing (read-only → editable)

### Mid-Term

- Relationship visualization (graph)
- Schema diffing
- Versioning

### Long-Term

- Query builder integration
- AI-assisted schema insights
- Cross-database federation

---

## 13. Normalized Client Cache (Advanced)

Future optimization:

ts type SchemaGraph = {   namespaces: Record<string, Namespace>;   entities: Record<string, Entity>;   fields: Record<string, Field[]>; }; 

Benefits:
- Fast lookups
- Enables graph features
- Reduces redundant transformations

---

## 14. Anti-Patterns to Avoid

❌ Manual loading flags  
❌ useEffect chains for fetching  
❌ Overwriting user selection on refetch  
❌ Storing derived state  
❌ Monolithic components  

---

## 15. Summary

This design transitions the Schema Builder from:
- Imperative, state-heavy UI

To:
- Declarative, query-driven architecture

Key upgrades:
- Server-state abstraction via TanStack Query
- Component modularization
- Derived state elimination
- Strong caching + performance guarantees

This sets a foundation for evolving the module into a full-fledged schema intelligence layer within your data platform.