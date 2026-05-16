# Builder Architecture - Real-Time Visual Editing

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────────────┐  ┌──────────────┐ │
│  │   SIDEBAR    │  │       CANVAS         │  │  PROPERTIES  │ │
│  │              │  │                      │  │    PANEL     │ │
│  │ Component    │  │  ┌───────────────┐  │  │              │ │
│  │ Library      │  │  │  HeroSection  │  │  │ - Heading    │ │
│  │              │  │  │  (Preview)    │  │  │ - Color      │ │
│  │ - Hero       │  │  │  [SELECTED]   │  │  │ - Image      │ │
│  │ - About      │  │  └───────────────┘  │  │ - ...        │ │
│  │ - Services   │  │                      │  │              │ │
│  │ - Gallery    │  │  ┌───────────────┐  │  │ [Save]       │ │
│  │ - ...        │  │  │ AboutSection  │  │  │              │ │
│  │              │  │  │  (Preview)    │  │  │              │ │
│  │              │  │  └───────────────┘  │  │              │ │
│  └──────────────┘  └──────────────────────┘  └──────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  ZUSTAND STORE   │
                    │                  │
                    │  config:         │
                    │    sections: []  │
                    │  selectedId      │
                    │                  │
                    │  Actions:        │
                    │  - updateSection │
                    │  - addSection    │
                    │  - deleteSection │
                    └──────────────────┘
```

## Data Flow - Real-Time Updates

### 1. Initial Render
```
User opens builder
    ↓
App loads with empty config
    ↓
Sidebar shows component library
    ↓
Canvas shows "Start Building" empty state
```

### 2. Adding a Component
```
User drags "Hero Section" from sidebar
    ↓
Drop event triggers addSection()
    ↓
Store adds new section with default props
    ↓
Store triggers re-render
    ↓
CanvasArea maps section.type to PreviewComponent
    ↓
HeroSectionPreview renders with default props
    ↓
User sees REAL hero section with:
  - Background color
  - Heading text
  - Subheading text
  - CTA button
```

### 3. Selecting a Component
```
User clicks on hero section in canvas
    ↓
PreviewComponent onSelect() fires
    ↓
setSelectedSection(section.id) called
    ↓
Store updates selectedSectionId
    ↓
Two things happen:
  1. Canvas: Blue border appears around section
  2. Properties Panel: Opens with section's props
```

### 4. Editing Properties (THE MAGIC)
```
User changes "Heading" in properties panel
    ↓
PropertyEditor onChange fires
    ↓
updateSection(id, { heading: "New Heading" }) called
    ↓
Store merges new props with existing:
  { ...section.props, ...newProps }
    ↓
Zustand triggers re-render
    ↓
CanvasArea re-renders (React sees store change)
    ↓
PreviewComponent receives NEW props
    ↓
Component re-renders with new heading
    ↓
User sees "New Heading" INSTANTLY on canvas
```

**This happens in MILLISECONDS - feels instant!**

## Component Integration

### CanvasArea.tsx - The Hub
```typescript
{sections.map((section) => {
  // Map section type to actual preview component
  const PreviewComponent = PreviewComponentMap[section.type];

  return (
    <SectionWrapper section={section}>
      <PreviewComponent
        id={section.id}
        props={section.props}              // ← Real props from store
        isSelected={selected === section.id}
        onSelect={() => setSelected(section.id)}
      />
    </SectionWrapper>
  );
})}
```

### PreviewComponentMap - The Registry
```typescript
export const PreviewComponentMap = {
  HeroSection: HeroSectionPreview,
  AboutSection: AboutSectionPreview,
  ServicesSection: ServicesSectionPreview,
  MenuSection: MenuSectionPreview,
  GallerySection: GallerySectionPreview,
  TestimonialsSection: TestimonialsSectionPreview,
  OffersSection: OffersSectionPreview,
  CTASection: CTASectionPreview,
  FooterSection: FooterSectionPreview,
  FloatingWhatsApp: FloatingWhatsAppPreview,
};
```

### Preview Component Interface
```typescript
interface PreviewProps {
  id: string;                      // Section unique ID
  props: HeroSectionProps;         // Component-specific props
  isSelected: boolean;             // Is this section selected?
  onSelect: () => void;            // Handler to select this section
}

