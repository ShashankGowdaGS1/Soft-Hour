import { useEffect, useRef, useState } from 'react';
import './TasteManifesto.css';

export default function TasteManifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // IntersectionObserver for entrance reveal trigger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    // High performance RAF scroll listener for continuous scroll parallax kinematics
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when near or in viewport
      if (rect.bottom > -120 && rect.top < windowHeight + 120) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offsetPx = elementCenter - viewportCenter;

        const totalDistance = windowHeight + rect.height;
        const currentDistance = windowHeight - rect.top;
        const progress = Math.min(1, Math.max(0, currentDistance / totalDistance));

        el.style.setProperty('--manifesto-offset', `${offsetPx.toFixed(1)}px`);
        el.style.setProperty('--manifesto-progress', `${progress.toFixed(3)}`);
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`manifesto-section ${isInView ? 'is-in-view' : ''}`}
      aria-label="Atelier Principle & Philosophy"
    >
      <div className="container manifesto-container">
        {/* Top Ledger Header */}
        <div className="manifesto-top-meta" aria-hidden="true">
          <span className="editorial-num">[ PHILOSOPHICAL FORMULATION // DOC. 01 ]</span>
          <span className="recipe-note">UNHURRIED HANDCRAFT · ZERO OVERNIGHT RETENTION</span>
        </div>

        {/* Central Monumental Statement */}
        <div className="manifesto-statement-pod">
          <span className="manifesto-seal-mark" aria-hidden="true">ATELIER CORE</span>

          <h2 className="manifesto-statement">
            <span className="statement-part-slow">Made slowly.</span>
            <span className="statement-part-fast">
              <span className="statement-dash" aria-hidden="true">—</span>
              <em>Gone quickly.</em>
            </span>
          </h2>

          <p className="manifesto-elaboration">
            What requires twelve hours of resting, emulsification, and thermal tempering disappears in quiet seconds at the table. We design exclusively for that fleeting moment.
          </p>
        </div>

        {/* Balanced Three-Column Principle Triptych */}
        <div className="manifesto-triptych">
          <div className="triptych-pillar pillar-1">
            <div className="pillar-header">
              <span className="pillar-roman">I.</span>
              <h3 className="pillar-title">BAKED TODAY</h3>
            </div>
            <p className="pillar-body">
              Zero pastry inventory carried overnight. What is baked at dawn is cleared before dusk.
            </p>
            <span className="pillar-foot">[ REFRESHED DAILY ]</span>
          </div>

          <div className="triptych-pillar pillar-2">
            <div className="pillar-header">
              <span className="pillar-roman">II.</span>
              <h3 className="pillar-title">FINISHED BY HAND</h3>
            </div>
            <p className="pillar-body">
              Every mirror glaze poured, choux filled, and garnish placed individually to order.
            </p>
            <span className="pillar-foot">[ A LA MINUTE ]</span>
          </div>

          <div className="triptych-pillar pillar-3">
            <div className="pillar-header">
              <span className="pillar-roman">III.</span>
              <h3 className="pillar-title">SERVED AT TEMPER</h3>
            </div>
            <p className="pillar-body">
              Calibrated to precise thermal windows: 16–18°C for velvet mousse, room ambient for crisp sablés.
            </p>
            <span className="pillar-foot">[ THERMAL WINDOW ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
