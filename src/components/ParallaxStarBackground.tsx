'use client';

import React from 'react';

const ParallaxStarBackground: React.FC = () => {
  return (
    <>
      {/* Parallax Star Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Star Layer 1 - Slow moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar1 120s linear infinite' }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={`star1-${i}`}
              className="absolute text-white opacity-20 dark:opacity-40"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 23) % 100}%`,
                fontSize: `${((i * 13) % 20 + 10) / 10}px`,
                animation: `starTwinkle ${((i * 17) % 40 + 30) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 11) % 60) / 10}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>
        
        {/* Star Layer 2 - Medium moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar2 80s linear infinite' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`star2-${i}`}
              className="absolute text-blue-200 opacity-30 dark:opacity-50"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 29) % 100}%`,
                fontSize: `${((i * 19) % 30 + 15) / 10}px`,
                animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 7) % 40) / 10}s`
              }}
            >
              ⋆
            </div>
          ))}
        </div>
        
        {/* Star Layer 3 - Fast moving */}
        <div className="absolute inset-0" style={{ animation: 'parallaxStar3 40s linear infinite' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`star3-${i}`}
              className="absolute text-yellow-200 opacity-40 dark:opacity-60"
              style={{
                left: `${(i * 43) % 100}%`,
                top: `${(i * 31) % 100}%`,
                fontSize: `${((i * 21) % 20 + 20) / 10}px`,
                animation: `starTwinkle ${((i * 11) % 20 + 10) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 5) % 30) / 10}s`
              }}
            >
              ✧
            </div>
          ))}
        </div>
        
        {/* Distant nebula clouds */}
        <div className="absolute inset-0" style={{ animation: 'parallaxNebula 200s linear infinite' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full opacity-5 dark:opacity-10"
              style={{
                width: `${((i * 37) % 300 + 200)}px`,
                height: `${((i * 23) % 150 + 100)}px`,
                left: `${(i * 47) % 100}%`,
                top: `${(i * 29) % 100}%`,
                background: `radial-gradient(ellipse, rgba(${(i % 2 === 0) ? '147, 197, 253' : '196, 165, 255'}, 0.3) 0%, transparent 70%)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Milky Way Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Milky Way Galaxy */}
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{
            background: `
              radial-gradient(ellipse 800px 200px at 30% 20%, 
                rgba(147, 197, 253, 0.3) 0%, 
                rgba(191, 219, 254, 0.2) 20%, 
                transparent 70%),
              radial-gradient(ellipse 600px 150px at 70% 80%, 
                rgba(196, 165, 255, 0.2) 0%, 
                rgba(221, 214, 254, 0.15) 30%, 
                transparent 70%),
              radial-gradient(ellipse 1000px 100px at 50% 50%, 
                rgba(253, 230, 138, 0.1) 0%, 
                rgba(254, 240, 138, 0.08) 40%, 
                transparent 80%)
            `,
            animation: 'milkyWayFlow 60s ease-in-out infinite'
          }}
        />
        
        {/* Floating Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-60"
              style={{
                left: `${(i * 39) % 100}%`,
                top: `${(i * 31) % 100}%`,
                fontSize: `${((i * 17) % 30 + 10) / 10}px`,
                animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                animationDelay: `${((i * 11) % 50) / 10}s`
              }}
            >
              ✦
            </div>
          ))}
        </div>

        {/* Moving Dust Clouds */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-5 dark:opacity-10"
              style={{
                width: `${((i * 29) % 200 + 100)}px`,
                height: `${((i * 19) % 100 + 50)}px`,
                left: `${(i * 41) % 100}%`,
                top: `${(i * 33) % 100}%`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                animation: `cloudDrift ${((i * 23) % 40 + 20)}s linear infinite`,
                animationDelay: `${((i * 7) % 100) / 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ParallaxStarBackground;