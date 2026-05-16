# Interview Prep: Drag-and-Drop Landing Page Builder

## 1. Project Overview

**Q: Describe the project in 2 sentences.**
A: A visual drag-and-drop website builder (like Wix/Webflow) with two apps: a **builder-app** (internal tool for designers) and a **client-template** (production website output). Users drag section components onto a canvas, customize properties, and export/generate production-ready React websites.

**Q: What problem does this solve?**
A: Eliminates the need for developers to hand-code every landing page. Non-technical users can compose pages visually, and the system generates deployable static sites.

---

## 2. Architecture & System Design

**Q: What is the high-level architecture?**
A: Dual-application monorepo:
- `builder-app` — React SPA (design tool) + Express API server (port 3001)
- `client-template` — React SPA (production website rendered from JSON config)
- `prebuilt-templates` — static HTML templates (restaurant, painting, furniture)

Data flows: **User interaction -> Zustand store -> Canvas re-render -> JSON config -> Website generation**

**Q: Why a dual-app approach instead of one app?**
A: Separation of concerns. The builder carries heavy dependencies (@dnd-kit, Monaco editor, color pickers, Radix UI) that production sites don't need. Client sites ship only React + Framer Motion + Tailwind = smaller bundle, faster load.

**Q: What is the config-driven rendering pattern you used?**
A: A single `PageConfig` JSON object (metadata, theme, whatsapp, seo, sections[]) is the **single source of truth**. Both the builder canvas and the client-template `PageRenderer` read this same schema. The renderer does a `switch(section.type)` dispatch to render the correct component. This is essentially the **Interpreter Pattern** — config is the program, renderer is the interpreter.

**Q: Walk me through the real-time editing data flow.**
A:
1. User edits a field in `PropertyEditor` (right panel)
2. `PropertyEditor` calls `useBuilderStore.updateSection(id, newProps)`
3. Zustand store updates immutably, notifies subscribers
4. `CanvasArea` re-renders, looks up `PreviewComponentMap[section.type]`
5. The correct preview component renders with new props — instant visual feedback

---

## 3. State Management

**Q: Why Zustand over Redux or Context API?**
A:
- **No Provider nesting** — subscribe from anywhere without wrapping in `<Provider>`
- **Direct subscriptions** — components subscribe to specific slices, avoiding unnecessary re-renders (unlike Context which re-renders all consumers)
- **Less boilerplate** — no actions/reducers/dispatch ceremony
- **Better DevTools** — built-in middleware support
- **Immer integration** — `use-immer` for safe nested mutations

**Q: How does undo/redo work?**
A: `historyStore` maintains two stacks: `past[]` and `future[]`, capped at 50 entries (Command Pattern). On every meaningful edit, the current `PageConfig` snapshot is pushed to `past`. Undo pops from `past` and pushes to `future`. Redo does the reverse. The builder store then applies the restored config.

**Q: What is the Command Pattern and how is it applied here?**
A: Each state snapshot is a "command." Instead of storing individual operations, we store full state snapshots. Trade-off: more memory per entry, but simpler implementation and guaranteed consistency. 50-level cap bounds memory usage.

**Q: How do you prevent unnecessary re-renders with Zustand?**
A: Zustand uses **selector-based subscriptions**. Components call `useBuilderStore(state => state.config.sections)` — only re-render when that specific slice changes. Unlike Context API where any state change re-renders all consumers.

---

## 4. Drag and Drop (@dnd-kit)

**Q: Why @dnd-kit over react-beautiful-dnd or HTML5 Drag and Drop?**
A:
- **Accessibility-first** — keyboard navigation, screen reader support built-in
- **Modular** — `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` — import only what you need
- **Framework-agnostic collision detection** — pluggable algorithms
- **Better performance** — uses CSS transforms (not DOM reflows)
- react-beautiful-dnd is deprecated/unmaintained

