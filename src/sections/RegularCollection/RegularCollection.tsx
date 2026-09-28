import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { regularDesserts } from '../../data/desserts';
import type { DessertItem } from '../../types/dessert';
import './RegularCollection.css';

gsap.registerPlugin(ScrollTrigger);

interface RegularCollectionProps {
  onSelectVideo?: (dessert: DessertItem) => void;
}

const REGULAR_TAGS: Record<string, string> = {
  'dessert-01': 'CACAO',
  'dessert-02': 'PISTACHE',
  'dessert-03': 'BRÛLÉ',
  'dessert-04': 'CAFÉ',
  'dessert-05': 'CARAMEL',
  'dessert-06': 'ROUGE',
  'dessert-07': 'ÉCLAIR',
  'dessert-08': 'VANILLE',
};

export default function RegularCollection({ onSelectVideo: _onSelectVideo }: RegularCollectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const railIndicatorRef = useRef<HTMLDivElement | null>(null);
  const railTrackRef = useRef<HTMLDivElement | null>(null);

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeIdxRef = useRef<number>(0);

  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 961px)', () => {
        const copyEls = copyRefs.current;
        const mediaEls = mediaRefs.current;
        const railIndicator = railIndicatorRef.current;
        const railTrack = railTrackRef.current;

        const totalItems = regularDesserts.length;
        const HOLD_DURATION = 1.0;
        const TRANS_DURATION = 0.55;
        const FINAL_HOLD = 1.2;

        // Set initial positions: only item 0 is active and visible
        copyEls.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto' });
          } else {
            gsap.set(el, { y: 70, opacity: 0, scale: 1, pointerEvents: 'none' });
          }
        });

        mediaEls.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, scale: 1, y: 0 });
          } else {
            gsap.set(el, { opacity: 0, scale: 1.035, y: 15 });
          }
        });

        // Calculate travel distance for vertical progress indicator
        const trackHeight = railTrack ? railTrack.clientHeight : 280;
        const indicatorHeight = railIndicator ? railIndicator.clientHeight : 32;
        const maxRailTravel = Math.max(0, trackHeight - indicatorHeight);

        if (railIndicator) {
          gsap.set(railIndicator, { y: 0 });
        }

        // Measure fixed site header height to pin precisely below navbar
        const nav = document.querySelector('.site-header');
        const navHeight = nav ? nav.getBoundingClientRect().height : 88;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top top+=${navHeight}`,
            end: () => `+=${window.innerHeight * 8.0}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const time = tl.time();
              let current = 0;
              for (let i = 0; i < totalItems; i++) {
                const switchTime = i === 0
                  ? 0
                  : (i - 1) * (HOLD_DURATION + TRANS_DURATION) + HOLD_DURATION + (TRANS_DURATION / 2);
                if (time >= switchTime) {
                  current = i;
                }
              }

              if (current !== activeIdxRef.current) {
                // Pause and reset previous active video
                const prevVideo = videoRefs.current[activeIdxRef.current];
                if (prevVideo) {
                  prevVideo.pause();
                  prevVideo.currentTime = 0;
                }
                activeIdxRef.current = current;
                setActiveIdx(current);
                setIsVideoPlaying(false);
                setIsVideoReady(false);
              }
            },
          },
        });

        // Sequentially chain the transitions with holds
        let currentTime = 0;

        for (let i = 0; i < totalItems - 1; i++) {
          currentTime += HOLD_DURATION;

          const currentCopy = copyEls[i];
          const nextCopy = copyEls[i + 1];
          const currentMedia = mediaEls[i];
          const nextMedia = mediaEls[i + 1];

          if (currentCopy) {
            tl.to(
              currentCopy,
              {
                y: -55,
                opacity: 0,
                scale: 0.985,
                ease: 'power1.out',
                duration: TRANS_DURATION,
                onStart: () => {
                  currentCopy.style.pointerEvents = 'none';
                },
                onReverseComplete: () => {
                  currentCopy.style.pointerEvents = 'auto';
                },
              },
              currentTime
            );
          }

          if (nextCopy) {
            tl.fromTo(
              nextCopy,
              { y: 70, opacity: 0, scale: 1 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: 'power1.out',
                duration: TRANS_DURATION,
                onStart: () => {
                  nextCopy.style.pointerEvents = 'auto';
                },
                onReverseComplete: () => {
                  nextCopy.style.pointerEvents = 'none';
                },
              },
              currentTime
            );
          }

          if (currentMedia) {
            tl.to(
              currentMedia,
              {
                opacity: 0,
                scale: 1.025,
                ease: 'power1.out',
                duration: TRANS_DURATION,
              },
              currentTime
            );
          }

          if (nextMedia) {
            tl.fromTo(
              nextMedia,
              { opacity: 0, scale: 1.035, y: 15 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                ease: 'power1.out',
                duration: TRANS_DURATION,
              },
              currentTime
            );
          }

          currentTime += TRANS_DURATION;
        }

        // Final Hold on Dessert 08 (approx 0.8vh of scroll reading time before unpin)
        currentTime += FINAL_HOLD;
        tl.set({}, {}, currentTime);

        // Functional progress rail indicator travels synchronously across total duration
        if (railIndicator && maxRailTravel > 0) {
          tl.to(
            railIndicator,
            {
              y: maxRailTravel,
              ease: 'none',
              duration: currentTime,
            },
            0
          );
        }
      });

      // ======================================================================
      // Mobile Responsive Architecture (<= 960px)
      // Pinned Single-Stage Atelier Repertoire with scrubbed scroll animation
      // ======================================================================
      mm.add('(max-width: 960px)', () => {
        const copyEls = copyRefs.current;
        const mediaEls = mediaRefs.current;
        const railIndicator = railIndicatorRef.current;

        const totalItems = regularDesserts.length;
        const HOLD_DURATION = 0.9;
        const TRANS_DURATION = 0.45;
        const FINAL_HOLD = 0.9;

        // Set initial positions: only item 0 is active and visible
        copyEls.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { y: 0, opacity: 1, pointerEvents: 'auto' });
          } else {
            gsap.set(el, { y: 35, opacity: 0, pointerEvents: 'none' });
          }
        });

        mediaEls.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, scale: 1, y: 0 });
          } else {
            gsap.set(el, { opacity: 0, scale: 1.04, y: 8 });
          }
        });

        if (railIndicator) {
          gsap.set(railIndicator, { xPercent: 0, y: 0 });
        }

        const nav = document.querySelector('.site-header');
        const navHeight = nav ? nav.getBoundingClientRect().height : 60;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: () => `top top+=${navHeight}`,
            end: () => `+=${window.innerHeight * 4.5}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const time = tl.time();
              let current = 0;
              for (let i = 0; i < totalItems; i++) {
                const switchTime = i === 0
                  ? 0
                  : (i - 1) * (HOLD_DURATION + TRANS_DURATION) + HOLD_DURATION + (TRANS_DURATION / 2);
                if (time >= switchTime) {
                  current = i;
                }
              }

              if (current !== activeIdxRef.current) {
                const prevVideo = videoRefs.current[activeIdxRef.current];
                if (prevVideo) {
                  prevVideo.pause();
                  prevVideo.currentTime = 0;
                }
                activeIdxRef.current = current;
                setActiveIdx(current);
                setIsVideoPlaying(false);
                setIsVideoReady(false);
              }
            },
          },
        });

        let currentTime = 0;

        for (let i = 0; i < totalItems - 1; i++) {
          currentTime += HOLD_DURATION;

          const currentCopy = copyEls[i];
          const nextCopy = copyEls[i + 1];
          const currentMedia = mediaEls[i];
          const nextMedia = mediaEls[i + 1];

          if (currentCopy) {
            tl.to(
              currentCopy,
              {
                y: -25,
                opacity: 0,
                ease: 'power1.out',
                duration: TRANS_DURATION,
                onStart: () => {
                  currentCopy.style.pointerEvents = 'none';
                },
                onReverseComplete: () => {
                  currentCopy.style.pointerEvents = 'auto';
                },
              },
              currentTime
            );
          }

          if (nextCopy) {
            tl.fromTo(
              nextCopy,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: 'power1.out',
                duration: TRANS_DURATION,
                onStart: () => {
                  nextCopy.style.pointerEvents = 'auto';
                },
                onReverseComplete: () => {
                  nextCopy.style.pointerEvents = 'none';
                },
              },
              currentTime
            );
          }

          if (currentMedia) {
            tl.to(
              currentMedia,
              {
                opacity: 0,
                scale: 0.98,
                ease: 'power1.out',
                duration: TRANS_DURATION,
              },
              currentTime
            );
          }

          if (nextMedia) {
            tl.fromTo(
              nextMedia,
              { opacity: 0, scale: 1.04, y: 8 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                ease: 'power1.out',
                duration: TRANS_DURATION,
              },
              currentTime
            );
          }

          currentTime += TRANS_DURATION;
        }

        currentTime += FINAL_HOLD;
        tl.set({}, {}, currentTime);

        // Indicator travels across 7 intervals horizontally on mobile
        if (railIndicator) {
          tl.to(
            railIndicator,
            {
              xPercent: 700,
              ease: 'none',
              duration: currentTime,
            },
            0
          );
        }
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      const video = videoRefs.current[activeIdxRef.current];
      if (video) {
        video.muted = true;
        video.playsInline = true;
        setIsVideoPlaying(true);
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsVideoPlaying(false);
            setIsVideoReady(false);
          });
        }
      }
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      const video = videoRefs.current[activeIdxRef.current];
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      setIsVideoPlaying(false);
      setIsVideoReady(false);
    }
  };

  const handleTogglePlay = () => {
    const video = videoRefs.current[activeIdxRef.current];
    if (!video) return;

    if (isVideoPlaying) {
      video.pause();
      video.currentTime = 0;
      setIsVideoPlaying(false);
      setIsVideoReady(false);
    } else {
      video.muted = true;
      video.playsInline = true;
      setIsVideoPlaying(true);
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          setIsVideoPlaying(false);
          setIsVideoReady(false);
        });
      }
    }
  };

  const currentDessert = regularDesserts[activeIdx] || regularDesserts[0];
  const currentTag = REGULAR_TAGS[currentDessert.id] || 'ATELIER';

  return (
    <section
      id="regular"
      ref={sectionRef}
      className="regular-section"
      aria-label="Regular Collection"
    >
      <div className="container regular-container">
        {/* Curated Atelier Ledger Header (Fixed in place at top of pinned section) */}
        <header className="regular-header">
          <div className="regular-header-left">
            <div className="regular-meta-bar">
              <span className="editorial-num">[ CATALOGUE NO. 01 — 08 ]</span>
              <span className="crumb-cluster" aria-hidden="true">
                <span className="crumb-dot crumb-dot-sm" />
                <span className="crumb-dot crumb-dot-md" />
                <span className="crumb-dot crumb-dot-sm" />
              </span>
              <span className="recipe-note">PERMANENT ATELIER REPERTOIRE</span>
            </div>
            <h2 className="regular-title">REGULAR COLLECTION</h2>
          </div>

          <div className="regular-header-right" aria-hidden="true">
            <span className="ledger-batch-stamp">BATCH DISPATCH: 11:00 AM · ALL-BUTTER PATISSERIE</span>
          </div>
        </header>

        {/* Pinned Stage: Fully responsive, Desktop 2-column + Mobile Single-column */}
        <div className="regular-stage">
          {/* Dessert Copy Stage: Text layers animated by GSAP scroll */}
          <div className="regular-copy-stage" aria-live="polite">
            {regularDesserts.map((item, idx) => {
              const familyTag = REGULAR_TAGS[item.id] || 'ATELIER';
              return (
                <article
                  key={item.id}
                  ref={(el) => { copyRefs.current[idx] = el; }}
                  className={`copy-item-layer ${idx === 0 ? 'is-initial' : ''}`}
                  aria-hidden={activeIdx !== idx}
                >
                  <div className="copy-meta-row">
                    <span className="copy-num-cell">N° {item.number}</span>
                    <span className="copy-tag-cell">{familyTag}</span>
                    <span className="copy-fill-dotted" aria-hidden="true" />
                    <span className="copy-price-cell">{item.price}</span>
                  </div>

                  <h3 className="copy-name-title">{item.name}</h3>

                  <div className="copy-flavor-badge">
                    <span className="copy-flavor-dot" aria-hidden="true" />
                    <span className="copy-flavor-text">{item.flavorNotes}</span>
                  </div>

                  <p className="copy-desc-text">{item.description}</p>
                </article>
              );
            })}
          </div>

          {/* Persistent Media Frame + Progress Rail */}
          <div className="regular-canvas-stage">
            <div className="regular-canvas-meta">
              <span className="regular-canvas-count">{currentDessert.number} / 08</span>
              <span className="regular-canvas-tag">{currentTag}</span>
            </div>

            <div className="regular-canvas-body">
              {/* Functional Progress Rail (Vertical on desktop, horizontal on mobile) */}
              <div className="regular-progress-rail" aria-hidden="true">
                <div ref={railTrackRef} className="rail-track">
                  <div ref={railIndicatorRef} className="rail-indicator" />
                </div>
                <div className="rail-ticks">
                  {regularDesserts.map((item, idx) => (
                    <span
                      key={item.id}
                      className={`rail-tick ${activeIdx === idx ? 'is-active' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {/* Persistent Media Frame with Absolutely Stacked Layers */}
              <div
                className="regular-canvas-frame"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleTogglePlay}
                tabIndex={0}
                role="region"
                aria-label={`${currentDessert.name} — ${isVideoPlaying ? 'tap to pause living film' : 'tap to play living film'}`}
              >
                {regularDesserts.map((item, idx) => (
                  <div
                    key={item.id}
                    ref={(el) => { mediaRefs.current[idx] = el; }}
                    className={`regular-media-layer ${idx === 0 ? 'is-initial' : ''}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="regular-canvas-photo"
                      loading={idx <= 1 ? 'eager' : 'lazy'}
                    />
                    <video
                      ref={(el) => { videoRefs.current[idx] = el; }}
                      src={item.video}
                      muted
                      playsInline
                      loop
                      preload="none"
                      className={`regular-canvas-video ${activeIdx === idx && isVideoPlaying && isVideoReady ? 'is-visible' : ''}`}
                      onCanPlay={() => {
                        if (activeIdx === idx && isVideoPlaying) setIsVideoReady(true);
                      }}
                      onPlaying={() => {
                        if (activeIdx === idx) setIsVideoReady(true);
                      }}
                      onError={() => {
                        if (activeIdx === idx) {
                          setIsVideoPlaying(false);
                          setIsVideoReady(false);
                        }
                      }}
                    />
                  </div>
                ))}

                {/* Living Film Overlay Label */}
                <div
                  className="regular-canvas-badge"
                  aria-hidden="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                >
                  <span className={`badge-dot ${isVideoPlaying ? 'is-pulsing' : ''}`} />
                  <span>{isVideoPlaying ? 'PLAYING · 08 SEC' : 'FILM · 08 SEC'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
