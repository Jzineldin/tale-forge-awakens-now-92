
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeaderVisibility } from '@/context/HeaderVisibilityContext';

const CinematicHero: React.FC = () => {
  const navigate = useNavigate();
  const { showHeader } = useHeaderVisibility();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleCreateAdventure = () => {
    showHeader();
    navigate('/adventure');
  };

  // Mouse following effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden">
      {/* Full-screen Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover cinematic-video"
      >
        <source src="https://cdn.midjourney.com/video/2766fe2d-24ca-4a21-a69e-11c9ba368fd6/0.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 surreal-overlay-1"></div>
      <div className="absolute inset-0 surreal-overlay-2"></div>
      <div className="absolute inset-0 surreal-vignette"></div>

      {/* Floating Geometric Shapes */}
      <div className="floating-shapes">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </div>

      {/* Particle System */}
      <div className="particle-system">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Lens Flare Effect */}
      <div ref={cursorRef} className="lens-flare"></div>

      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Tale Forge Title with Surreal Effects */}
        <div className="text-center mb-16 surreal-title-container">
          <div className="relative surreal-title-wrapper">
            <h1 className="surreal-title text-6xl md:text-8xl lg:text-9xl font-bold font-serif leading-tight">
              <span className="surreal-letter">T</span>
              <span className="surreal-letter">a</span>
              <span className="surreal-letter">l</span>
              <span className="surreal-letter">e</span>
              <span className="surreal-space"> </span>
              <span className="surreal-letter">F</span>
              <span className="surreal-letter">o</span>
              <span className="surreal-letter">r</span>
              <span className="surreal-letter">g</span>
              <span className="surreal-letter">e</span>
            </h1>
            
            {/* Ethereal Glow Behind Text */}
            <div className="ethereal-glow"></div>
            
            {/* Floating Sparkles Around Title */}
            <div className="title-sparkles">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`title-sparkle sparkle-${i + 1}`}></div>
              ))}
            </div>
          </div>
          
          {/* Surreal Tagline */}
          <div className="surreal-tagline-container">
            <p className="text-2xl md:text-4xl max-w-4xl mx-auto leading-relaxed surreal-tagline">
              Where imagination meets
              <span className="surreal-accent font-cursive mx-2" style={{fontStyle: 'italic'}}>
                infinite possibilities
              </span>
            </p>
          </div>
        </div>

        {/* Enhanced CTA with Liquid Effects */}
        <div className="flex flex-col sm:flex-row gap-6 surreal-cta-container">
          <Button
            onClick={handleCreateAdventure}
            className="surreal-cta-button group px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-500"
          >
            <div className="surreal-button-bg"></div>
            <div className="surreal-button-ripple"></div>
            <Sparkles className="mr-2 h-5 w-5 surreal-icon" />
            <span className="surreal-button-text">Create Your Adventure</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CinematicHero;