**Q: Explain the DnD flow in this project.**
A:
1. `ComponentCard` in sidebar is a **Draggable** (source)
2. `CanvasArea` is a **Droppable** (target)
3. On drop: `onDragEnd` fires -> extracts `ComponentType` -> calls `builderStore.addSection(type, defaultProps)`
4. Existing sections use `@dnd-kit/sortable` for **reordering** via `SortableContext`
5. `DragHandle` component provides the grab affordance
6. `SectionWrapper` wraps each section with selection, drag handle, and delete controls

**Q: What are collision detection algorithms?**
A: Algorithms that determine which droppable a draggable overlaps: `rectIntersection`, `closestCenter`, `closestCorners`, `pointerWithin`. This project likely uses `closestCenter` for sortable lists.

**Q: What is `CSS.Transform.toString()` and why use it?**
A: @dnd-kit applies transforms via CSS `transform` property instead of changing `top/left`. This avoids layout reflows (only triggers composite layer, not layout/paint phases) — smoother 60fps drag animations.

---

## 5. React Concepts

**Q: How is the Component Registry pattern implemented?**
A: `PreviewComponentMap` is a `Record<ComponentType, React.FC<any>>` — a map from string keys to React components. `CanvasArea` does `const Component = PreviewComponentMap[section.type]` then `<Component {...section.props} />`. This is the **Strategy Pattern** — swap rendering strategy based on type.

**Q: What is a Barrel Export and where is it used?**
A: `client-template/src/components/index.ts` re-exports all section components from one file. Consumers import `{ HeroSection, AboutSection } from '@/components'` instead of individual paths. Trade-off: convenient but can hurt tree-shaking if not careful.

**Q: How are shared UI components designed?**
A: `Button`, `Input`, `Select`, `Dialog` in `/shared/` follow the **Compound Component** pattern using Radix UI primitives. They accept props for variants and forward refs. `clsx` + `tailwind-merge` (via `cn()` utility) handle conditional class merging.

**Q: What is the `cn()` utility function?**
A: `cn(...classes)` = `twMerge(clsx(...classes))`. `clsx` handles conditional class strings. `tailwind-merge` intelligently resolves Tailwind class conflicts (e.g., `p-2` vs `p-4` — keeps only `p-4`).

**Q: What are Controlled vs Uncontrolled components in this project?**
A: `PropertyEditor` fields (TextInput, ColorPicker, ImageUploader) are **controlled** — state lives in Zustand store, component receives value via props and calls `updateSection` on change. The `RepeaterField` manages local array state but syncs to store on change.

---

## 6. TypeScript

**Q: How is type safety enforced across the config system?**
A: 
- `ComponentType` — union type of all section type strings (`'hero' | 'about' | 'services' | ...`)
- `PageSection` — `{ id: string; type: ComponentType; props: Record<string, any> }`
- `PageConfig` — `{ metadata, theme, whatsapp, seo, sections: PageSection[] }`
- `AdvancedStyleProps` — interface for styling (colors, spacing, etc.)
- `TextStyleProps` — interface for typography controls

**Q: What is a Discriminated Union and how could it improve this codebase?**
A: Currently `props` is `Record<string, any>`. A discriminated union would be: `type PageSection = { type: 'hero'; props: HeroProps } | { type: 'about'; props: AboutProps } | ...`. TypeScript would then narrow `props` based on `type` — no `any` needed.

**Q: Why use Zod alongside TypeScript?**
A: TypeScript is compile-time only. Zod provides **runtime validation** — critical for:
- Validating imported JSON configs (user uploads)
- API request/response validation
- `componentSchemas.ts` validates section props at runtime
- Zod schemas can infer TS types: `type X = z.infer<typeof schema>`

---

## 7. Build Tools & Toolchain

**Q: What is Vite and why use it over Webpack?**
A:
- **Dev server**: Uses native ES modules + esbuild for instant HMR (no bundling in dev)
- **Build**: Uses Rolldown (Rust-based bundler) for production
- **Speed**: 10-100x faster than Webpack cold starts
- **Config**: Minimal — convention over configuration

