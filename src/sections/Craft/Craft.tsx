import { useRef, useEffect } from 'react';
import pipingCreamImg from '../../assets/images/craft/01-piping-cream.jpg';
import dustingCocoaImg from '../../assets/images/craft/02-dusting-cocoa.jpg';
import finishingGlazeImg from '../../assets/images/craft/03-finishing-glaze.jpg';
import './Craft.css';

export default function Craft() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Observe sub-components for staggered viewport reveal
    const revealTargets = el.querySelectorAll('.craft-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((target) => observer.observe(target));

    // Passive RAF scroll listener for differential column parallax
    let rafId: number | null = null;
    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom > -150 && rect.top < windowHeight + 150) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const offsetPx = elementCenter - viewportCenter;

        el.style.setProperty('--craft-scroll-offset', `${offsetPx.toFixed(1)}px`);

        // Compute individual scroll parallax for photo frames in mobile single-column view
        const mediaWrappers = el.querySelectorAll<HTMLElement>('.act-media-wrapper');
        mediaWrappers.forEach((wrapper) => {
          const wRect = wrapper.getBoundingClientRect();
          if (wRect.bottom > -80 && wRect.top < windowHeight + 80) {
            const wCenter = wRect.top + wRect.height / 2;
            const progress = (wCenter - viewportCenter) / (windowHeight / 2);
            const parallaxY = progress * -24;
            wrapper.style.setProperty('--act-img-parallax', `${parallaxY.toFixed(1)}px`);
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
      id="craft"
      ref={sectionRef}
      className="craft-section"
      aria-label="Kitchen &amp; Craft"
    >
      <div className="container">
        {/* Editorial Section Heading */}
        <header className="craft-narrative-header craft-reveal">
          <div className="craft-meta-row">
            <span className="editorial-num">[ ATELIER CHRONICLE // 06:00 — 11:00 AM ]</span>
            <span className="crumb-cluster" aria-hidden="true">
              <span className="crumb-dot crumb-dot-sm" />
              <span className="crumb-dot crumb-dot-md" />
              <span className="crumb-dot crumb-dot-sm" />
            </span>
            <span className="recipe-note">KITCHEN METHOD &amp; DISCIPLINE</span>
          </div>

          <div className="craft-title-layout">
            <h2 className="craft-title">
              <span className="craft-line-mask">
                <span className="craft-line-1">Whipped slowly.</span>
              </span>
              <span className="craft-line-mask">
                <span className="craft-line-2">Finished by hand.</span>
              </span>
              <span className="craft-line-mask">
                <span className="craft-line-3">
                  <span className="craft-dash" aria-hidden="true">—</span>
                  <em>Made this morning.</em>
                </span>
              </span>
            </h2>

            <div className="craft-side-quote">
              <div className="quote-accent-bar" aria-hidden="true" />
              <span className="quote-mark-large" aria-hidden="true">“</span>
              <p className="craft-quote-text">
                Pastry is thermodynamics dressed in velvet. If the laboratory is two degrees too warm, the glaze dulls. We obey the clock and the thermometer.
              </p>
              <span className="craft-quote-author">CHEF PATISSIER · ATELIER BENGALURU</span>
            </div>
          </div>
        </header>

        {/* Dynamic Atelier Narrative Chronicle */}
        <div className="craft-photo-essay">
          {/* Act I: 06:30 AM — Aeration */}
          <article
            className="essay-act act-aeration craft-reveal"
            style={{ '--act-idx': 0 } as React.CSSProperties}
          >
            <div className="act-time-badge">
              <span className="act-time-pulse" aria-hidden="true" />
              <span className="act-hour">06:30 AM</span>
              <span className="act-sep">/</span>
              <span className="act-phase">ACT I: AERATION</span>
            </div>

            <div className="act-media-wrapper media-portrait-crop">
              <div className="craft-media-sheen" aria-hidden="true" />
              <img
                src={pipingCreamImg}
                alt="Pastry chef delicately piping Tahitian vanilla cream onto tart shell"
                className="act-photo"
                loading="lazy"
              />
              <span className="act-corner-tag" aria-hidden="true">TEMP: 4.2°C</span>
            </div>

            <div className="act-narrative">
              <h3 className="act-heading">Low-revolution whipping</h3>
              <p className="act-body">
                Heavy cream chilled to 4°C is aerated at low speed for 28 minutes to build uniform, microscopic air bubbles rather than coarse foam.
              </p>
            </div>
          </article>

          {/* Act II: 08:45 AM — The Suspended Cloud */}
          <article
            className="essay-act act-sift craft-reveal"
            style={{ '--act-idx': 1 } as React.CSSProperties}
          >
            <div className="act-time-badge">
              <span className="act-time-pulse" aria-hidden="true" />
              <span className="act-hour">08:45 AM</span>
              <span className="act-sep">/</span>
              <span className="act-phase">ACT II: TEMPER</span>
            </div>

            <div className="act-media-wrapper media-landscape-crop">
              <div className="craft-media-sheen" aria-hidden="true" />
              <img
                src={dustingCocoaImg}
                alt="Fine dark cocoa powder dusted through a copper sieve"
                className="act-photo"
                loading="lazy"
              />
              <span className="act-corner-tag" aria-hidden="true">SIEVE: 40-MESH</span>
            </div>

            <div className="act-narrative">
              <h3 className="act-heading">The suspended cacao cloud</h3>
              <p className="act-body">
                Alkalized Dutch-process cocoa sifted through fine copper mesh, creating a velvet micro-barrier that softens upon table presentation.
              </p>
            </div>
          </article>

          {/* Act III: 10:15 AM — Tweezer Precision */}
          <article
            className="essay-act act-finish craft-reveal"
            style={{ '--act-idx': 2 } as React.CSSProperties}
          >
            <div className="act-time-badge">
              <span className="act-time-pulse" aria-hidden="true" />
              <span className="act-hour">10:15 AM</span>
              <span className="act-sep">/</span>
              <span className="act-phase">ACT III: PRE-SERVICE</span>
            </div>

            <div className="act-media-wrapper media-square-crop">
              <div className="craft-media-sheen" aria-hidden="true" />
              <img
                src={finishingGlazeImg}
                alt="Hand placing delicate cacao garnish with precision tweezers"
                className="act-photo"
                loading="lazy"
              />
              <span className="act-corner-tag" aria-hidden="true">FINAL PASS</span>
            </div>

            <div className="act-narrative">
              <h3 className="act-heading">Placed moments before opening</h3>
              <p className="act-body">
                Tempered cacao crisps and gold leaf placed individually with surgical tweezers moments before the morning counter unlocks.
              </p>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
