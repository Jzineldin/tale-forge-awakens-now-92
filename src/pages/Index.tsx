
import React from 'react';
import CinematicLanding from '@/components/home/CinematicLanding';
import ForgeStepsSection from '@/components/home/ForgeStepsSection';

const Index = () => {
  console.log('Index component: Rendering cinematic landing page');

  return (
    <div className="main-page-container-with-video-bg relative min-h-screen w-full">
      {/* Single video background container wrapping everything */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        style={{ filter: 'contrast(1.1) saturate(1.2)' }}
      >
        <source src="https://cdn.midjourney.com/video/e44f0881-cc76-4255-9301-0f3bb45896de/3.mp4" type="video/mp4" />
      </video>

      {/* Hero content area */}
      <section className="hero-content-area relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-8">
        <CinematicLanding />
      </section>

      {/* Features section - flows naturally below hero */}
      <section className="features-section relative z-10">
        <ForgeStepsSection />
      </section>
    </div>
  );
};

export default Index;
