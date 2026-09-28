import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

export default function CustomCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Check if device supports fine hover pointer (disable on touchscreen/mobile)
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    const rootEl = rootRef.current;
    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    const labelEl = labelRef.current;

    if (!rootEl || !dotEl || !ringEl || !labelEl) return;

    // Enable custom cursor class on body
    document.body.classList.add('has-custom-cursor');

    // Create GSAP quickTo setters for instant 120fps hardware-accelerated tracking
    const xToDot = gsap.quickTo(dotEl, 'x', { duration: 0.05, ease: 'power3' });
    const yToDot = gsap.quickTo(dotEl, 'y', { duration: 0.05, ease: 'power3' });
    const xToRing = gsap.quickTo(ringEl, 'x', { duration: 0.32, ease: 'power2.out' });
    const yToRing = gsap.quickTo(ringEl, 'y', { duration: 0.32, ease: 'power2.out' });

    let isVisible = false;
    let isPressed = false;
    let currentMode: 'default' | 'hover' | 'badge' | 'text-input' = 'default';
    let currentLabel = '';
    let currentBaseScale = 1;

    let lastX = 0;
    let lastY = 0;
    let relaxTimer: number | null = null;
    let magneticPull = { x: 0, y: 0 };

    // Update cursor scale and visual classes according to mode
    const applyMode = (mode: 'default' | 'hover' | 'badge' | 'text-input', labelText = '') => {
      if (currentMode === mode && currentLabel === labelText) return;

      currentMode = mode;
      currentLabel = labelText;

      ringEl.classList.remove('is-hovering', 'has-label', 'is-text-input');
      dotEl.classList.remove('is-text-input');

      if (mode === 'text-input') {
        ringEl.classList.add('is-text-input');
        dotEl.classList.add('is-text-input');
        currentBaseScale = 0.2;
        gsap.to(ringEl, {
          scale: 0.2,
          opacity: 0,
          duration: 0.2,
          overwrite: 'auto',
        });
        gsap.to(dotEl, {
          scale: 0.2,
          opacity: 0,
          duration: 0.2,
          overwrite: 'auto',
        });
        gsap.to(labelEl, {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          overwrite: 'auto',
        });
        return;
      }

      if (mode === 'badge') {
        ringEl.classList.add('has-label');
        currentBaseScale = 2.25;
        labelEl.textContent = labelText;

        gsap.to(ringEl, {
          scale: isPressed ? currentBaseScale * 0.86 : currentBaseScale,
          opacity: 1,
          duration: 0.35,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(dotEl, {
          opacity: 0,
          scale: 0.2,
          duration: 0.2,
          overwrite: 'auto',
        });
        gsap.to(labelEl, {
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        return;
      }

      // Hide label if leaving badge mode
      gsap.to(labelEl, {
        opacity: 0,
        scale: 0.6,
        duration: 0.18,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      if (mode === 'hover') {
        ringEl.classList.add('is-hovering');
        currentBaseScale = 1.55;

        gsap.to(ringEl, {
          scale: isPressed ? currentBaseScale * 0.86 : currentBaseScale,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        gsap.to(dotEl, {
          opacity: 1,
          scale: 0.65,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        return;
      }

      // Default mode
      currentBaseScale = 1;
      gsap.to(ringEl, {
        scale: isPressed ? 0.84 : 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(dotEl, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Inspect hovered element to decide cursor context
    const inspectTarget = (target: Element | null, mouseX: number, mouseY: number) => {
      if (!target) {
        magneticPull = { x: 0, y: 0 };
        applyMode('default');
        return;
      }

      // 1. Text input / textarea
      const textInput = target.closest('input, textarea, [contenteditable="true"]');
      if (textInput) {
        magneticPull = { x: 0, y: 0 };
        applyMode('text-input');
        return;
      }

      // 2. Explicit custom cursor label attribute
      const labelElFound = target.closest('[data-cursor], [data-cursor-text]');
      if (labelElFound) {
        const text =
          labelElFound.getAttribute('data-cursor-text') ||
          labelElFound.getAttribute('data-cursor') ||
          '';
        if (text) {
          magneticPull = { x: 0, y: 0 };
          applyMode('badge', text.toUpperCase());
          return;
        }
      }

      // 3. Auto-detected media and editorial card surfaces
      if (target.closest('.seasonal-runway-media, .seasonal-video-btn, .regular-canvas-frame')) {
        magneticPull = { x: 0, y: 0 };
        applyMode('badge', 'FILM');
        return;
      }

      if (target.closest('.craft-photo-card, .craft-mosaic-img, .act-media-wrapper')) {
        magneticPull = { x: 0, y: 0 };
        applyMode('badge', 'ARCHIVE');
        return;
      }

      if (target.closest('.hero-visual-frame')) {
        magneticPull = { x: 0, y: 0 };
        applyMode('badge', 'TASTE');
        return;
      }

      if (target.closest('.regular-art-frame, .regular-dessert-visual')) {
        magneticPull = { x: 0, y: 0 };
        applyMode('badge', 'EXPLORE');
        return;
      }

      if (target.closest('.living-modal-close, .menu-drawer-close, .modal-backdrop')) {
        magneticPull = { x: 0, y: 0 };
        applyMode('badge', 'CLOSE');
        return;
      }

      // 4. Interactive elements (links, buttons, pills, tags, rows)
      const interactive = target.closest(
        'a, button, [role="button"], .editorial-link, .tag-item, .tab-btn, .counter-action-link, .provenance-row, [data-cursor-interactive]'
      );

      if (interactive instanceof HTMLElement) {
        // Subtle magnetic pull for compact buttons / icons (< 220px)
        const rect = interactive.getBoundingClientRect();
        if (rect.width > 0 && rect.width < 220 && rect.height < 100) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          magneticPull = {
            x: (centerX - mouseX) * 0.22,
            y: (centerY - mouseY) * 0.22,
          };
        } else {
          magneticPull = { x: 0, y: 0 };
        }
        applyMode('hover');
        return;
      }

      // 5. Default background / text
      magneticPull = { x: 0, y: 0 };
      applyMode('default');
    };

    // Pointer move listener
    const handlePointerMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        rootEl.classList.add('is-visible');
        gsap.set([dotEl, ringEl], { x: mouseX, y: mouseY });
        lastX = mouseX;
        lastY = mouseY;
      }

      // Instantaneous dot positioning
      xToDot(mouseX);
      yToDot(mouseY);

      // Check target hierarchy
      inspectTarget(e.target as Element, mouseX, mouseY);

      // Ring target coordinates (with magnetic offset if active)
      const targetRingX = mouseX + magneticPull.x;
      const targetRingY = mouseY + magneticPull.y;
      xToRing(targetRingX);
      yToRing(targetRingY);

      // Subtle velocity squash & stretch when moving through space
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.hypot(dx, dy);

      if (currentMode === 'default' && speed > 5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = Math.min(speed * 0.007, 0.24);

        gsap.to(ringEl, {
          scaleX: currentBaseScale * (1 + stretch),
          scaleY: currentBaseScale * (1 - stretch * 0.45),
          rotation: angle,
          duration: 0.12,
          ease: 'power1.out',
          overwrite: 'auto',
        });

        if (relaxTimer) clearTimeout(relaxTimer);
        relaxTimer = window.setTimeout(() => {
          gsap.to(ringEl, {
            scaleX: currentBaseScale,
            scaleY: currentBaseScale,
            rotation: 0,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }, 60);
      }

      lastX = mouseX;
      lastY = mouseY;
    };

    // Mouse press (snappy tactile compression)
    const handleMouseDown = () => {
      isPressed = true;
      if (currentMode !== 'text-input') {
        gsap.to(ringEl, {
          scale: currentBaseScale * 0.84,
          duration: 0.12,
          ease: 'power2.in',
          overwrite: 'auto',
        });
        gsap.to(dotEl, {
          scale: 1.35,
          duration: 0.12,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseUp = () => {
      isPressed = false;
      if (currentMode !== 'text-input') {
        gsap.to(ringEl, {
          scale: currentBaseScale,
          duration: 0.32,
          ease: 'back.out(2)',
          overwrite: 'auto',
        });
        gsap.to(dotEl, {
          scale: currentMode === 'hover' ? 0.65 : 1,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    // Window boundaries: fade out smoothly when pointer leaves window
    const handleMouseLeave = () => {
      isVisible = false;
      rootEl.classList.remove('is-visible');
      gsap.to([dotEl, ringEl], {
        opacity: 0,
        scale: 0.2,
        duration: 0.24,
        ease: 'power2.in',
      });
    };

    const handleMouseEnter = () => {
      isVisible = true;
      rootEl.classList.add('is-visible');
      gsap.to([dotEl, ringEl], {
        opacity: 1,
        scale: 1,
        duration: 0.26,
        ease: 'power2.out',
      });
    };

    // Re-inspect target when page scrolls under a stationary mouse
    let scrollRaf: number | null = null;
    const handleScroll = () => {
      if (!isVisible || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        if (lastX > 0 && lastY > 0) {
          const hoveredElement = document.elementFromPoint(lastX, lastY);
          inspectTarget(hoveredElement, lastX, lastY);
        }
      });
    };

    // Attach listeners
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      if (relaxTimer) clearTimeout(relaxTimer);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, []);

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
      }}
      className="custom-cursor-root"
      aria-hidden="true"
    >
      {/* Central Microscopic Precision Dot */}
      <div
        ref={(el) => {
          dotRef.current = el;
        }}
        className="custom-cursor-dot"
      />

      {/* Fluid Trailing Outer Ring with Contextual Typography */}
      <div
        ref={(el) => {
          ringRef.current = el;
        }}
        className="custom-cursor-ring"
      >
        <span
          ref={(el) => {
            labelRef.current = el;
          }}
          className="custom-cursor-label"
        />
      </div>
    </div>
  );
}
