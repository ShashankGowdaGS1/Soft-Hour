import { useState, useRef, useEffect } from 'react';
import { seasonalDesserts } from '../../data/desserts';
import { currentSeason } from '../../data/seasons';
import type { DessertItem } from '../../types/dessert';
import './SeasonalCollection.css';

interface SeasonalCollectionProps {
  onSelectVideo?: (dessert: DessertItem) => void;
}

interface SeasonalRunwayItemProps {
  dessert: DessertItem;
  layoutClass: string;
  categoryTag: string;
  imageRadius?: string;
  aspectRatio?: string;
}

function SeasonalRunwayItem({
  dessert,
  layoutClass,
  categoryTag,
  imageRadius = '0',
  aspectRatio = '16 / 10',
}: SeasonalRunwayItemProps) {
  const itemRef = useRef<HTMLElement | null>(null);
  const [isItemInView, setIsItemInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Individual item intersection observer for staggered scroll entrance
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsItemInView(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const startVideo = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(true);
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsPlaying(false);
          setIsVideoReady(false);
        });
      }
    }
  };

  const stopVideo = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsPlaying(false);
    leaveTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoReady(false);
    }, 280);
  };

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      startVideo();
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      stopVideo();
    }
  };

  const handleMobileToggle = () => {
    if (isPlaying) {
      stopVideo();
    } else {
      startVideo();
    }
  };

  return (
    <article
      ref={itemRef}
      className={`seasonal-runway-item ${layoutClass} ${isItemInView ? 'is-in-view' : ''}`}
    >
      {/* Editorial Media Canvas */}
      <div
        className="seasonal-runway-media"
        style={{ borderRadius: imageRadius, aspectRatio }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMobileToggle}
        tabIndex={0}
        role="region"
        aria-label={`${dessert.name} — hover to play film`}
      >
        <img
          src={dessert.image}
          alt={dessert.name}
          className="seasonal-runway-photo"
          loading="lazy"
        />

        <video
          ref={videoRef}
          src={dessert.video}
          muted
          playsInline
          loop
          preload="none"
          className={`seasonal-runway-video ${isPlaying && isVideoReady ? 'is-visible' : ''}`}
          onCanPlay={() => {
            if (isPlaying) setIsVideoReady(true);
          }}
          onPlaying={() => setIsVideoReady(true)}
          onError={() => {
            setIsPlaying(false);
            setIsVideoReady(false);
          }}
        />

        {/* Minimal inline film badge */}
        <div className="seasonal-runway-badge" aria-hidden="true">
          <span className={`runway-dot ${isPlaying ? 'is-pulsing' : ''}`} />
          <span>{isPlaying ? 'PLAYING · 08 SEC' : 'FILM · 08 SEC'}</span>
        </div>
      </div>

      {/* Product Copy OUTSIDE the image */}
      <div className="seasonal-runway-copy">
        <div className="runway-tag-row">
          <span className="runway-index">NO. {dessert.number} // {categoryTag}</span>
        </div>
        <div className="runway-title-row">
          <h3 className="runway-name">{dessert.name}</h3>
          <span className="runway-price">{dessert.price}</span>
        </div>
        <p className="runway-flavors">{dessert.flavorNotes}</p>
        <p className="runway-desc">{dessert.description}</p>
      </div>
    </article>
  );
}

export default function SeasonalCollection({ onSelectVideo: _onSelectVideo }: SeasonalCollectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const d09 = seasonalDesserts[0];
  const d10 = seasonalDesserts[1];
  const d11 = seasonalDesserts[2];
  const d12 = seasonalDesserts[3];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0, rootMargin: '250px 0px 0px 0px' }
    );

    observer.observe(el);

    let rafId: number | null = null;
    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > -200 && rect.top < windowHeight + 200) {
        // Measure navbar height to calibrate resting baseline exactly when header reaches reading position
        const nav = document.querySelector('.site-header');
        const navHeight = nav ? nav.getBoundingClientRect().height : 88;
        // When top of section meets bottom of navbar, offset is precisely 0 (timely alignment)
        const offsetPx = rect.top - navHeight;

        el.style.setProperty('--seasonal-scroll-offset', `${offsetPx.toFixed(1)}px`);

        // Mobile scroll image parallax for runway cards
        const cardMedias = el.querySelectorAll<HTMLElement>('.seasonal-runway-media');
        cardMedias.forEach((card) => {
          const cRect = card.getBoundingClientRect();
          if (cRect.bottom > -80 && cRect.top < windowHeight + 80) {
            const cCenter = cRect.top + cRect.height / 2;
            const prog = (cCenter - windowHeight / 2) / (windowHeight / 2);
            const parallaxY = prog * -22;
            card.style.setProperty('--card-img-parallax', `${parallaxY.toFixed(1)}px`);
          }
        });
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
      id="seasonal"
      ref={sectionRef}
      className={`seasonal-section ${isInView ? 'is-in-view' : ''}`}
      aria-label="Seasonal Specialties"
    >
      {/* Background Ghost Typographic Watermark with Parallax Drift */}
      <div className="seasonal-watermark" aria-hidden="true">
        <span>ALPHONSO</span>
      </div>

      <div className="container seasonal-container">
        {/* Expressive Editorial Header */}
        <div className="seasonal-header">
          <div className="seasonal-meta-pill">
            <span className="seasonal-harvest-dot" />
            <span className="editorial-num">[ SUMMER ISSUE 04 ]</span>
            <span className="seasonal-harvest-sep">/</span>
            <span className="recipe-note seasonal-harvest-title">RATNAGIRI &amp; KASHMIR HARVEST</span>
          </div>

          <div className="seasonal-title-wrap">
            <h2 className="seasonal-title">
              <span className="title-row-1">SEASON</span>
              <span className="title-row-2">CHANGES</span>
              <span className="title-row-3">
                <span className="seasonal-leaf" aria-hidden="true">❦</span>
                <em>EVERYTHING.</em>
              </span>
            </h2>

            <div className="seasonal-prologue">
              <p className="seasonal-lead">
                {currentSeason.statement}
              </p>
              <div className="seasonal-batch-tag">
                <span className="tag-pulse" />
                <span>LIMITED RUN: 24 PIECES / SERVICE · CLOSES AT MONSOONS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Seasonal Runway: Asymmetric Staggered Spreads */}
        <div className="seasonal-runway-track">
          {/* Row 1: Large Landscape 09 (58-62vw) + Staggered Narrow Portrait 10 (28-32vw) */}
          <div className="runway-spread runway-spread-one">
            <SeasonalRunwayItem
              dessert={d09}
              layoutClass="runway-item-alpha"
              categoryTag="PROPRIETARY"
              imageRadius="0 0 88px 0"
              aspectRatio="16 / 10.5"
            />
            <SeasonalRunwayItem
              dessert={d10}
              layoutClass="runway-item-beta"
              categoryTag="INFUSION"
              imageRadius="96px 0 0 0"
              aspectRatio="3 / 4.4"
            />
          </div>

          {/* Row 2: Medium Portrait 11 (34-38vw) + Wide Landscape 12 (48-54vw) */}
          <div className="runway-spread runway-spread-two">
            <SeasonalRunwayItem
              dessert={d11}
              layoutClass="runway-item-gamma"
              categoryTag="BOTANICAL"
              imageRadius="0"
              aspectRatio="4 / 4.6"
            />
            <SeasonalRunwayItem
              dessert={d12}
              layoutClass="runway-item-delta"
              categoryTag="COASTAL"
              imageRadius="0 88px 0 0"
              aspectRatio="16 / 10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