**Q: What is HMR (Hot Module Replacement)?**
A: When you edit a file, only that module is replaced in the browser — no full page reload. React state is preserved. Vite achieves this via native ESM + `@vitejs/plugin-react` which handles React Fast Refresh.

**Q: Explain the PostCSS -> Tailwind CSS pipeline.**
A: `postcss.config.js` registers `@tailwindcss/postcss` plugin. On build: CSS files pass through PostCSS -> Tailwind processes `@tailwind` directives, scans source files for class usage, generates only used utility classes (tree-shaking CSS). Autoprefixer adds vendor prefixes.

**Q: What is Tailwind CSS 4's new approach?**
A: Tailwind 4 moved to a **CSS-first configuration** (no more `tailwind.config.js` required for basic setups). Uses `@theme` in CSS, native CSS cascade layers, and the oxide engine (Rust-based) for faster builds.

**Q: What is Tree Shaking?**
A: Dead code elimination. Bundler (Rolldown/Rollup) analyzes ES module `import/export` and removes unused exports. Requires ESM (`import/export`), not CJS (`require`). That's why `"type": "module"` in `package.json`.

---

## 8. Styling

**Q: Why Tailwind CSS over traditional CSS or CSS-in-JS?**
A:
- **No naming collisions** — utility classes, no BEM/CSS Modules needed
- **Tiny production CSS** — tree-shakes unused classes, typical output ~10KB
- **Consistent design** — spacing/color scales enforce design system
- **Co-location** — styles live in markup, no context-switching

**Q: What is the Design System utility in this project?**
A: `designSystem.ts` provides helper functions that map `AdvancedStyleProps` (borderRadius, shadow, gradient) to Tailwind classes or inline styles. Ensures all preview components render consistently.

**Q: What is `textStyles.ts`?**
A: Maps `TextStyleProps` (fontWeight, fontSize, letterSpacing, textTransform) to CSS style objects. Used by both preview components and client components to apply consistent typography.

---

## 9. Animation (Framer Motion)

**Q: Why Framer Motion over CSS animations?**
A:
- **Declarative** — `animate={{ opacity: 1 }}` vs writing keyframes
- **Layout animations** — `layout` prop auto-animates position/size changes
- **Gesture support** — `whileHover`, `whileTap`, `whileDrag`
- **AnimatePresence** — animate components mounting/unmounting (impossible with CSS)
- **Scroll-triggered** — `whileInView` for reveal animations

**Q: What are Motion Variants?**
A: Predefined animation states in `motionVariants.ts`. Example:
```ts
const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }
```
Components reference variants by name — DRY, reusable animation definitions.

**Q: What is the ScrollReveal shared component?**
A: Wraps children in a Framer Motion `motion.div` with `whileInView` trigger. Uses `react-intersection-observer` to detect when element enters viewport, then plays entrance animation. Configurable threshold, delay, direction.

**Q: What categories of animations does this project support?**
A: Micro-interactions, scroll-triggered reveals, 3D transforms, typography animations, background effects, loading animations, cursor effects.

---

## 10. Backend & API

**Q: Describe the server architecture.**
A: Express.js server (port 3001) with:
- `build-api.js` — receives `PageConfig` JSON, runs Vite build, returns static site as ZIP
- Authentication: JWT tokens + bcryptjs password hashing
- Database: PostgreSQL via Drizzle ORM
- File uploads: Multer middleware
- FTP deployment: `basic-ftp` for cPanel deployment

**Q: What is Drizzle ORM and why use it?**
A: TypeScript-first ORM that generates SQL queries with full type safety. Unlike Prisma, it doesn't require a separate schema file or code generation step. Queries are written in a SQL-like builder syntax.

**Q: How does the build/export pipeline work?**
A: Two modes:
1. **Client-side export**: `exportConfig.ts` serializes `PageConfig` to JSON file. `generateWebsite.ts` generates standalone HTML/CSS/JS.
2. **Server-side build**: POST config to Express API -> copies `client-template`, injects config, runs `vite build`, ZIPs output, streams back. This produces optimized production bundles.

