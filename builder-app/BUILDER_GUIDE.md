# Page Builder App - Complete Implementation Guide

## Overview

A professional, production-ready drag-and-drop page builder application built with React, TypeScript, and modern web technologies. This builder allows users to create custom landing pages by dragging components from a sidebar onto a canvas, editing their properties, and exporting the configuration.

---

## Architecture

### Component Structure

```
src/
├── components/
│   ├── Builder/
│   │   ├── Sidebar/
│   │   │   ├── ComponentLibrary.tsx    # Main component library with search and categories
│   │   │   └── ComponentCard.tsx       # Individual draggable component card
│   │   ├── Canvas/
│   │   │   ├── CanvasArea.tsx          # Main drop zone with device preview
│   │   │   ├── SectionWrapper.tsx      # Wrapper for each section with controls
│   │   │   └── DragHandle.tsx          # Drag handle component
│   │   ├── PropertiesPanel/
│   │   │   ├── PropertyEditor.tsx      # Dynamic property editor
│   │   │   ├── TextInput.tsx           # Text input field
│   │   │   ├── ColorPicker.tsx         # Color picker with presets
│   │   │   ├── ImageUploader.tsx       # Image URL input with preview
│   │   │   └── RepeaterField.tsx       # Array field editor
│   │   └── Toolbar/
│   │       ├── TopToolbar.tsx          # Main toolbar with actions
│   │       └── UndoRedo.tsx            # Undo/Redo controls
│   └── shared/
│       ├── Button.tsx                   # Reusable button component
│       ├── Input.tsx                    # Reusable input component
│       ├── Select.tsx                   # Reusable select component
│       └── Dialog.tsx                   # Modal dialog component
├── store/
│   ├── builderStore.ts                  # Main builder state management
│   └── historyStore.ts                  # Undo/redo history management
├── utils/
│   ├── componentDefinitions.ts          # Component definitions and defaults
│   ├── exportConfig.ts                  # JSON export utilities
│   ├── importConfig.ts                  # JSON import utilities
│   └── validation.ts                    # Configuration validation
├── types/
│   ├── component.types.ts               # Component type definitions
│   └── config.types.ts                  # Configuration type definitions
└── App.tsx                              # Main app with DnD context
```

---

## Features

### 1. Component Library (Left Sidebar)

- **Organized by Categories**: Hero, Content, Interactive, Footer, Utility
- **Search Functionality**: Real-time component search
- **Collapsible Sections**: Expand/collapse categories
- **Draggable Cards**: Each component is draggable to the canvas
- **10 Pre-built Components**:
  - Hero Section
  - About Section
  - Services Section
  - Menu Section
  - Gallery Section
  - Testimonials Section
  - Offers Section
  - Call to Action
  - Footer Section
  - Floating WhatsApp Button

### 2. Canvas Area (Center)

- **Device Preview Modes**: Desktop, Tablet, Mobile
- **Drag & Drop**: Drop components from sidebar
- **Section Reordering**: Drag to reorder existing sections
- **Visual Feedback**: Hover effects and drag overlays
- **Empty State**: Helpful message when no components
- **Selection System**: Click to select sections
- **Inline Controls**: Drag handle, section type, delete button

### 3. Properties Panel (Right Sidebar)

- **Dynamic Form Generation**: Based on selected component type
- **Multiple Field Types**:
  - Text inputs (single and multiline)
  - Color pickers with presets
  - Image uploaders with preview
  - Number inputs with ranges
  - Select dropdowns
  - Repeater fields for arrays
- **Real-time Updates**: Changes reflect immediately in canvas
- **Collapsible Interface**: Hides when no selection

### 4. Top Toolbar

- **File Operations**:
  - New: Create new project
  - Save: Download as JSON
  - Load: Import from JSON
  - Export: Export configuration
  - Generate: Create build files
- **History Controls**: Undo/Redo buttons
- **Preview Modes**: Desktop/Tablet/Mobile toggle
- **Settings**: Project metadata editor
- **Unsaved Changes Indicator**: Visual indicator for unsaved work

### 5. State Management

#### Builder Store (Zustand)
- Configuration management
- Section CRUD operations
- Selection state
- Preview mode
- Metadata and theme settings

#### History Store (Zustand)
- Undo/Redo functionality
- State history (50 states max)
- Automatic state recording

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo (alternate) |
| `Delete` / `Backspace` | Delete selected section |
| `Escape` | Deselect current section |

---

## Drag and Drop System

### Implementation Details

- **Library**: @dnd-kit/core and @dnd-kit/sortable
- **Sensors**: Pointer and Keyboard sensors
- **Collision Detection**: closestCenter algorithm
- **Activation**: 8px movement threshold

### Drag Types

1. **New Component** (Sidebar → Canvas)
   - Dragging from ComponentLibrary
   - Creates new section with default props
   - Records state for undo

