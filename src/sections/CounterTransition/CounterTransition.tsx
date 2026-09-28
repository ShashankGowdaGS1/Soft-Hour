import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CounterTransition.css';

gsap.registerPlugin(ScrollTrigger);

interface CounterTransitionProps {
  onOpenMenuDrawer?: () => void;
}

export default function CounterTransition({ onOpenMenuDrawer }: CounterTransitionProps) {
  const bridgeRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const hourRef = useRef<HTMLSpanElement | null>(null);
  const phraseRef = useRef<HTMLSpanElement | null>(null);
  const secondaryRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenMenuDrawer) {
      onOpenMenuDrawer();
    }
  };

  useEffect(() => {
    const bridge = bridgeRef.current;
    const track = trackRef.current;
    if (!bridge || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Only perform horizontal bridge pinning on desktop (>= 769px)
      mm.add('(min-width: 769px)', () => {
        const nav = document.querySelector('.site-header');
        const navHeight = nav ? nav.getBoundingClientRect().height : 88;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bridge,
            start: () => `top top+=${navHeight}`,
            end: () => `+=${window.innerHeight * 1.15}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Horizontal track translation: moves exactly 1 viewport width (Panel A exits, Panel B enters)
        tl.to(
          track,
          {
            xPercent: -50,
            ease: 'none',
            duration: 1,
          },
          0
        );

        // 2. Subtle parallax differential: headline moves slightly slower (95% speed), metadata slightly faster (106% speed)
        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { x: 45 },
            { x: 0, ease: 'none', duration: 1 },
            0
          );
        }

        if (metaRef.current) {
          tl.fromTo(
            metaRef.current,
            { x: -24, opacity: 0.2 },
            { x: 0, opacity: 1, ease: 'power1.out', duration: 0.4 },
            0.4
          );
        }

        if (hourRef.current) {
          tl.fromTo(
            hourRef.current,
            { opacity: 0.3 },
            { opacity: 1, ease: 'power1.out', duration: 0.25 },
            0.52
          );
        }

        if (phraseRef.current) {
          tl.fromTo(
            phraseRef.current,
            { opacity: 0.3 },
            { opacity: 1, ease: 'power1.out', duration: 0.25 },
            0.62
          );
        }

        if (secondaryRef.current) {
          tl.fromTo(
            secondaryRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, ease: 'power1.out', duration: 0.25 },
            0.72
          );
        }

        if (ctaRef.current) {
          tl.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.94 },
            { opacity: 1, scale: 1, ease: 'power1.out', duration: 0.2 },
            0.82
          );
        }
      });

      return () => mm.revert();
    }, bridgeRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bridgeRef}
      className="horizontal-bridge"
      aria-label="Atelier to Service Transition"
    >
      <div ref={trackRef} className="horizontal-bridge-track">
        {/* PANEL A: Visual continuation / final frame of Kitchen */}
        <div className="bridge-panel bridge-panel-exit" aria-hidden="true">
          <div className="container bridge-panel-container">
            <div className="kitchen-exit-wrap">
              <div className="kitchen-exit-meta">
                <span className="exit-clock-dot" />
                <span className="editorial-num">[ 10:45 AM // MORNING BAKE CLOSES ]</span>
                <span className="crumb-cluster">
                  <span className="crumb-dot crumb-dot-sm" />
                  <span className="crumb-dot crumb-dot-md" />
                  <span className="crumb-dot crumb-dot-sm" />
                </span>
                <span className="recipe-note">KITCHEN TO COUNTER HANDOVER</span>
              </div>

              <h3 className="kitchen-exit-title">
                <span className="exit-line-1">The ovens rest.</span>
                <span className="exit-line-2">
                  <span className="craft-dash">—</span>
                  <em>The counter unlocks.</em>
                </span>
              </h3>

              <p className="kitchen-exit-note">
                From copper sieve to marble pedestal. The morning production is complete.
              </p>

              <div className="kitchen-exit-indicator">
                <span className="exit-indicator-text">SCROLL TO ADVANCE TO SERVICE</span>
                <span className="exit-indicator-arrow">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL B: Destination Section — 11:00 AM. THE GLASS FILLS. */}
        <div className="bridge-panel bridge-panel-enter" aria-label="Daily Counter Dispatch">
          <div className="container counter-transition-container">
            <div className="transition-typography-wrap">
              <div ref={metaRef} className="transition-meta-indicator" aria-hidden="true">
                <span className="transition-time-dot" />
                <span className="transition-meta-text">DAILY SERVICE RHYTHM</span>
              </div>

              <h2 ref={titleRef} className="transition-primary-title">
                <span ref={hourRef} className="transition-hour">11:00 AM.</span>
                <span ref={phraseRef} className="transition-phrase">THE GLASS FILLS.</span>
              </h2>

              <p ref={secondaryRef} className="transition-secondary-phrase">
                <em>By evening, almost nothing remains.</em>
              </p>

              <div ref={ctaRef} className="transition-action-row">
                <button
                  type="button"
                  className="transition-counter-cta"
                  onClick={handleClick}
                  aria-label="Open today's printed dessert counter menu"
                >
                  <span className="cta-label">VIEW TODAY&apos;S COUNTER</span>
                  <span className="cta-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
