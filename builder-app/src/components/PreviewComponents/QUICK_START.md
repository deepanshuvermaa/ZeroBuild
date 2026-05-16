# Quick Start Guide

Get up and running with Preview Components in 5 minutes!

## Step 1: Import (30 seconds)

Open your `CanvasArea.tsx` file and add this import at the top:

```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
```

## Step 2: Replace Component Renderer (2 minutes)

Find this section in your CanvasArea component:

```tsx
// OLD CODE - Remove this
const ComponentRenderer: React.FC<{ type: string; props: any }> = ({ type, props }) => {
  return (
    <div className="bg-white p-8 min-h-[200px]">
      <div className="text-center">
        <div className="text-4xl mb-2">{props.icon || '📦'}</div>
        <h3>{props.heading || type}</h3>
      </div>
    </div>
  );
};
```

Replace it with:

```tsx
// NEW CODE - Use this instead
// No need for ComponentRenderer anymore!
```

## Step 3: Update Section Rendering (2 minutes)

Find where sections are rendered (in the map function), and change from:

```tsx
<SectionWrapper section={section}>
  <ComponentRenderer
    type={section.type}
    props={section.props}
  />
</SectionWrapper>
```

To:

```tsx
<SectionWrapper section={section}>
  {(() => {
    const PreviewComponent = PreviewComponentMap[section.type];
    return PreviewComponent ? (
      <PreviewComponent
        id={section.id}
        props={section.props}
        isSelected={selectedSectionId === section.id}
        onSelect={() => setSelectedSection(section.id)}
      />
    ) : null;
  })()}
</SectionWrapper>
```

## Step 4: Test (30 seconds)

1. Save the file
2. Refresh your browser
3. Drag a component to the canvas
4. You should see a beautiful, real preview instead of a placeholder!

## That's It!

You're done! Your builder now shows professional previews.

---

## Full Example: Complete CanvasArea.tsx

If you want to see the complete file, here it is:

```tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useBuilderStore } from '@/store/builderStore';
import { SectionWrapper } from './SectionWrapper';
import { PreviewComponentMap } from '@/components/PreviewComponents';
import { cn } from '@/lib/utils';

export const CanvasArea: React.FC = () => {
  const {
    config,
    previewMode,
    isDragging,
    selectedSectionId,
    setSelectedSection,
  } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: { type: 'canvas' },
  });

  const sections = config.sections.sort((a, b) => a.order - b.order);
  const sectionIds = sections.map((s) => s.id);

  const deviceStyles = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto',
  };

  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="min-h-full p-8">
        <motion.div
          layout
          className={cn('transition-all duration-300', deviceStyles[previewMode])}
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center min-h-[600px] p-12"
              >
                <div className="text-center max-w-md">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Start Building
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag components from the sidebar to get started
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Plus className="h-4 w-4" />
                    <span>Drag & Drop to Add Components</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                <AnimatePresence mode="popLayout">
                  {sections.map((section) => {
                    const PreviewComponent = PreviewComponentMap[section.type];

                    return (
                      <motion.div
                        key={section.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
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
                            <div className="p-8 text-center text-gray-500">
                              Preview not available for {section.type}
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

---

## Troubleshooting

### "PreviewComponentMap is not defined"

Make sure you imported it:
```tsx
import { PreviewComponentMap } from '@/components/PreviewComponents';
```

### "setSelectedSection is not a function"

Add it to your store:
```tsx
setSelectedSection: (id: string | null) => set({ selectedSectionId: id }),
```

### "Component not rendering"

Check that:
1. The component type matches exactly (e.g., 'HeroSection')
2. Props are being passed correctly
3. No TypeScript errors in console

### Still having issues?

Check the full guides:
- `INTEGRATION_GUIDE.md` - Complete integration steps
- `TESTING.md` - Testing and verification
- `README.md` - Full documentation

---

## What You Get

After this quick setup, you'll have:

- Real visual previews instead of placeholders
- Selection states with blue borders
- Hover effects with dotted outlines
- Edit hints when components are selected
- Professional animations
- Fully responsive designs
- All 10 component types working

---

## Next Steps

1. **Test it** - Add each component type and verify
2. **Customize** - Adjust colors, spacing, animations
3. **Extend** - Add more preview components as needed
4. **Deploy** - Ship it to production!

---

## Need Help?

Consult these files:
- `README.md` - Main documentation
- `INTEGRATION_GUIDE.md` - Detailed integration
- `TESTING.md` - Testing guide
- `COMPONENT_FEATURES.md` - Feature reference

---

**Total time: ~5 minutes**
**Complexity: Easy**
**Result: Professional preview system!**
