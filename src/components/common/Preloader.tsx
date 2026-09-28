import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PhaseMilestone {
  threshold: number;
  phase: string;
  action: string;
}

const PHASES: PhaseMilestone[] = [
  {
    threshold: 0,
    phase: 'ACT I // AERATION',
    action: '06:30 AM · CHILLED CREAM AERATING AT 4.2°C',
  },
  {
    threshold: 28,
    phase: 'ACT II // TEMPER',
    action: '08:45 AM · SIFTING 70% SINGLE-ESTATE CACAO',
  },
  {
    threshold: 58,
    phase: 'ACT III // INFUSION',
    action: '10:15 AM · RATNAGIRI ALPHONSO & KASHMIR SAFFRON',
  },
  {
    threshold: 85,
    phase: 'ACT IV // FINAL PASS',
    action: '10:55 AM · TWEEZER GOLD LEAF & MIRROR GLAZE',
  },
  {
    threshold: 100,
    phase: 'SERVICE READY',
    action: '11:00 AM · ATELIER COUNTER IS UNLOCKED',
  },
];

export default function Preloader() {
  const [isComplete, setIsComplete] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    return false;
  });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const shutterTopRef = useRef<HTMLDivElement | null>(null);
  const shutterBottomRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const counterNumRef = useRef<HTMLSpanElement | null>(null);
  const phaseRef = useRef<HTMLSpanElement | null>(null);
  const actionRef = useRef<HTMLParagraphElement | null>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const activePhaseIdxRef = useRef<number>(0);

  const updatePhaseAndAction = useCallback((progress: number) => {
    let targetIdx = 0;
    for (let i = PHASES.length - 1; i >= 0; i--) {
      if (progress >= PHASES[i].threshold) {
        targetIdx = i;
        break;
      }
    }

    if (targetIdx !== activePhaseIdxRef.current) {
      activePhaseIdxRef.current = targetIdx;
      const targetMilestone = PHASES[targetIdx];

      if (phaseRef.current) {
        phaseRef.current.textContent = targetMilestone.phase;
      }

      if (actionRef.current) {
        gsap.to(actionRef.current, {
          opacity: 0,
          y: -4,
          duration: 0.12,
          onComplete: () => {
            if (actionRef.current) {
              actionRef.current.textContent = targetMilestone.action;
              gsap.to(actionRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.18,
                ease: 'power2.out',
              });
            }
          },
        });
      }
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (timelineRef.current && timelineRef.current.progress() < 1) {
      timelineRef.current.timeScale(4);
    }
  }, []);

  useEffect(() => {
    if (isComplete) return;

    // Lock page scrolling while preloader curtain is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          setIsComplete(true);
          document.body.style.overflow = originalOverflow || '';
        },
      });

      timelineRef.current = tl;

      // 1. Initial choreography: header, wordmark lift, subtitle & footer appear
      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
      })
        .to(
          wordmarkRef.current,
          {
            yPercent: 0,
            duration: 0.85,
            ease: 'power4.out',
          },
          '-=0.35'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          '-=0.45'
        )
        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          '-=0.35'
        );

      // 2. Continuous archival counter increment & progressive hairline draw
      const counterState = { progress: 0 };
      tl.to(counterState, {
        progress: 100,
        duration: 1.65,
        ease: 'power2.inOut',
        onUpdate: () => {
          const rounded = Math.round(counterState.progress);
          if (counterNumRef.current) {
            counterNumRef.current.textContent = rounded < 10 ? `0${rounded}` : `${rounded}`;
          }
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${rounded / 100})`;
          }
          updatePhaseAndAction(rounded);
        },
      });

      // 3. Poised hold at 100% (counter unlocked)
      tl.to({}, { duration: 0.28 });

      // 4. Central content dissolves cleanly
      tl.to(stageRef.current, {
        opacity: 0,
        y: -18,
        duration: 0.42,
        ease: 'power2.in',
      });

      // 5. Architectural Curtains part: top shutter slides UP, bottom slides DOWN
      tl.to(
        shutterTopRef.current,
        {
          yPercent: -101,
          duration: 0.95,
          ease: 'power4.inOut',
        },
        '-=0.08'
      ).to(
        shutterBottomRef.current,
        {
          yPercent: 101,
          duration: 0.95,
          ease: 'power4.inOut',
        },
        '<'
      );
    }, rootRef);

    // Global keyboard listener to allow immediate skip (Space, Escape, Enter)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape', 'Space', 'Enter'].includes(e.code)) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isComplete, handleSkip, updatePhaseAndAction]);

  if (isComplete) return null;

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
      }}
      className={`atelier-preloader-root ${isComplete ? 'is-complete' : ''}`}
      onClick={handleSkip}
      role="dialog"
      aria-label="Soft Hour Atelier Opening Preparation"
      aria-modal="true"
    >
      {/* Top Architectural Roasted Cacao Shutter */}
      <div
        ref={(el) => {
          shutterTopRef.current = el;
        }}
        className="preloader-shutter preloader-shutter-top"
      />

      {/* Bottom Architectural Roasted Cacao Shutter */}
      <div
        ref={(el) => {
          shutterBottomRef.current = el;
        }}
        className="preloader-shutter preloader-shutter-bottom"
      />

      {/* Central Editorial Content Stage */}
      <div
        ref={(el) => {
          stageRef.current = el;
        }}
        className="preloader-stage"
      >
        {/* Top Header Row */}
        <header
          ref={(el) => {
            headerRef.current = el;
          }}
          className="preloader-header"
        >
          <div className="preloader-meta-left">
            <span className="preloader-pulse-dot" aria-hidden="true" />
            <span className="preloader-meta-tag">
              [ ATELIER CHRONOMETER // BENGALURU ]
            </span>
          </div>
          <span className="preloader-meta-right">
            COUNTER SERVICE PREPARATION · 11:00 AM
          </span>
        </header>

        {/* Center Editorial Typographic Composition */}
        <div className="preloader-centerpiece">
          <div className="preloader-wordmark-mask">
            <span
              ref={(el) => {
                wordmarkRef.current = el;
              }}
              className="preloader-wordmark"
            >
              SOFT HOUR
            </span>
          </div>

          <p
            ref={(el) => {
              subtitleRef.current = el;
            }}
            className="preloader-subtitle"
          >
            for something extraordinary.
          </p>

          {/* Hairline Progress Track */}
          <div className="preloader-progress-container">
            <div className="preloader-track" aria-hidden="true">
              <div
                ref={(el) => {
                  barRef.current = el;
                }}
                className="preloader-bar"
              />
            </div>
            <button
              type="button"
              className="preloader-skip-hint"
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
            >
              [ CLICK OR PRESS ESCAPE TO ENTER ]
            </button>
          </div>
        </div>

        {/* Bottom Status Ticker & Archival Number Counter */}
        <footer
          ref={(el) => {
            footerRef.current = el;
          }}
          className="preloader-footer"
        >
          <div className="preloader-ticker-group">
            <span
              ref={(el) => {
                phaseRef.current = el;
              }}
              className="preloader-ticker-phase"
            >
              ACT I // AERATION
            </span>
            <p
              ref={(el) => {
                actionRef.current = el;
              }}
              className="preloader-ticker-action"
            >
              06:30 AM · CHILLED CREAM AERATING AT 4.2°C
            </p>
          </div>

          <div className="preloader-counter-wrap">
            <span
              ref={(el) => {
                counterNumRef.current = el;
              }}
              className="preloader-counter-num"
            >
              00
            </span>
            <span className="preloader-counter-unit">%</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