2. **Section Reordering** (Canvas → Canvas)
   - Dragging existing sections
   - Uses sortable context
   - Updates order property

---

## Component Definitions

Each component has:
- **Type**: Unique identifier
- **Label**: Display name
- **Icon**: Emoji representation
- **Category**: Organization group
- **Description**: Short explanation
- **Default Props**: Initial property values

Example:
```typescript
{
  type: 'HeroSection',
  label: 'Hero Section',
  icon: '🎯',
  category: 'hero',
  description: 'Full-screen hero section with heading, subheading, and CTA',
  defaultProps: {
    heading: 'Welcome to Our Business',
    subheading: 'We provide exceptional services for your needs',
    ctaText: 'Contact Us',
    // ... more props
  }
}
```

---

## Data Flow

### Adding a Component
1. User drags component from sidebar
2. DnD system detects drop on canvas
3. `handleDragEnd` checks for "new-component" type
4. Gets default props from componentDefinitions
5. Records current state to history
6. Calls `addSection` in builderStore
7. New section added with generated ID and order
8. Canvas re-renders with new section

### Editing Properties
1. User clicks section in canvas
2. `selectedSectionId` updated in store
3. PropertyEditor renders with dynamic fields
4. User modifies field
5. `updateSection` called with new prop values
6. Section props updated in store
7. Canvas re-renders with changes
8. State recorded for undo after 1s debounce

### Undo/Redo
1. State changes recorded to historyStore
2. User triggers undo (Ctrl+Z)
3. Previous state retrieved from history
4. `setConfig` called with previous state
5. All components re-render with old state
6. Future states moved to redo stack

---

## Validation System

### Import Validation
- JSON format validation
- Schema validation using custom validators
- Type checking for all properties
- Automatic fallback values
- Error reporting

### Configuration Structure
```typescript
{
  metadata: {
    clientName: string
    projectName: string
    createdAt: ISO8601
    updatedAt: ISO8601
    version: string
  },
  theme: {
    primaryColor: hex
    secondaryColor: hex
    fontFamily: string
  },
  whatsapp: {
    phoneNumber: string
    defaultMessage: string
    enabled: boolean
  },
  seo: {
    title: string
    description: string
    keywords: string[]
  },
  sections: PageSection[]
}
```

---

## Styling System

### Tailwind CSS
- Utility-first approach
- Custom theme configuration
- Responsive design built-in
- Dark mode ready (can be extended)

### Framer Motion
- Smooth animations
- Layout animations
- Drag overlays
- Enter/exit transitions

### Color Picker
- react-colorful integration
- Preset color palettes
- Hex color input
- Real-time preview

---

## Export/Import

### Export Formats
1. **JSON Configuration**: Complete page configuration
2. **Build Files**: Ready-to-deploy configuration (mock)

### Import
- File upload via input
- JSON validation
- Schema verification
- Error handling
- Success notification

---

## Best Practices

### Performance
- Debounced state recording (1s)
- Memoized callbacks
- Efficient re-renders
- Lazy loading where applicable

### Accessibility
- Keyboard navigation support
- ARIA labels where needed
- Focus management
- Screen reader friendly

### User Experience
- Visual feedback on all interactions
- Loading states
- Error messages
- Confirmation dialogs
- Unsaved changes warning

---

## Extension Points

### Adding New Components
1. Add type to `component.types.ts`
2. Add props interface
3. Create component definition in `componentDefinitions.ts`
4. Add to category
5. Component automatically appears in sidebar

### Custom Property Types
1. Create new input component in PropertiesPanel
2. Add to `PropertyEditor.tsx` render logic
3. Handle in `renderField` function

### Custom Themes
1. Extend `ThemeConfig` type
2. Add fields to settings dialog
3. Apply theme variables globally

---

## Development Workflow

### Setup
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
npm run preview
```

### Project Structure
- Keep components focused and single-purpose
- Use TypeScript strictly
- Follow existing naming conventions
- Add proper type definitions

---

## Technical Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **@dnd-kit**: Drag and drop
- **Zustand**: State management
- **Radix UI**: Accessible primitives
- **react-colorful**: Color picker
- **Lucide React**: Icons

---

## Known Limitations

1. Component previews are simplified (no full rendering)
2. Image uploads use URLs only (no file upload)
3. Build generation is mock (needs backend)
4. No collaborative editing
5. No template system yet

---

## Future Enhancements

- [ ] Real component rendering in canvas
- [ ] Template library
- [ ] Component marketplace
- [ ] Cloud save/sync
- [ ] Collaborative editing
- [ ] Version control
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Export to React/HTML
- [ ] Custom component builder

---

## Support

For issues, questions, or contributions, please refer to the main project documentation.

---

**Built with precision and care for modern web development.**
