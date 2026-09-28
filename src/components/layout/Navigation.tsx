import { useState, useEffect } from 'react';
import './Navigation.css';

interface NavigationProps {
  onOpenMenuDrawer?: () => void;
  isMenuDrawerOpen?: boolean;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function Navigation({
  onOpenMenuDrawer,
  isMenuDrawerOpen = false,
  menuButtonRef,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll offset to transition from hero-integrated transparent state
  // to calm editorial sticky reading state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 44);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : 'is-hero-top'}`}
      role="banner"
    >
      <div className="container nav-container">
        {/* LEFT: Authoritative Editorial Wordmark */}
        <a href="#" className="nav-brand" aria-label="SOFT HOUR — Dessert Atelier">
          <span className="nav-brand-title">SOFT HOUR</span>
          <span className="nav-brand-subtitle">DESSERT ATELIER</span>
        </a>

        {/* CENTER: Editorial Navigation Hierarchy */}
        <nav className="nav-links-desktop" aria-label="Primary navigation">
          <a href="#seasonal" className="nav-link">
            <span className="nav-link-label">SEASONAL</span>
          </a>
          <a href="#craft" className="nav-link">
            <span className="nav-link-label">KITCHEN</span>
          </a>
          <a href="#visit" className="nav-link">
            <span className="nav-link-label">VISIT</span>
          </a>
        </nav>

        {/* RIGHT: Deliberate Commercial & Catalogue Cluster (ORDER → MENU +) */}
        <div className="nav-right-cluster">
          <a href="#visit" className="nav-action-order" aria-label="Order for pickup">
            <span className="order-text">ORDER</span>
            <span className="order-arrow" aria-hidden="true">→</span>
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            className={`nav-action-menu ${isMenuDrawerOpen ? 'is-active' : ''}`}
            onClick={onOpenMenuDrawer}
            aria-expanded={isMenuDrawerOpen}
            aria-controls="counter-menu-drawer"
            aria-label={isMenuDrawerOpen ? 'Close dessert counter drawer' : 'Open dessert counter drawer'}
          >
            <span className="menu-text">MENU</span>
            <span className="menu-toggle-glyph" aria-hidden="true">
              {isMenuDrawerOpen ? '×' : '+'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
