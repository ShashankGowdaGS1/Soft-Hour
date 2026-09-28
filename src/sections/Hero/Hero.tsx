import { useState, useEffect, useRef, useCallback } from 'react';
import heroMasterImg from '../../assets/images/hero/13-hero-dark-chocolate-mousse.png';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth lerp physics refs
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Scroll tracking for content parallax & scroll-driven motion
  const handleScroll = useCallback(() => {
    if (!heroRef.current) return;
    const scrollY = window.scrollY;
    const heroHeight = heroRef.current.offsetHeight || 800;

    if (scrollY <= heroHeight * 1.5) {
      const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));
      heroRef.current.style.setProperty('--scroll-y', `${scrollY}px`);
      heroRef.current.style.setProperty('--scroll-progress', `${progress}`);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Cursor physics animation loop (LERP for ultra-smooth 60/120fps motion)
  const updateCursorPhysics = useCallback(() => {
    function animateFrame() {
      if (!heroRef.current) return;

      const lerpFactor = 0.075;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      const curX = currentPos.current.x;
      const curY = currentPos.current.y;

      // 3D rotations & translations for background image
      const tiltX = -curY * 6.5; // deg
      const tiltY = curX * 8.5;  // deg
      const panX = curX * 18;    // px
      const panY = curY * 12;    // px

      // Specular light coordinates on chocolate glaze
      const lightX = 55 + curX * 22;
      const lightY = 48 + curY * 22;

      heroRef.current.style.setProperty('--mouse-tilt-x', `${tiltX.toFixed(2)}deg`);
      heroRef.current.style.setProperty('--mouse-tilt-y', `${tiltY.toFixed(2)}deg`);
      heroRef.current.style.setProperty('--mouse-pan-x', `${panX.toFixed(2)}px`);
      heroRef.current.style.setProperty('--mouse-pan-y', `${panY.toFixed(2)}px`);
      heroRef.current.style.setProperty('--light-x', `${lightX.toFixed(1)}%`);
      heroRef.current.style.setProperty('--light-y', `${lightY.toFixed(1)}%`);

      const distance = Math.hypot(targetPos.current.x - curX, targetPos.current.y - curY);
      if (distance > 0.0008 || isHovered) {
        rafId.current = requestAnimationFrame(animateFrame);
      } else {
        rafId.current = null;
      }
    }

    animateFrame();
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    targetPos.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCursorPhysics);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCursorPhysics);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetPos.current = { x: 0, y: 0 };
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCursorPhysics);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={`hero-section ${isHovered ? 'is-interactive' : ''}`}
      aria-label="Hero Introduction"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-bleed Luxury Campaign Master Photography with Cursor Tilt & Specular Sheen */}
      <div className="hero-visual-frame" aria-hidden="true">
        <img
          src={heroMasterImg}
          alt="Soft Hour signature Dark Chocolate Mousse with Guérande sea salt flakes"
          className="hero-master-image"
          loading="eager"
          fetchPriority="high"
        />
        {/* Cursor Interactive Specular Glaze Light Sheen */}
        <div className="hero-glaze-specular" />
      </div>

      {/* Campaign Editorial Narrative Placed in Natural Left Negative Space */}
      <div className="container hero-container">
        <div className="hero-editorial-composition">
          {/* Main Headline with Scroll Parallax */}
          <h1 className="hero-display-title">
            <span className="hero-word hero-word-save">SAVE</span>
            <span className="hero-word hero-word-room">ROOM</span>
          </h1>

          {/* Italic Emotional Subline */}
          <p className="hero-emotional-line">
            <em>for something extraordinary.</em>
          </p>

          {/* Secondary Tasting Description */}
          <p className="hero-curated-description">
            A velvet 70% single-estate dark cacao mousse resting upon a crisp cocoa feuilletine base, crowned with hand-harvested Guérande sea salt flakes.
          </p>

          {/* Restrained Editorial CTA */}
          <div className="hero-cta-wrapper">
            <a href="#regular" className="hero-editorial-cta">
              <span className="cta-link-text">EXPLORE THE COUNTER</span>
              <span className="cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