**Q: How does config import/validation work?**
A: `importConfig.ts` reads JSON file -> `validation.ts` validates against `PageConfig` schema using Zod -> sanitizes/migrates if needed -> loads into `builderStore`.

---

## 11. Component Design Patterns

**Q: List the design patterns used in this project.**
A:
| Pattern | Where |
|---|---|
| Strategy | PreviewComponentMap — swap render strategy by type |
| Command | History store — undo/redo via state snapshots |
| Observer | Zustand subscriptions — components observe store changes |
| Registry | ComponentDefinitions — register available components |
| Composite | PageConfig.sections[] — tree of section nodes |
| Facade | `cn()` utility — simple API over clsx + tailwind-merge |
| Template Method | PreviewComponents — all follow same props interface pattern |
| Factory | `addSection(type)` — creates section with default props based on type |

**Q: How are preview vs client components different?**
A: Same props interface, different rendering:
- **Preview** (builder-app): Shows editing affordances (selection outline, drag handle), scales to canvas size, uses `previewHelpers.ts` for builder-specific utilities
- **Client** (client-template): Full-width production rendering, Framer Motion animations, SEO-optimized, no editing UI

**Q: What is the RepeaterField pattern?**
A: A dynamic form field that manages arrays (services list, menu items, testimonials). Add/remove/reorder items. Each item has its own sub-fields. Syncs array state back to store. Common in page builders (WordPress ACF, Webflow CMS).

---

## 12. UI Library Choices

**Q: Why Radix UI?**
A: Unstyled, accessible primitives (Dialog, Select, Tabs, Label). Handles WAI-ARIA, keyboard navigation, focus management. You bring your own styles (Tailwind). Unlike Material UI which forces a design language.

**Q: Why Monaco Editor?**
A: Same editor powering VS Code. Used in `CodeEditorPanel` for viewing/editing generated code. Syntax highlighting, IntelliSense, multi-language support. Embedded via `@monaco-editor/react`.

**Q: Why react-colorful over other color pickers?**
A: 2KB minified (vs 30KB+ for react-color). Zero dependencies. Accessible. Supports HSL/RGB/Hex. Perfect for a color picker that appears in a properties panel.

**Q: Why Lucide React for icons?**
A: Tree-shakeable (import only icons you use). Consistent 24x24 SVG design. Fork of Feather Icons with active maintenance. Each icon is ~1KB.

---

## 13. Deployment & DevOps

**Q: How are client sites deployed?**
A: 
1. Build: Vite compiles React -> static HTML/CSS/JS (`dist/`)
2. Deploy options: cPanel file manager upload, FTP via `basic-ftp`, or manual ZIP download
3. Static sites — no server needed. Any CDN/hosting works.

**Q: What is SPA vs SSR and which does this project use?**
A: **SPA (Single Page Application)**. Both apps are client-rendered React SPAs. Trade-off: worse initial SEO (mitigated by meta tags in config), but simpler deployment. SSR (Next.js) would improve SEO but adds server complexity.

**Q: How does the SEO config work in an SPA?**
A: `PageConfig.seo` (title, description, keywords) is injected into `<head>` meta tags at build time or via `document.title` at runtime. For full SEO, the `generateWebsite.ts` produces static HTML with meta tags pre-rendered.

---

## 14. Performance Concepts

**Q: What performance optimizations exist?**
A:
- **Zustand selectors** — prevent unnecessary re-renders
- **CSS transforms for DnD** — avoid layout thrashing
- **Tailwind tree-shaking** — minimal CSS output
- **Vite code splitting** — lazy load heavy components (Monaco editor)
- **Immer** — structural sharing for immutable updates (reuses unchanged subtrees)
- **50-entry history cap** — bounded memory for undo/redo

**Q: What is Structural Sharing (Immer)?**
A: When you update a nested object, Immer only creates new references for changed paths. Unchanged subtrees keep their original references. This means `===` checks on unchanged parts return true — enabling React.memo / selector optimizations.

