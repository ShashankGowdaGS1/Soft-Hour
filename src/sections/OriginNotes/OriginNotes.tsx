import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import cacaoImg from '../../assets/images/ingredients/01-single-estate-cacao.jpg';
import saffronImg from '../../assets/images/ingredients/02-kashmiri-saffron.jpg';
import alphonsoImg from '../../assets/images/ingredients/03-ratnagiri-alphonso.jpg';
import './OriginNotes.css';

gsap.registerPlugin(ScrollTrigger);

interface IngredientEntry {
  number: string;
  name: string;
  source: string;
  note: string;
}

const INGREDIENTS: IngredientEntry[] = [
  {
    number: '01',
    name: '70% CACAO',
    source: 'Single-Estate Cacao',
    note: 'Fermented in wooden boxes, sun-dried, roasted at low temperatures for deep bittersweet velvet.',
  },
  {
    number: '02',
    name: 'ALPHONSO',
    source: 'Ratnagiri Alphonso',
    note: 'Coastal summer harvest, tree-ripened, hand-pressed into pure unfiltered fruit nectar.',
  },
  {
    number: '03',
    name: 'SAFFRON',
    source: 'Kashmiri Saffron',
    note: 'Mongra grade crimson stigmas, hand-separated, slow warm milk infusion for golden fragrance.',
  },
  {
    number: '04',
    name: 'DAMASK ROSE',
    source: 'Damask Rose Water',
    note: 'Organic steam-distilled petaline hydrosol captured from dawn harvest before morning sun.',
  },
  {
    number: '05',
    name: 'TENDER COCONUT',
    source: 'Coastal Tender Coconut',
    note: 'Fresh coastal water and tender malai cream, cold-extracted moments before service.',
  },
];

