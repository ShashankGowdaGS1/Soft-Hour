import { useState, useRef } from 'react';
import type { DessertItem } from './types/dessert';
import Navigation from './components/layout/Navigation';
import MenuDrawer from './components/layout/MenuDrawer';
import LivingDessertModal from './components/media/LivingDessertModal';
import CustomCursor from './components/common/CustomCursor';
import Preloader from './components/common/Preloader';
import Hero from './sections/Hero';
import TasteManifesto from './sections/TasteManifesto';
import CollectionSelector from './sections/CollectionSelector';
import RegularCollection from './sections/RegularCollection';
import SeasonalCollection from './sections/SeasonalCollection';
import OriginNotes from './sections/OriginNotes';
import Craft from './sections/Craft';
import CounterTransition from './sections/CounterTransition';
import Footer from './sections/Footer';

export default function App() {
  const [selectedDessert, setSelectedDessert] = useState<DessertItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenVideo = (dessert: DessertItem) => {
    setSelectedDessert(dessert);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };

  const handleOpenMenuDrawer = () => {
    setIsMenuDrawerOpen(true);
  };

  const handleToggleMenuDrawer = () => {
    setIsMenuDrawerOpen((prev) => !prev);
  };

  const handleCloseMenuDrawer = () => {
    setIsMenuDrawerOpen(false);
  };

  return (
    <div className="app-container">
      {/* 11:00 AM Atelier Opening & Counter Preparation Preloader Curtain */}
      <Preloader />

      {/* Luxury Editorial Custom Cursor Pointer */}
      <CustomCursor />

      {/* Global Navigation */}
      <Navigation
        onOpenMenuDrawer={handleToggleMenuDrawer}
        isMenuDrawerOpen={isMenuDrawerOpen}
        menuButtonRef={menuButtonRef}
      />

      {/* Main Section Content with Art-Directed Rhythm */}
      <main id="main-content">
        {/* 01. Hero Section — photographic */}
        <Hero />

        {/* 02. Taste Manifesto — dark philosophy */}
        <TasteManifesto />

        {/* 03. Two Collections — split / light */}
        <CollectionSelector />

        {/* 04. Regular Collection — catalogue / editorial */}
        <RegularCollection />

        {/* 05. Seasonal Collection — expressive photographic runway */}
        <SeasonalCollection onSelectVideo={handleOpenVideo} />

        {/* 06. Origin Notes — ingredient editorial / darker accent */}
        <OriginNotes />

        {/* 07. Kitchen / Craft — human craft */}
        <Craft />

        {/* 08. Counter Transition — quiet typography */}
        <CounterTransition onOpenMenuDrawer={handleOpenMenuDrawer} />
      </main>

      {/* 18. Closing / Footer with Atelier Information */}
      <Footer onOpenMenuDrawer={handleOpenMenuDrawer} />

      {/* Interactive Right-Side Printed Dessert Menu Drawer */}
      <MenuDrawer
        isOpen={isMenuDrawerOpen}
        onClose={handleCloseMenuDrawer}
        triggerRef={menuButtonRef}
      />

      {/* 13. Living Dessert Video Lightbox (Seasonal) */}
      <LivingDessertModal
        isOpen={isVideoModalOpen}
        dessert={selectedDessert}
        onClose={handleCloseVideo}
      />
    </div>
  );
}