**Q: What is Layout Thrashing?**
A: Reading layout properties (offsetHeight) then writing (style.height) forces the browser to synchronously recalculate layout. @dnd-kit avoids this by using CSS transforms which only affect the composite layer, not the layout.

---

## 15. Security

**Q: What security measures are in the project?**
A:
- **JWT authentication** — stateless auth tokens for API endpoints
- **bcryptjs** — password hashing with salt rounds (never store plain text)
- **Zod validation** — validates all incoming data at API boundaries
- **CORS** — `cors` middleware restricts cross-origin requests
- **cookie-parser** — secure cookie handling for auth tokens
- **Input sanitization** — config validation prevents injection via imported JSON

**Q: Why JWT over sessions?**
A: Stateless — no server-side session store needed. Scales horizontally. Token contains claims (userId, expiry). Trade-off: can't revoke individual tokens (use short expiry + refresh tokens to mitigate).

---

## 16. Template System

**Q: How does the template system work?**
A: `templates.ts` exports an array of `PageConfig` objects (restaurant, tech startup, law firm, portfolio). `TemplateGallery` component displays them with thumbnails. Selecting one loads the full config into `builderStore`, populating all sections with pre-designed content.

**Q: What are the 3 prebuilt templates?**
A: Restaurant & Food Delivery, Painting & Interior Design, Furniture & Home Decor. These are standalone HTML files with embedded CSS/JS, WhatsApp integration, and rich animations. They serve as production-ready starting points.

---

## 17. Key Interview Rapid-Fire

| Question | Answer |
|---|---|
| What is JSX? | Syntactic sugar for `React.createElement()`. Transpiled by Babel/SWC. |
| Virtual DOM? | In-memory representation of UI. React diffs (reconciliation) and patches real DOM. |
| Reconciliation? | React's diffing algorithm. O(n) heuristic — same type = update, different type = remount. |
| React 19 key feature? | React Compiler (auto-memoization), `use()` hook, Server Components. |
| What is a Hook? | Function that lets you use React features (state, effects, context) in functional components. |
| useEffect cleanup? | Return function from useEffect runs before next effect or unmount. Prevents memory leaks. |
| What is Immer? | Lets you write "mutating" code that produces immutable updates via Proxy objects. |
| ESM vs CJS? | ESM: `import/export`, static analysis, tree-shakeable. CJS: `require/module.exports`, dynamic, not tree-shakeable. |
| What is PostCSS? | CSS transformer pipeline. Plugins (Tailwind, Autoprefixer) transform CSS at build time. |
| What is a Monorepo? | Multiple projects in one repo. Shared deps, atomic commits, consistent tooling. |
| What is CORS? | Browser security. Server must send `Access-Control-Allow-Origin` headers to allow cross-origin requests. |
| What is Middleware (Express)? | Function with `(req, res, next)`. Processes request before handler. Multer, CORS, cookie-parser are middleware. |
| What is ORM? | Object-Relational Mapping. Write DB queries as code (Drizzle), not raw SQL. |
| What is a UUID? | Universally Unique Identifier. 128-bit. Used for section IDs (`generateId()`). |
| What is JSZip? | Library to create/read ZIP files in JS. Used to package generated website for download. |

---

## 18. System Design Questions

**Q: If you had to scale this to 10,000 concurrent users editing, what changes?**
A: 
- Move state to server (WebSocket + CRDT for real-time collaboration)
- Add Redis for session/cache
- Queue builds with Bull/BullMQ (don't block Express on Vite builds)
- Store configs in S3/CDN, not just PostgreSQL
- Add rate limiting and build worker pool

**Q: How would you add real-time collaboration (like Figma)?**
A: 
- WebSocket server (Socket.io or Liveblocks)
- CRDTs or OT (Operational Transform) for conflict-free concurrent edits
- Cursor presence (show other users' cursors)
- Optimistic updates on client, server reconciliation

**Q: How would you add multi-page support?**
A: Change `PageConfig.sections[]` to `PageConfig.pages: { [route: string]: PageSection[] }`. Add a page navigator in the builder. `PageRenderer` switches on route. React Router handles client-side navigation.
