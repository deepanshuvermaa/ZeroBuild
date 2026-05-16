# Integration Guide

This guide shows how to integrate the PreviewComponents into your existing CanvasArea.

## Step 1: Update CanvasArea Component

Replace the mock `ComponentRenderer` in `CanvasArea.tsx` with the real preview components.

### Before (Current Implementation)

```tsx
// Mock component renderer - in production, you'd import actual components
const ComponentRenderer: React.FC<{ type: string; props: any }> = ({ type, props }) => {
  return (
    <div className="bg-white p-8 min-h-[200px] flex items-center justify-center border-b border-gray-200">
      <div className="text-center">
        <div className="text-4xl mb-2">{props.icon || '📦'}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {props.heading || props.businessName || type}
        </h3>
        <p className="text-gray-600 text-sm max-w-md">
          {props.description || props.subheading || 'Component preview will render here'}
        </p>
      </div>
    </div>
  );
};
```

### After (New Implementation)

```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
import type { ComponentType } from '@/types/component.types';

// Inside CanvasArea component, replace the ComponentRenderer section with:

<SectionWrapper section={section}>
  {(() => {
    const PreviewComponent = PreviewComponentMap[section.type as ComponentType];

    if (!PreviewComponent) {
      console.warn(`No preview component found for type: ${section.type}`);
      return (
        <div className="bg-white p-8 min-h-[200px] flex items-center justify-center border-b border-gray-200">
          <div className="text-center text-gray-500">
            <p>Preview not available for {section.type}</p>
          </div>
        </div>
      );
    }

    return (
      <PreviewComponent
        id={section.id}
        props={section.props}
        isSelected={selectedSectionId === section.id}
        onSelect={() => setSelectedSection(section.id)}
      />
    );
  })()}
</SectionWrapper>
```

## Step 2: Complete CanvasArea.tsx Code

Here's the complete updated `CanvasArea.tsx` file:

```tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { SectionWrapper } from './SectionWrapper';
import { PreviewComponentMap } from '@/components/PreviewComponents';
import { cn } from '@/lib/utils';
import type { ComponentType } from '@/types/component.types';

export const CanvasArea: React.FC = () => {
  const {
    config,
    previewMode,
    isDragging,
    selectedSectionId,
    setSelectedSection
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
    },
  });

  const sections = config.sections.sort((a, b) => a.order - b.order);
  const sectionIds = sections.map((s) => s.id);

  // Device frame dimensions
  const deviceStyles = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto',
  };

  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="min-h-full p-8">
        {/* Device Preview Frame */}
        <motion.div
          layout
          className={cn(
            'transition-all duration-300',
            deviceStyles[previewMode]
          )}
        >
          <div
            ref={setNodeRef}
            className={cn(
              'min-h-[600px] bg-white rounded-lg shadow-lg overflow-hidden',
              'transition-all duration-200',
              isOver && 'ring-2 ring-blue-500 ring-offset-4',
              isDragging && 'ring-2 ring-gray-300 ring-offset-4 ring-dashed'
            )}
          >
            {sections.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center min-h-[600px] p-12"
              >
                <div className="text-center max-w-md">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Sparkles className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Building
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag components from the sidebar to get started building your page
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Plus className="h-4 w-4" />
                    <span>Drag & Drop to Add Components</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Sections List
              <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence mode="popLayout">
                  {sections.map((section) => {
                    const PreviewComponent = PreviewComponentMap[section.type as ComponentType];

                    return (
                      <motion.div
                        key={section.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="relative"
                      >
                        <SectionWrapper section={section}>
                          {PreviewComponent ? (
                            <PreviewComponent
                              id={section.id}
                              props={section.props}
                              isSelected={selectedSectionId === section.id}
                              onSelect={() => setSelectedSection(section.id)}
                            />
                          ) : (
                            <div className="bg-white p-8 min-h-[200px] flex items-center justify-center border-b border-gray-200">
                              <div className="text-center text-gray-500">
                                <p>Preview not available for {section.type}</p>
                              </div>
                            </div>
                          )}
                        </SectionWrapper>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </SortableContext>
            )}
          </div>
        </motion.div>

        {/* Canvas Info */}
        <div className="text-center mt-4 text-sm text-gray-500">
          <p>
            Preview Mode: <span className="font-semibold capitalize">{previewMode}</span>
            {' • '}
            Sections: <span className="font-semibold">{sections.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
```

## Step 3: Update Builder Store (if needed)

Ensure your builder store has the `setSelectedSection` action:

```tsx
// In builderStore.ts
interface BuilderStore {
  // ... other state
  selectedSectionId: string | null;
  setSelectedSection: (id: string | null) => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  // ... other state
  selectedSectionId: null,

  setSelectedSection: (id) => set({ selectedSectionId: id }),

  // ... other actions
}));
```

## Step 4: Test the Integration

1. **Add a component** - Drag a component from the sidebar to the canvas
2. **View the preview** - You should see the real rendered component instead of a placeholder
3. **Select the component** - Click on it to see the selection border and edit hint
4. **Hover over it** - You should see the dotted outline
5. **Edit properties** - Change props in the properties panel and see live updates

## Step 5: Verify Functionality

Check these features work correctly:

- [ ] Components render with real content
- [ ] Selection state shows blue ring border
- [ ] Hover state shows dotted border
- [ ] Edit hint appears when selected
- [ ] Properties panel updates work
- [ ] Drag and drop still works
- [ ] Animations are smooth
- [ ] No console errors

## Troubleshooting

### Issue: Components not rendering

**Solution:** Check that:
1. PreviewComponents are properly imported
2. Component types match exactly
3. Props are correctly passed from store

### Issue: Selection not working

**Solution:** Verify:
1. `selectedSectionId` is in your store
2. `setSelectedSection` action exists
3. Click handlers aren't being blocked

### Issue: TypeScript errors

**Solution:** Ensure:
1. All type imports are correct
2. ComponentType matches your types file
3. Props interfaces are properly defined

## Next Steps

After integration:

1. **Test all 10 components** - Add each component type and verify rendering
2. **Test interactions** - Verify filtering, animations, hover effects work
3. **Test responsive** - Switch between desktop/tablet/mobile views
4. **Test edge cases** - Try empty data, missing images, etc.
5. **Performance check** - Ensure smooth performance with many components

## Advanced Customization

### Custom Preview Component

If you need a custom preview for a specific component:

```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
import { MyCustomPreview } from './MyCustomPreview';

// Override a specific component
const CustomPreviewMap = {
  ...PreviewComponentMap,
  HeroSection: MyCustomPreview,
};

// Use in CanvasArea
const PreviewComponent = CustomPreviewMap[section.type];
```

### Conditional Preview Features

Enable/disable features based on user preferences:

```tsx
const { config, previewSettings } = useBuilderStore();

<PreviewComponent
  id={section.id}
  props={section.props}
  isSelected={selectedSectionId === section.id}
  onSelect={() => setSelectedSection(section.id)}
  showAnimations={previewSettings.animations}
  showHints={previewSettings.hints}
/>
```

## Support

For issues or questions:
1. Check the main README.md
2. Review component-specific documentation
3. Check the TypeScript types
4. Test with sample data

## Complete!

You now have a fully functional preview system with professional, interactive components. Users can see exactly how their website will look as they build it!
