import { useState, useEffect, useRef, useCallback } from 'react';
import './EditorialImageSlider.css';

export interface EditorialSlideItem {
  id: string;
  image: string;
  name: string;
  alt: string;
  number: string;
  badge?: string;
}

export interface EditorialImageSliderProps {
  items: EditorialSlideItem[];
  interval?: number;
  initialDelay?: number;
  direction?: 'to-right' | 'to-left';
  theme?: 'regular' | 'seasonal';
  showBadge?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function EditorialImageSlider({
  items,
  interval = 4400,
  initialDelay = 0,
  direction = 'to-right',
  theme = 'regular',
  showBadge = true,
  className = '',
  ariaLabel = 'Dessert collection gallery',
}: EditorialImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLabelSwapping, setIsLabelSwapping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload next image to ensure no blank frame or layout shift
  useEffect(() => {
    if (items.length > 1) {
      const nextIndex = (currentIndex + 1) % items.length;
      if (items[nextIndex]) {
        const img = new Image();
        img.src = items[nextIndex].image;
      }
    }
  }, [currentIndex, items]);

  const advanceSlide = useCallback(() => {
    if (items.length <= 1) return;

    setPreviousIndex(currentIndex);
    const nextIdx = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIdx);
    setIsTransitioning(true);
    setIsLabelSwapping(true);

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    if (labelTimerRef.current) {
      clearTimeout(labelTimerRef.current);
    }

    // Synchronize label & counter transition: swap at midpoint (450ms) of the 1000ms image transition
    labelTimerRef.current = setTimeout(() => {
      setDisplayIndex(nextIdx);
      setIsLabelSwapping(false);
    }, 450);

    // Complete slide transition at 1000ms
    transitionTimerRef.current = setTimeout(() => {
      setPreviousIndex(null);
      setIsTransitioning(false);
    }, 1000);
  }, [currentIndex, items.length]);

  useEffect(() => {
    if (isPaused || items.length <= 1) {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
      return;
    }

    if (initialDelay > 0) {
      initialDelayTimerRef.current = setTimeout(() => {
        advanceSlide();
        intervalTimerRef.current = setInterval(() => {
          advanceSlide();
        }, interval);
      }, initialDelay);
    } else {
      intervalTimerRef.current = setInterval(() => {
        advanceSlide();
      }, interval);
    }

    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
    };
  }, [advanceSlide, initialDelay, interval, isPaused, items.length]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
      }
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
      if (initialDelayTimerRef.current) {
        clearTimeout(initialDelayTimerRef.current);
      }
    };
  }, []);

  const currentItem = items[currentIndex];
  const previousItem = previousIndex !== null ? items[previousIndex] : null;
  const displayedItem = items[displayIndex] || currentItem;

  const currentCounter = (displayIndex + 1).toString().padStart(2, '0');
  const totalCounter = items.length.toString().padStart(2, '0');

  return (
    <div
      className={`editorial-slider-container ${theme} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
    >
      <div className="editorial-media-frame">
        {/* Inner Media Layer: Receives border-radius, overflow:hidden, and image clipping */}
        <div className="editorial-media-clip">
          {/* Outgoing Slide during transition */}
          {isTransitioning && previousItem && (
            <div
              className={`editorial-slide slide-outgoing dir-${direction}`}
              key={`outgoing-${previousItem.id}-${previousIndex}`}
              aria-hidden="true"
            >
              <img
                src={previousItem.image}
                alt=""
                className="editorial-slide-image"
                loading="eager"
              />
            </div>
          )}

          {/* Current / Incoming Slide */}
          <div
            className={`editorial-slide ${
              isTransitioning ? `slide-incoming dir-${direction}` : 'slide-static'
            }`}
            key={`current-${currentItem.id}-${currentIndex}`}
          >
            <img
              src={currentItem.image}
              alt={currentItem.alt}
              className="editorial-slide-image"
              loading="eager"
            />
          </div>
        </div>

        {/* Upper-Left Label: Outside the clip so it is never cropped by the curve, synchronized with image */}
        {showBadge && displayedItem.badge && (
          <div
            className={`editorial-media-label ${isLabelSwapping ? 'is-swapping' : ''}`}
            aria-hidden="true"
          >
            <span>{displayedItem.badge}</span>
          </div>
        )}

        {/* Lower-Right Image Counter: Outside the clip so it is never cropped, synchronized with image */}
        <div
          className={`editorial-media-counter ${isLabelSwapping ? 'is-swapping' : ''}`}
          aria-live="polite"
        >
          <span className="counter-current">{currentCounter}</span>
          <span className="counter-sep">/</span>
          <span className="counter-total">{totalCounter}</span>
        </div>
      </div>
    </div>
  );
}