export default function OriginNotes() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const headerMetaRef = useRef<HTMLDivElement | null>(null);
  const topRuleRef = useRef<HTMLDivElement | null>(null);
  const tableHeaderRef = useRef<HTMLDivElement | null>(null);
  const counterNumRef = useRef<HTMLSpanElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentIdxRef = useRef<number>(1);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Observe each sub-block for creative staggered entry
    const revealTargets = el.querySelectorAll('.origin-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealTargets.forEach((target) => observer.observe(target));

    // Passive RAF scroll listener for continuous multi-plane parallax on photos & watermark
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

        el.style.setProperty('--origin-scroll-offset', `${offsetPx.toFixed(1)}px`);
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

    // GSAP ScrollTrigger Context for Provenance Register
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Pinned Sequential Row Activation
      mm.add('(min-width: 769px)', () => {
        const stage = stageRef.current;
        const inner = innerRef.current;
        const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
        if (!stage || !inner || rows.length !== 5) return;

        const nav = document.querySelector('.site-header');
        const navHeight = nav ? nav.getBoundingClientRect().height : 88;

        // 1. Archival Section Entry Animation (triggers once as section scrolls into view)
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            if (headerMetaRef.current) {
              gsap.fromTo(
                headerMetaRef.current,
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
              );
            }
            if (topRuleRef.current) {
              gsap.fromTo(
                topRuleRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 1.0, ease: 'power2.out', transformOrigin: 'left' }
              );
            }
            if (tableHeaderRef.current) {
              const thCols = tableHeaderRef.current.querySelectorAll('.ledger-th-col');
              gsap.fromTo(
                thCols,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power2.out', delay: 0.15 }
              );
            }
          },
        });

        // 2. Sequential Provenance Pinning & Activation Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: () => `top top+=${navHeight + 20}`,
            end: () => `+=${window.innerHeight * 2.15}`,
            pin: inner,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              let idx = 1;
              if (p < 0.20) idx = 1;
              else if (p < 0.40) idx = 2;
              else if (p < 0.60) idx = 3;
              else if (p < 0.80) idx = 4;
              else idx = 5;

              if (counterNumRef.current && currentIdxRef.current !== idx) {
                currentIdxRef.current = idx;
                counterNumRef.current.textContent = `0${idx}`;
              }
            },
          },
        });

        const traceEls = rows.map((r) => r.querySelector('.provenance-trace-line') as HTMLElement);
        const accentEls = rows.map((r) => r.querySelector('.provenance-accent-line') as HTMLElement);
        const matEls = rows.map((r) => r.querySelector('.origin-material-col') as HTMLElement);
        const srcEls = rows.map((r) => r.querySelector('.origin-source-col') as HTMLElement);
        const noteEls = rows.map((r) => r.querySelector('.origin-note-col') as HTMLElement);

        // Initial state at t = 0 (Row 0 is active, rows 1-4 are upcoming)
        gsap.set(rows[0], { opacity: 1 });
        gsap.set(accentEls[0], { scaleY: 1, opacity: 1 });
        gsap.set([matEls[0], srcEls[0], noteEls[0]], { x: 0, opacity: 1 });
        gsap.set(matEls[0], { letterSpacing: '0em' });

        for (let j = 1; j < 5; j++) {
          gsap.set(rows[j], { opacity: 0.22 });
          gsap.set(accentEls[j], { scaleY: 0, opacity: 0 });
          gsap.set(matEls[j], { x: 18, opacity: 0.45, letterSpacing: '0.02em' });
          gsap.set(srcEls[j], { x: 12, opacity: 0.35 });
          gsap.set(noteEls[j], { x: 8, opacity: 0.30 });
          gsap.set(traceEls[j], { scaleX: 0, opacity: 0 });
        }

        // Sequential 5-Stage Transitions
        for (let i = 0; i < 4; i++) {
          const stageStart = i * 1.0;
          // Subtle origin trace horizontal line
          tl.fromTo(
            traceEls[i],
            { scaleX: 0, opacity: 0.8 },
            { scaleX: 1, opacity: 0.8, duration: 0.75, ease: 'none' },
            stageStart
          );

          const transStart = stageStart + 0.75;
          // Current active row dims to past (~0.30)
          tl.to(rows[i], { opacity: 0.30, duration: 0.3, ease: 'power2.out' }, transStart);
          tl.to(accentEls[i], { scaleY: 0.35, opacity: 0.25, duration: 0.3, ease: 'power2.out' }, transStart);
          tl.to(traceEls[i], { opacity: 0, duration: 0.2 }, transStart + 0.05);

          // Next row activates to opacity 1, accent draws in, text crisps & slides to 0
          const nextIdx = i + 1;
          tl.to(rows[nextIdx], { opacity: 1, duration: 0.3, ease: 'power2.out' }, transStart + 0.05);
          tl.fromTo(
            accentEls[nextIdx],
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 0.35, ease: 'power2.out' },
            transStart + 0.05
          );
          tl.to(
            matEls[nextIdx],
            { x: 0, opacity: 1, letterSpacing: '0em', duration: 0.35, ease: 'power2.out' },
            transStart + 0.05
          );
          tl.to(
            srcEls[nextIdx],
            { x: 0, opacity: 1, color: '#E2A346', duration: 0.35, ease: 'power2.out' },
            transStart + 0.05
          );
          tl.to(
            noteEls[nextIdx],
            { x: 0, opacity: 1, color: 'rgba(250, 248, 243, 0.95)', duration: 0.35, ease: 'power2.out' },
            transStart + 0.05
          );
        }

        // Final row (Tender Coconut) trace sweep
        tl.fromTo(
          traceEls[4],
          { scaleX: 0, opacity: 0.8 },
          { scaleX: 1, opacity: 0.8, duration: 0.65, ease: 'none' },
          4.0
        );

        // Section Exit: Hold briefly, then return all five rows to readable opacity (~0.88–1.0)
        tl.to(rows.slice(0, 4), { opacity: 0.88, duration: 0.35, ease: 'power2.out' }, 4.65);
        tl.to(rows[4], { opacity: 1.0, duration: 0.35, ease: 'power2.out' }, 4.65);
        tl.to(traceEls, { opacity: 0, duration: 0.2 }, 4.65);
        tl.to(accentEls, { scaleY: 0.5, opacity: 0.3, duration: 0.35 }, 4.65);
      });

      // Mobile (<= 768px): Normal vertical scroll reveals without pinning
      mm.add('(max-width: 768px)', () => {
        const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
        rows.forEach((row) => {
          gsap.fromTo(
            row,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: row,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      });

      // Reduced motion: Show full ledger statically
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(rows, { opacity: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="origin-notes"
      ref={sectionRef}
      className="origin-notes-section"
      aria-label="Origin Notes Material Register"
    >
      {/* Background Ghost Typographic Elements with Parallax Drift */}
      <div className="origin-watermark-cacao" aria-hidden="true">
        <span>70% CACAO</span>
      </div>

      <div className="container origin-container">
        {/* Section Header */}
        <header className="origin-header origin-reveal">
          <div className="origin-eyebrow-row">
            <span className="origin-eyebrow-tag">[ ORIGIN NOTES // MATERIAL REGISTER ]</span>
            <span className="origin-dot-sep" aria-hidden="true">·</span>
            <span className="origin-eyebrow-sub">RAW INGREDIENT PROVENANCE</span>
          </div>

          <div className="origin-header-grid">
            <h2 className="origin-title">
              <span className="origin-line-mask">
                <span className="origin-line-1">WHAT IT</span>
              </span>
              <span className="origin-line-mask">
                <span className="origin-line-2">STARTS WITH.</span>
              </span>
            </h2>

            <div className="origin-manifest-lead">
              <p className="origin-statement">
                We never mask. Every dessert is an unadorned expression of five raw materials,
                sourced in small allocations directly from coastal groves, highland estates, and morning harvests.
              </p>
            </div>
          </div>
        </header>

        {/* Asymmetrical Typographic & Photographic Editorial Spread */}
        <div className="origin-editorial-stage">
          {/* Top Row: Cacao Typography & Offset Macro Crop */}
          <div className="origin-zone-cacao origin-reveal">
            <div className="cacao-typography-block">
              <span className="cacao-display-lead">ESTATE HARVEST</span>
              <div className="cacao-display-mask">
                <span className="cacao-display-name">70% CACAO</span>
              </div>
              <span className="cacao-sub-note">SINGLE-ESTATE // FERMENTED 140 HOURS</span>
            </div>

            <div className="origin-media-cacao">
              <div className="origin-media-sheen" aria-hidden="true" />
              <img
                src={cacaoImg}
                alt="Raw whole cacao pod split open with roasted nibs on dark slate"
                className="origin-photo"
                loading="lazy"
              />
              <span className="origin-caption" aria-hidden="true">FIG. 01 · ESTATE BEAN</span>
            </div>
          </div>

          {/* Middle Row: Alphonso Runway Banner + Saffron Offset Satellite */}
          <div className="origin-zone-middle origin-reveal">
            {/* Alphonso Typographic Anchor */}
            <div className="origin-zone-alphonso">
              <div className="alphonso-editorial-badge">
                <span className="alphonso-tag">SUMMER SOIL</span>
                <div className="alphonso-display-mask">
                  <span className="alphonso-display-text">ALPHONSO</span>
                </div>
              </div>
              <div className="origin-media-alphonso">
                <div className="origin-media-sheen" aria-hidden="true" />
                <img
                  src={alphonsoImg}
                  alt="Glistening sliced Ratnagiri Alphonso mango cheek on slate"
                  className="origin-photo"
                  loading="lazy"
                />
                <span className="origin-caption" aria-hidden="true">FIG. 02 · RATNAGIRI NECTAR</span>
              </div>
            </div>

            {/* Saffron Satellite Macro — Specimen Portal */}
            <div className="origin-zone-saffron">
              <div className="origin-media-saffron">
                <div className="saffron-lens-ring" aria-hidden="true" />
                <div className="saffron-lens-glow" aria-hidden="true" />
                <div className="origin-media-sheen" aria-hidden="true" />
                <img
                  src={saffronImg}
                  alt="Pure deep crimson Kashmiri saffron threads resting on spoon"
                  className="origin-photo"
                  loading="lazy"
                />
                <span className="origin-caption" aria-hidden="true">FIG. 03 · KASHMIRI MONGRA</span>
              </div>
              <div className="saffron-typography-block">
                <span className="saffron-name">SAFFRON</span>
                <span className="saffron-micro">HAND-PLUCKED STIGMAS · STEEPED AT 62°C</span>
              </div>
            </div>
          </div>

          {/* Typographic Secondary Inscription: Damask Rose & Tender Coconut */}
          <div className="origin-botanical-row origin-reveal" aria-hidden="true">
            <span className="botanical-term">DAMASK ROSE</span>
            <span className="botanical-bullet">❦</span>
            <span className="botanical-term">TENDER COCONUT</span>
            <span className="botanical-bullet">❦</span>
            <span className="botanical-term">UNREFINED SEA SALT</span>
          </div>

          {/* Pinned Archival Material Register Stage */}
          <div className="provenance-stage" ref={stageRef}>
            <div className="provenance-inner" ref={innerRef}>
              {/* Archival Register Header & Progress Counter */}
              <div className="provenance-header-row" ref={headerMetaRef}>
                <div className="provenance-header-meta">
                  <span className="provenance-eyebrow-tag">[ MATERIAL REGISTER // 01 — 05 ]</span>
                  <span className="provenance-dot-sep" aria-hidden="true">·</span>
                  <span className="provenance-eyebrow-sub">RAW INGREDIENT PROVENANCE</span>
                </div>
                <div className="provenance-progress-counter" aria-label="Ingredient register position">
                  <span className="provenance-current-num" ref={counterNumRef}>01</span>
                  <span className="provenance-sep">/</span>
                  <span className="provenance-total-num">05</span>
                </div>
              </div>

              {/* Horizontal Top Rule drawn left to right */}
              <div className="provenance-top-rule" ref={topRuleRef} aria-hidden="true" />

              {/* Stable Table Column Headings */}
              <div className="origin-ledger-header" ref={tableHeaderRef} aria-hidden="true">
                <span className="ledger-th-col ledger-th-num">REF</span>
                <span className="ledger-th-col ledger-th-material">RAW MATERIAL</span>
                <span className="ledger-th-col ledger-th-origin">ORIGIN REGISTER</span>
                <span className="ledger-th-col ledger-th-discipline">EXTRACTION METHOD</span>
              </div>

              {/* 5 Sequential Provenance Rows */}
              <div className="origin-ledger-list" role="list">
                {INGREDIENTS.map((item, index) => (
                  <div
                    key={item.number}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    className="origin-ledger-row provenance-row"
                    role="listitem"
                    data-index={index}
                  >
                    {/* Left Accent Marker (vertical line, height 0 -> 100%) */}
                    <span className="provenance-accent-line" aria-hidden="true" />

                    <span className="origin-num-col">[{item.number}]</span>
                    <span className="origin-material-col">{item.name}</span>
                    <span className="origin-source-col">{item.source}</span>
                    <span className="origin-note-col">{item.note}</span>

                    {/* Subtle Origin Trace Line beneath the row */}
                    <span className="provenance-trace-line" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