export const HeroSectionPreview: React.FC<PreviewProps> = ({
  id: _id,
  props,
  isSelected,
  onSelect,
}) => {
  // Destructure props with defaults
  const {
    heading = 'Default Heading',
    backgroundColor = '#1e293b',
    // ...
  } = props;

  return (
    <div onClick={onSelect} style={{ backgroundColor }}>
      <h1>{heading}</h1>
      {/* Real content renders here */}
    </div>
  );
};
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                   ZUSTAND STORE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  config: {                                              │
│    sections: [                                          │
│      {                                                  │
│        id: "abc123",                                    │
│        type: "HeroSection",                             │
│        order: 0,                                        │
│        props: {                                         │
│          heading: "Welcome",           ← User can edit │
│          backgroundColor: "#1e293b",   ← User can edit │
│          backgroundImage: "url",       ← User can edit │
│          // ...                                         │
│        }                                                │
│      },                                                 │
│      // ... more sections                               │
│    ]                                                    │
│  }                                                      │
│                                                         │
│  Actions:                                               │
│  - updateSection(id, newProps) {                        │
│      sections.map(s =>                                  │
│        s.id === id                                      │
│          ? { ...s, props: { ...s.props, ...newProps }} │
│          : s                                            │
│      )                                                  │
│    }                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
           │                        ▲
           │ Subscribe              │ Update
           ▼                        │
┌──────────────────┐      ┌──────────────────┐
│  CanvasArea      │      │ PropertyEditor   │
│  (Renders)       │      │ (User Input)     │
└──────────────────┘      └──────────────────┘
```

## Why It's So Fast

### 1. Zustand Optimization
- Only components subscribed to changed data re-render
- No unnecessary re-renders across the app
- Minimal state updates

### 2. React 19 Features
- Automatic batching of updates
- Improved reconciliation
- Faster diff algorithm

### 3. Component-Level Updates
- Each preview component is isolated
- Changing Hero doesn't re-render About
- Granular prop updates

### 4. No Debouncing Needed
- Updates are fast enough without debounce
- User sees changes as they type
- Smooth, responsive experience

## Key Technical Decisions

### Why Zustand over Context?
- **Faster:** Direct subscriptions, no provider nesting
- **Simpler:** Less boilerplate, cleaner code
- **Better DevTools:** Easy debugging

### Why Preview Components?
- **Separation:** Build mode vs. published mode
- **Flexibility:** Can add builder-specific UI
- **Reusability:** Same props interface as final components

### Why Component Map?
- **Type-Safe:** TypeScript knows all component types
- **Extensible:** Easy to add new components
- **Maintainable:** Single source of truth

## File Structure

```
builder-app/
├── src/
│   ├── components/
│   │   ├── Builder/
│   │   │   ├── Canvas/
│   │   │   │   ├── CanvasArea.tsx           ← Integration point
│   │   │   │   ├── SectionWrapper.tsx       ← Drag/selection wrapper
│   │   │   │   └── DragHandle.tsx
│   │   │   ├── PropertiesPanel/
│   │   │   │   ├── PropertyEditor.tsx       ← User input
│   │   │   │   ├── TextInput.tsx
│   │   │   │   ├── ColorPicker.tsx
│   │   │   │   └── ImageUploader.tsx
│   │   │   └── Sidebar/
│   │   │       └── ComponentLibrary.tsx
│   │   └── PreviewComponents/
│   │       ├── index.ts                     ← PreviewComponentMap
│   │       ├── HeroSectionPreview.tsx       ← Real component
│   │       ├── AboutSectionPreview.tsx
│   │       └── ...
│   ├── store/
│   │   └── builderStore.ts                  ← Zustand store
│   ├── types/
│   │   └── component.types.ts               ← TypeScript types
│   └── utils/
│       └── componentDefinitions.ts           ← Component metadata
```

## Extension Points

### Adding a New Component Type

1. **Create Preview Component**
   ```typescript
   // NewSectionPreview.tsx
   export const NewSectionPreview: React.FC<PreviewProps> = ({
     id: _id, props, isSelected, onSelect
   }) => {
     return <div onClick={onSelect}>...</div>;
   };
   ```

2. **Add to PreviewComponentMap**
   ```typescript
   export const PreviewComponentMap = {
     // ...
     NewSection: NewSectionPreview,
   };
   ```

3. **Define Props Type**
   ```typescript
   export interface NewSectionProps {
     title: string;
     // ...
   }
   ```

4. **Add Component Definition**
   ```typescript
   export const componentDefinitions = {
     NewSection: {
       label: 'New Section',
       description: 'A new section',
       // ...
     },
   };
   ```

That's it! The builder will automatically:
- Show it in sidebar
- Render it in canvas
- Enable property editing
- Support drag/drop, select, delete

## Performance Metrics

### Target Performance
- Property change → Visual update: < 16ms (60 FPS)
- Add component → Render: < 100ms
- Select component → Properties load: < 50ms

### Optimization Techniques Used
- React.memo on stable components
- Framer Motion layout animations
- Zustand selective subscriptions
- Lazy evaluation of complex props

## Conclusion

The builder achieves Odoo/Wix-like real-time editing through:

1. **Direct State → UI Binding** (Zustand)
2. **Real Preview Components** (Not placeholders)
3. **Instant Prop Updates** (No debouncing needed)
4. **Type-Safe Architecture** (TypeScript throughout)
5. **Component Isolation** (Granular re-renders)

Result: **Buttery-smooth visual editing experience!**
