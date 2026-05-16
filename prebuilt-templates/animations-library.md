# Animation Library Reference

## Complete Guide to Modern Web Animations

This document provides implementation details for all animation types used in the pre-built templates.

---

## Table of Contents
1. [Micro-interactions](#micro-interactions)
2. [Scroll-Triggered Animations](#scroll-triggered-animations)
3. [3D Effects](#3d-effects)
4. [Typography Animations](#typography-animations)
5. [Background Animations](#background-animations)
6. [Loading Animations](#loading-animations)
7. [Cursor Effects](#cursor-effects)
8. [Implementation Code](#implementation-code)

---

## Micro-interactions

Small, functional animations that provide visual feedback to user actions.

### Button Hover Effects

#### 1. **Lift & Glow**
```javascript
// Framer Motion
const liftGlow = {
  hover: {
    y: -3,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: { duration: 0.2 }
  }
}

// CSS Alternative
.button-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}
```

#### 2. **Pulse Glow**
```javascript
// Framer Motion
const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(220, 38, 38, 0.7)",
      "0 0 0 10px rgba(220, 38, 38, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
}
```

#### 3. **Slide Right Arrow**
```javascript
const slideArrow = {
  hover: {
    x: 5,
    transition: { duration: 0.2 }
  }
}
```

### Form Input Effects

#### Focus Animation
```css
.input-field {
  border: 2px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-field:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  transform: scale(1.01);
}
```

---

## Scroll-Triggered Animations

### Basic Fade In on Scroll

```javascript
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Usage
<motion.div {...fadeInUp}>
  Content here
</motion.div>
```

### Stagger Children

```javascript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Usage
<motion.div variants={container} initial="hidden" whileInView="show">
  <motion.div variants={item}>Item 1</motion.div>
  <motion.div variants={item}>Item 2</motion.div>
  <motion.div variants={item}>Item 3</motion.div>
</motion.div>
```

### Parallax Scrolling

```javascript
import { useScroll, useTransform, motion } from 'framer-motion';

function ParallaxSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <motion.div style={{ y }}>
      <img src="background.jpg" alt="Background" />
    </motion.div>
  );
}
```

### Advanced Parallax (Multi-layer)

```javascript
function MultiLayerParallax() {
  const { scrollYProgress } = useScroll();

  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const yMiddle = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yForeground = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <div className="parallax-container">
      <motion.div style={{ y: yBackground }} className="layer-background" />
      <motion.div style={{ y: yMiddle }} className="layer-middle" />
      <motion.div style={{ y: yForeground }} className="layer-foreground" />
    </div>
  );
}
```

### Scroll Progress Indicator

```javascript
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="progress-bar"
    />
  );
}

// CSS
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #dc2626, #f59e0b);
  transform-origin: 0%;
}
```

---

## 3D Effects

### 3D Card Tilt (Mouse Follow)

```javascript
import { motion } from 'framer-motion';

function Card3D() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotateX(rotateX);
    setRotateY(rotateY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className="card-3d"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
    >
      <div className="card-content">Content</div>
    </motion.div>
  );
}
```

### CSS 3D Transforms

```css
.card-3d {
  transition: transform 0.3s ease;
  transform-style: preserve-3d;
}

.card-3d:hover {
  transform: rotateY(10deg) rotateX(10deg) translateZ(20px);
}

.card-3d::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.card-3d:hover::before {
  opacity: 1;
}
```

---

## Typography Animations

### Typewriter Effect

```javascript
import { motion } from 'framer-motion';

function Typewriter({ text }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, ease: "linear" }}
      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
    >
      {text}
    </motion.div>
  );
}
```

### Split Text Reveal

```javascript
function SplitTextReveal({ text }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.h1 variants={container} initial="hidden" animate="visible">
      {words.map((word, i) => (
        <motion.span key={i} variants={child} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}
```

### Gradient Text Animation

```css
.gradient-text {
  background: linear-gradient(
    90deg,
    #dc2626,
    #f59e0b,
    #10b981,
    #3b82f6,
    #dc2626
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s linear infinite;
}

@keyframes gradientShift {
  to { background-position: 200% center; }
}
```

### Kinetic Typography

```javascript
function KineticText() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.h2 style={{ x }} className="kinetic-text">
      YOUR FAVORITE MEALS
    </motion.h2>
  );
}
```

---

## Background Animations

### Animated Gradient

```css
.animated-gradient {
  background: linear-gradient(
    -45deg,
    #ff6b35,
    #dc2626,
    #f59e0b,
    #fb923c
  );
  background-size: 400% 400%;
  animation: gradientFlow 15s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Floating Elements

```javascript
function FloatingElement({ children }) {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
```

### Moving Pattern Background

```css
.pattern-bg {
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px);
  animation: patternMove 20s linear infinite;
}

@keyframes patternMove {
  0% { background-position: 0 0; }
  100% { background-position: 70px 70px; }
}
```

---

## Loading Animations

### Skeleton Screen

```javascript
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );
}

// CSS
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Spinner Variations

```css
/* Modern Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #dc2626;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dots Loader */
.dots-loader {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  background: #dc2626;
  border-radius: 50%;
  animation: dotBounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

---

## Cursor Effects

### Custom Cursor Follow

```javascript
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <motion.div
      className="custom-cursor"
      animate={{ x: position.x - 10, y: position.y - 10 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
    />
  );
}

// CSS
.custom-cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}
```

### Magnetic Button

```javascript
function MagneticButton({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}
```

---

## Performance Best Practices

### 1. Use CSS Transitions for Simple Effects
```css
/* Good - GPU accelerated */
.element {
  transition: transform 0.3s, opacity 0.3s;
}

/* Avoid - causes repaints */
.element {
  transition: width 0.3s, height 0.3s, top 0.3s;
}
```

### 2. Reduce Motion Media Query
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Intersection Observer for Scroll Animations
```javascript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
```

---

## Complete Animation Configuration

### Framer Motion Variants Library

```javascript
export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 60 }
  },

  // Scale animations
  scaleIn: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  },

  // Slide animations
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 }
  },

  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 }
  },

  // Stagger container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }
};
```

---

This animation library provides all the building blocks needed to create engaging, modern landing pages. Mix and match these effects to create unique user experiences!
