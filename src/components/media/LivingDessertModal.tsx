import { useEffect, useRef, useState, useCallback } from 'react';
import type { DessertItem } from '../../types/dessert';
import './LivingDessertModal.css';

interface LivingDessertModalProps {
  isOpen: boolean;
  dessert: DessertItem | null;
  onClose: () => void;
}

export default function LivingDessertModal({ isOpen, dessert, onClose }: LivingDessertModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState<boolean>(false);

  // Lock/unlock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autoplay video when modal opens or dessert changes
  useEffect(() => {
    if (isOpen && videoRef.current && dessert) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser policy fallback: muted attempt
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().catch(() => {});
          }
        });
    }
  }, [isOpen, dessert]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  const handleReplay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => {
      setIsPlaying(true);
      setHasEnded(false);
    });
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !dessert) {
    return null;
  }

  return (
    <div
      className={`living-modal-backdrop ${isOpen ? 'is-open' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Living Dessert film for ${dessert.name}`}
    >
      <button
        type="button"
        className="living-modal-close"
        onClick={onClose}
        aria-label="Close video lightbox"
      >
        <span>✕</span> CLOSE [ESC]
      </button>

      <div className="living-modal-stage">
        {/* 9:16 Video Player Container */}
        <div className="living-video-container">
          <video
            ref={videoRef}
            src={dessert.video}
            className="living-video-player"
            playsInline
            muted={isMuted}
            preload="none"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onClick={togglePlay}
          />

          <div className="living-video-controls">
            {/* Progress line */}
            <div
              className="living-progress-bar"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="living-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="living-control-buttons">
              <button
                type="button"
                className="living-control-btn"
                onClick={hasEnded ? handleReplay : togglePlay}
                aria-label={hasEnded ? 'Replay video' : isPlaying ? 'Pause' : 'Play'}
              >
                {hasEnded ? '↺ REPLAY' : isPlaying ? '❚❚ PAUSE' : '▶ PLAY'}
              </button>

              <button
                type="button"
                className="living-control-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? 'SOUND OFF' : 'SOUND ON'}
              </button>
            </div>
          </div>
        </div>

        {/* Adjacent editorial details */}
        <div className="living-modal-details">
          <div className="living-badge">LIVING DESSERT · 08 SEC FILM</div>
          <div className="living-dessert-number">NO. {dessert.number} / {dessert.collection.toUpperCase()}</div>
          <h2 className="living-dessert-name">{dessert.name}</h2>
          <p className="living-dessert-notes">{dessert.flavorNotes}</p>
          <p className="living-dessert-desc">{dessert.description}</p>

          <div className="living-dessert-footer">
            <span className="living-dessert-price">{dessert.price}</span>
            <a
              href="#visit"
              className="living-modal-order-btn"
              onClick={onClose}
            >
              ORDER AT COUNTER <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
