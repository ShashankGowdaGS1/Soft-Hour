import { useEffect, useRef, useState } from 'react';
import './CollectionSelector.css';
import { regularDesserts, seasonalDesserts } from '../../data/desserts';
import EditorialImageSlider, { type EditorialSlideItem } from '../../components/media/EditorialImageSlider';

const regularSliderItems: EditorialSlideItem[] = regularDesserts.map((item) => ({
  id: item.id,
  image: item.image,
  name: item.name,
  alt: `Soft Hour Regular Repertoire — ${item.number} ${item.name}`,
  number: item.number,
  badge: `BATCH REF. ${item.number}`,
}));

const seasonalSliderItems: EditorialSlideItem[] = seasonalDesserts.map((item, idx) => ({
  id: item.id,
  image: item.image,
  name: item.name,
  alt: `Soft Hour Seasonal Harvest — ${item.number} ${item.name}`,
  number: (idx + 1).toString().padStart(2, '0'),
  badge: `SUMMER // ED. ${item.number}`,
}));

export default function CollectionSelector() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // IntersectionObserver for entrance reveal
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

    // RAF scroll listener for continuous parallax kinematics
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > -120 && rect.top < windowHeight + 120) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offsetPx = elementCenter - viewportCenter;

        el.style.setProperty('--craving-offset', `${offsetPx.toFixed(1)}px`);
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
      className={`craving-section ${isInView ? 'is-in-view' : ''}`}
      aria-label="Choose Your Craving"
    >
      <div className="craving-container">
        {/* Regular World - Rich, Grounded Cacao & Pastry */}
        <a href="#regular" className="craving-zone craving-zone-regular">
          <div className="craving-world-header">
            <div className="craving-tag-row">
              <span className="editorial-num">[ 01 ]</span>
              <span className="recipe-note">PERMANENT REPERTOIRE</span>
            </div>
            <h3 className="craving-title">
              REGULAR
            </h3>
            <p className="craving-flavor-notes">
              Cacao 70% · Slow-caramelized butter · Espresso bean · Flaky fleur de sel
            </p>
          </div>

          <div className="craving-regular-media-wrap">
            <EditorialImageSlider
              items={regularSliderItems}
              interval={4600}
              initialDelay={0}
              direction="to-right"
              theme="regular"
              showBadge={true}
              ariaLabel="Regular repertoire collection preview"
            />
          </div>

          <div className="craving-footer-action">
            <span className="craving-cta-text">
              ENTER PERMANENT COUNTER <span className="arrow" aria-hidden="true">→</span>
            </span>
            <span className="editorial-num">08 PIECES</span>
          </div>
        </a>

        {/* Subtle Architectural Center Marker */}
        <div className="craving-divider-marker" aria-hidden="true">
          <span>PERMANENT / SEASONAL</span>
        </div>

        {/* Seasonal World - Sunlit, Ephemeral Mango & Saffron */}
        <a href="#seasonal" className="craving-zone craving-zone-seasonal">
          <div className="seasonal-seal" aria-hidden="true">
            <span className="seal-text">SUMMER · 04</span>
          </div>

          <div className="craving-world-header">
            <div className="craving-tag-row">
              <span className="seasonal-dot-indicator" />
              <span className="recipe-note seasonal-note">EPHEMERAL HARVEST</span>
            </div>
            <h3 className="craving-title seasonal-title-text">
              SEASONAL
            </h3>
            <p className="craving-flavor-notes seasonal-flavor-text">
              Ratnagiri Alphonso · Kashmiri saffron · Damask rose water · Coastal coconut
            </p>
          </div>

          <div className="craving-seasonal-media-wrap">
            <EditorialImageSlider
              items={seasonalSliderItems}
              interval={4600}
              initialDelay={2300}
              direction="to-left"
              theme="seasonal"
              showBadge={true}
              ariaLabel="Seasonal harvest collection preview"
            />
          </div>

          <div className="craving-footer-action">
            <span className="craving-cta-text seasonal-cta-text">
              EXPLORE SUMMER SPECIALTIES <span className="arrow" aria-hidden="true">→</span>
            </span>
            <span className="editorial-num seasonal-num">04 EDITIONS</span>
          </div>
        </a>
      </div>
    </section>
  );
}
