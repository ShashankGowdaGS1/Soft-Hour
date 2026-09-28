import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onOpenMenuDrawer?: () => void;
}

export default function Footer({ onOpenMenuDrawer }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const saveWordRef = useRef<HTMLSpanElement | null>(null);
  const roomWordRef = useRef<HTMLSpanElement | null>(null);
  const subphraseRef = useRef<HTMLSpanElement | null>(null);
  const statusBadgeRef = useRef<HTMLDivElement | null>(null);
  const statusDotRef = useRef<HTMLSpanElement | null>(null);
  const statusSubRef = useRef<HTMLSpanElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const ledgerGridRef = useRef<HTMLDivElement | null>(null);
  const whisperRef = useRef<HTMLDivElement | null>(null);
  const wordmarkFrameRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);
  const utilityLeftRef = useRef<HTMLDivElement | null>(null);
  const utilityRightRef = useRef<HTMLDivElement | null>(null);

  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenMenuDrawer) {
      onOpenMenuDrawer();
    } else {
      alert(
        'Order for Pickup: Pre-orders are packaged freshly daily in insulated boxes. Call +91 (80) 4122 8900 or visit our counter at 12th Main, Indiranagar.'
      );
    }
  };

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop & Tablet (>= 769px)
      mm.add('(min-width: 769px)', () => {
        // 1. Subtle vertical background wipe as previous section leaves
        gsap.fromTo(
          footerEl,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            ease: 'none',
            scrollTrigger: {
              trigger: footerEl,
              start: 'top bottom',
              end: 'top 75%',
              scrub: 0.8,
            },
          }
        );

        // 2. Orchestrated Editorial Entrance Timeline
        const mainTl = gsap.timeline({
          scrollTrigger: {
            trigger: footerEl,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });

        // 2a. SAVE ROOM words lift up through overflow masks
        if (saveWordRef.current && roomWordRef.current) {
          mainTl.fromTo(
            [saveWordRef.current, roomWordRef.current],
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.25,
              stagger: 0.1,
              ease: 'power4.out',
            },
            0.1
          );
        }

        // 2b. "for tomorrow." soft entry (opacity, y, x, skewY)
        if (subphraseRef.current) {
          mainTl.fromTo(
            subphraseRef.current,
            { opacity: 0, y: 25, x: -18, skewY: 2 },
            {
              opacity: 1,
              y: 0,
              x: 0,
              skewY: 0,
              duration: 1.1,
              ease: 'power3.out',
            },
            0.35
          );
        }

        // 2c. Right-side service badge & single dot pulse
        if (statusBadgeRef.current) {
          mainTl.fromTo(
            statusBadgeRef.current,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power3.out',
            },
            0.45
          );
        }

        if (statusDotRef.current) {
          mainTl.fromTo(
            statusDotRef.current,
            { scale: 0 },
            { scale: 1.4, duration: 0.25, ease: 'power2.out' },
            0.7
          );
          mainTl.to(
            statusDotRef.current,
            { scale: 1, duration: 0.25, ease: 'power2.inOut' },
            0.95
          );
        }

        if (statusSubRef.current) {
          mainTl.fromTo(
            statusSubRef.current,
            { opacity: 0, letterSpacing: '0.18em' },
            { opacity: 1, letterSpacing: '0.22em', duration: 0.7, ease: 'power2.out' },
            0.75
          );
        }

        // 2d. Hairline architectural divider (scaleX 0 -> 1 from left)
        if (dividerRef.current) {
          mainTl.fromTo(
            dividerRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: 'left center',
              duration: 1.0,
              ease: 'power2.out',
            },
            0.6
          );
        }

        // 2e. Information columns stagger (ATELIER REGISTER, VISIT, HOURS, INQUIRIES, ACCESS)
        const cols = ledgerGridRef.current
          ? ledgerGridRef.current.querySelectorAll('.footer-col')
          : [];
        if (cols.length) {
          mainTl.fromTo(
            cols,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
            },
            0.8
          );
        }

        // 2f. Description lines reveal line-by-line
        const summaryLines = ledgerGridRef.current
          ? ledgerGridRef.current.querySelectorAll('.summary-line')
          : [];
        if (summaryLines.length) {
          mainTl.fromTo(
            summaryLines,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'power2.out' },
            1.0
          );
        }

        // 2g. Whisper line: "— we saved you one."
        if (whisperRef.current) {
          const dash = whisperRef.current.querySelector('.whisper-dash');
          const italic = whisperRef.current.querySelector('.whisper-italic');
          if (dash) {
            mainTl.fromTo(dash, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, 1.15);
          }
          if (italic) {
            mainTl.fromTo(italic, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 1.2);
          }
        }

        // 2h. Action link hairline rules
        const actionLinkLines = ledgerGridRef.current
          ? ledgerGridRef.current.querySelectorAll('.action-link-line')
          : [];
        if (actionLinkLines.length) {
          mainTl.fromTo(
            actionLinkLines,
            { scaleX: 0 },
            { scaleX: 1, transformOrigin: 'left center', duration: 0.7, stagger: 0.08, ease: 'power2.out' },
            1.1
          );
        }

        // 2i. Bottom utility meta row
        if (utilityLeftRef.current && utilityRightRef.current) {
          mainTl.fromTo(
            utilityLeftRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
            1.2
          );
          mainTl.fromTo(
            utilityRightRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
            1.2
          );
        }

        // 3. Giant Background "SOFT HOUR" Typographic Watermark Loop
        const chars = wordmarkRef.current
          ? wordmarkRef.current.querySelectorAll('.wm-char')
          : [];

        if (chars.length) {
          const loopTl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.5,
            paused: true,
          });

          loopTl
            .set(chars, { opacity: 0, y: 8, filter: 'blur(3px)' })
            .to(chars, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              stagger: 0.11,
              duration: 0.42,
              ease: 'power2.out',
            })
            .to({}, { duration: 2.4 }) // Hold complete phrase for ~2.4 seconds
            .to(chars, {
              opacity: 0,
              duration: 0.9,
              ease: 'power2.inOut',
            });

          // Play loop when section is in viewport; pause when outside to preserve CPU
          ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 85%',
            end: 'bottom top',
            onEnter: () => loopTl.play(),
            onEnterBack: () => loopTl.play(),
            onLeave: () => loopTl.pause(),
            onLeaveBack: () => loopTl.pause(),
          });
        }

        // 4. Background Wordmark Parallax Drift
        if (wordmarkFrameRef.current) {
          gsap.fromTo(
            wordmarkFrameRef.current,
            { y: 22 },
            {
              y: -18,
              ease: 'none',
              scrollTrigger: {
                trigger: footerEl,
                start: 'top bottom',
                end: 'bottom bottom',
                scrub: 1,
              },
            }
          );
        }
      });

      // Mobile (<= 768px): Refined animation with reduced motion
      mm.add('(max-width: 768px)', () => {
        if (saveWordRef.current && roomWordRef.current) {
          gsap.fromTo(
            [saveWordRef.current, roomWordRef.current],
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 1.1,
              stagger: 0.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: saveWordRef.current,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        if (subphraseRef.current) {
          gsap.fromTo(
            subphraseRef.current,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: subphraseRef.current,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }

        const cols = ledgerGridRef.current
          ? ledgerGridRef.current.querySelectorAll('.footer-col')
          : [];
        cols.forEach((col) => {
          gsap.fromTo(
            col,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: col,
                start: 'top 92%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // Mobile watermark loop with slightly higher stagger
        const chars = wordmarkRef.current
          ? wordmarkRef.current.querySelectorAll('.wm-char')
          : [];
        if (chars.length) {
          const mobileLoopTl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.6,
            paused: true,
          });

          mobileLoopTl
            .set(chars, { opacity: 0, y: 6 })
            .to(chars, {
              opacity: 1,
              y: 0,
              stagger: 0.13,
              duration: 0.38,
              ease: 'power2.out',
            })
            .to({}, { duration: 2.2 })
            .to(chars, {
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
            });

          ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 90%',
            end: 'bottom top',
            onEnter: () => mobileLoopTl.play(),
            onEnterBack: () => mobileLoopTl.play(),
            onLeave: () => mobileLoopTl.pause(),
            onLeaveBack: () => mobileLoopTl.pause(),
          });
        }
      });

      // Reduced motion: Show complete content statically
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const chars = wordmarkRef.current
          ? wordmarkRef.current.querySelectorAll('.wm-char')
          : [];
        gsap.set(chars, { opacity: 1, y: 0, filter: 'none' });
      });

      return () => mm.revert();
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="visit" ref={footerRef} className="footer-section" aria-label="Atelier Location, Hours &amp; Colophon">
      <div className="container footer-container">
        {/* 10. Top Editorial Closing Statement */}
        <div className="footer-statement-row">
          <div className="footer-statement-headline">
            <h2 className="statement-display-title">
              <span className="statement-lead">
                <span className="statement-word-mask">
                  <span className="statement-word statement-word-save" ref={saveWordRef}>
                    SAVE
                  </span>
                </span>
                <span className="statement-word-mask">
                  <span className="statement-word statement-word-room" ref={roomWordRef}>
                    ROOM
                  </span>
                </span>
              </span>
              <span className="statement-subphrase" ref={subphraseRef}>
                for tomorrow.
              </span>
            </h2>
          </div>

          <div className="footer-statement-status" ref={statusBadgeRef}>
            <div className="status-live-chip">
              <span className="status-dot" ref={statusDotRef} aria-hidden="true" />
              <span className="status-text">BAKED DAILY · 11:00—22:00</span>
            </div>
            <span className="status-sub" ref={statusSubRef}>
              INDIRANAGAR COUNTER REGISTER
            </span>
          </div>
        </div>

        {/* Hairline Architectural Rule */}
        <div className="footer-hairline" ref={dividerRef} aria-hidden="true" />

        {/* 11. Asymmetrical Editorial Information Architecture */}
        <div className="footer-asymmetric-ledger" ref={ledgerGridRef}>
          {/* Large Left Area: Brand Authority & Atelier Lore */}
          <div className="ledger-block ledger-brand-area footer-col">
            <span className="ledger-meta-tag">[ ATELIER REGISTER ]</span>
            <h3 className="ledger-brand-name">SOFT HOUR</h3>
            <p className="ledger-brand-descriptor">Dessert Atelier · Bengaluru</p>
            <p className="ledger-brand-summary">
              <span className="summary-line">Sculpted daily in single batches from estate single-origin cacao,</span>{' '}
              <span className="summary-line">slow-churned butter, and hand-harvested sea salt flakes.</span>
            </p>
            <div className="ledger-whisper-moment" ref={whisperRef}>
              <span className="whisper-dash" aria-hidden="true">—</span>
              <em className="whisper-italic">we saved you one.</em>
            </div>
          </div>

          {/* Smaller Middle Cluster: Physical Atelier Visit & Operating Schedule */}
          <div className="ledger-block ledger-visit-area">
            <div className="ledger-group footer-col">
              <span className="ledger-label-meta">VISIT</span>
              <address className="ledger-address">
                <span>12th Main Road</span>
                <span>Indiranagar, Bengaluru</span>
                <span>Karnataka 560038</span>
              </address>
            </div>

            <div className="ledger-group ledger-hours-group footer-col">
              <span className="ledger-label-meta">HOURS</span>
              <div className="ledger-hours-block">
                <span className="hours-frequency">Daily</span>
                <span className="hours-interval">11:00 AM — 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right Cluster: Direct Inquiries & Interactive Actions */}
          <div className="ledger-block ledger-actions-area">
            <div className="ledger-group footer-col">
              <span className="ledger-label-meta">INQUIRIES</span>
              <div className="ledger-contact-links">
                <a href="mailto:atelier@softhour.com" className="ledger-text-link">
                  atelier@softhour.com
                </a>
                <a href="tel:+918041228900" className="ledger-text-link">
                  +91 (80) 4122 8900
                </a>
              </div>
            </div>

            <div className="ledger-group ledger-nav-actions-group footer-col">
              <span className="ledger-label-meta">ACCESS</span>
              <nav className="ledger-action-links" aria-label="Atelier access links">
                <a
                  href="#visit"
                  className="ledger-action-link"
                  onClick={handleOrderClick}
                >
                  <span className="action-label">ORDER FOR PICKUP</span>
                  <span className="action-arrow" aria-hidden="true">→</span>
                  <span className="action-link-line" aria-hidden="true" />
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ledger-action-link"
                >
                  <span className="action-label">GET DIRECTIONS</span>
                  <span className="action-arrow" aria-hidden="true">→</span>
                  <span className="action-link-line" aria-hidden="true" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ledger-action-link"
                >
                  <span className="action-label">INSTAGRAM</span>
                  <span className="action-arrow" aria-hidden="true">→</span>
                  <span className="action-link-line" aria-hidden="true" />
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* 12. Oversized Signature Wordmark with letter-by-letter loop */}
        <div className="footer-monumental-wordmark-frame" ref={wordmarkFrameRef} aria-hidden="true">
          <span className="footer-monumental-wordmark" ref={wordmarkRef}>
            <span className="wm-char">S</span>
            <span className="wm-char">O</span>
            <span className="wm-char">F</span>
            <span className="wm-char">T</span>
            <span className="wm-char wm-space">&nbsp;</span>
            <span className="wm-char">H</span>
            <span className="wm-char">O</span>
            <span className="wm-char">U</span>
            <span className="wm-char">R</span>
          </span>
        </div>

        {/* Hairline Divider before Utility */}
        <div className="footer-hairline footer-hairline-bottom" aria-hidden="true" />

        {/* 13. Final Utility Row */}
        <div className="footer-utility-row">
          <div className="utility-col-left" ref={utilityLeftRef}>
            <span className="utility-token">© 2026 SOFT HOUR</span>
            <span className="utility-delimiter" aria-hidden="true">/</span>
            <span className="utility-token">BENGALURU</span>
          </div>

          <div className="utility-col-right" ref={utilityRightRef}>
            <span className="utility-token utility-craft-promise">
              NO PRESERVATIVES · BAKED DAILY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
