import { useEffect, useRef, useState, useCallback } from 'react';
import { regularDesserts, seasonalDesserts } from '../../data/desserts';
import type { DessertItem } from '../../types/dessert';
import './MenuDrawer.css';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function MenuDrawer({ isOpen, onClose, triggerRef }: MenuDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [hoveredDessert, setHoveredDessert] = useState<DessertItem | null>(null);

  // Focus management and keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lock body scrolling while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Return focus to triggering button when drawer closes
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      triggerRef?.current?.focus();
    }, 50);
  }, [onClose, triggerRef]);

  const handleOrderAtCounter = () => {
    handleClose();
    // Smooth scroll to footer visit section
    setTimeout(() => {
      const visitEl = document.getElementById('visit');
      if (visitEl) {
        visitEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div
      className={`counter-drawer-overlay ${isOpen ? 'is-active' : ''}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className="counter-drawer-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu Panel */}
      <div
        ref={drawerRef}
        id="counter-menu-drawer"
        className="counter-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="counter-drawer-heading"
      >
        {/* Sticky Drawer Header */}
        <header className="counter-drawer-header">
          <div className="header-meta-group">
            <span className="drawer-eyebrow">SOFT HOUR / DESSERT ATELIER</span>
            <h2 id="counter-drawer-heading" className="drawer-main-title">
              THE COUNTER
            </h2>
            <p className="drawer-subtitle">
              Regular repertoire &amp; seasonal specialties
            </p>
          </div>

          <div className="header-action-group">
            {/* Desktop Editorial Hover Preview Frame */}
            {hoveredDessert && (
              <div className="drawer-hover-preview-frame" aria-hidden="true">
                <img
                  src={hoveredDessert.image}
                  alt=""
                  className="drawer-preview-img"
                  loading="eager"
                />
                <span className="drawer-preview-tag">{hoveredDessert.number}</span>
              </div>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              className="drawer-close-btn"
              onClick={handleClose}
              aria-label="Close menu drawer"
            >
              <span className="close-text">CLOSE</span>
              <span className="close-symbol" aria-hidden="true">×</span>
            </button>
          </div>
        </header>

        {/* Scrollable Drawer Content */}
        <div className="counter-drawer-content">
          {/* Section 1: Regular Repertoire */}
          <section className="drawer-menu-section regular-group" aria-label="Regular Repertoire">
            <div className="drawer-section-heading-row">
              <span className="drawer-section-num">[ CATALOGUE 01 — 08 ]</span>
              <h3 className="drawer-section-title">REGULAR</h3>
              <span className="drawer-section-sub">PERMANENT ATELIER BATCH</span>
            </div>

            <div className="drawer-items-list" role="list">
              {regularDesserts.map((item) => (
                <article
                  key={item.id}
                  className="drawer-menu-item regular-item"
                  role="listitem"
                  onMouseEnter={() => setHoveredDessert(item)}
                  onMouseLeave={() => setHoveredDessert(null)}
                >
                  <div className="item-primary-line">
                    <span className="item-number">{item.number}</span>
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-dotted-leader" aria-hidden="true" />
                    <span className="item-price">{item.price}</span>
                  </div>
                  <p className="item-flavor-notes">{item.flavorNotes}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Section 2: Seasonal Harvest */}
          <section className="drawer-menu-section seasonal-group" aria-label="Seasonal Specialties">
            <div className="drawer-section-heading-row">
              <span className="drawer-section-num seasonal-accent">[ EDITION 09 — 12 ]</span>
              <h3 className="drawer-section-title seasonal-accent">SEASONAL</h3>
              <span className="drawer-section-sub seasonal-accent">SUMMER HARVEST // EPHEMERAL</span>
            </div>

            <div className="drawer-items-list" role="list">
              {seasonalDesserts.map((item) => (
                <article
                  key={item.id}
                  className="drawer-menu-item seasonal-item"
                  role="listitem"
                  onMouseEnter={() => setHoveredDessert(item)}
                  onMouseLeave={() => setHoveredDessert(null)}
                >
                  <div className="item-primary-line">
                    <span className="item-number seasonal-num">{item.number}</span>
                    <h4 className="item-name seasonal-name">{item.name}</h4>
                    <span className="item-dotted-leader seasonal-leader" aria-hidden="true" />
                    <span className="item-price seasonal-price">{item.price}</span>
                  </div>
                  <p className="item-flavor-notes seasonal-notes">{item.flavorNotes}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Drawer Editorial Footer */}
          <footer className="counter-drawer-footer">
            <div className="drawer-footer-poetics">
              <span className="footer-lead-text">Made this morning.</span>
              <span className="footer-sub-text">Fresh batch dispenses at 11:00 AM daily until sold out.</span>
            </div>

            <button
              type="button"
              className="drawer-order-action-btn"
              onClick={handleOrderAtCounter}
            >
              ORDER AT THE COUNTER <span className="arrow" aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
