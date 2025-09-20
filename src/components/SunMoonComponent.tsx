'use client';

import React from 'react';

interface SunMoonComponentProps {
  isClient: boolean;
  currentTime: Date | null;
}

export default function SunMoonComponent({ isClient, currentTime }: SunMoonComponentProps) {
  return (
    <>
      {/* Enhanced Sun/Moon with Large Circular Rays - Top Right */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="relative w-40 h-40">
          
          {/* Large circular rays - outermost */}
          {isClient && currentTime && Array.from({ length: 5 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`ray-large-${i}`}
                className="absolute rounded-full border opacity-20"
                style={{
                  width: `${(i + 3) * 50}px`,
                  height: `${(i + 3) * 50}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderColor: isDaytime 
                    ? 'rgba(251, 191, 36, 0.4)' 
                    : 'rgba(191, 219, 254, 0.4)',
                  borderWidth: '1px',
                  animation: `moonRayExpand ${5 + i * 1}s ease-out infinite`,
                  animationDelay: `${i * 0.8}s`
                }}
              />
            );
          })}
          
          {/* Medium circular rays with gradient */}
          {isClient && currentTime && Array.from({ length: 4 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`ray-medium-${i}`}
                className="absolute rounded-full opacity-25"
                style={{
                  width: `${(i + 2) * 40}px`,
                  height: `${(i + 2) * 40}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isDaytime
                    ? `radial-gradient(circle, rgba(255, 237, 117, ${0.2 - i * 0.02}) 0%, rgba(251, 191, 36, ${0.15 - i * 0.02}) 40%, transparent 80%)`
                    : `radial-gradient(circle, rgba(219, 234, 254, ${0.15 - i * 0.02}) 0%, rgba(147, 197, 253, ${0.1 - i * 0.02}) 40%, transparent 80%)`,
                  animation: `moonRayPulse ${4 + i * 0.7}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            );
          })}
          
          {/* Inner sunlight/moonlight halos */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div 
                className="absolute rounded-full opacity-40"
                style={{
                  width: '80px',
                  height: '80px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isDaytime
                    ? 'radial-gradient(circle, rgba(255, 237, 117, 0.4) 0%, rgba(251, 191, 36, 0.3) 30%, rgba(245, 158, 11, 0.2) 60%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(191, 219, 254, 0.3) 0%, rgba(219, 234, 254, 0.2) 30%, rgba(147, 197, 253, 0.1) 60%, transparent 100%)',
                  animation: 'moonHaloGlow 6s ease-in-out infinite'
                }}
              />
            );
          })()}
          
          {/* Sun/Moon body - enhanced size */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return isDaytime ? (
              /* Sun */
              <div 
                className="absolute w-12 h-12 bg-gradient-to-bl from-yellow-300 to-orange-400 rounded-full shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 25px rgba(251, 191, 36, 0.6), inset -1px -1px 2px rgba(180, 83, 9, 0.2)'
                }}
              >
                {/* Sun rays inside */}
                <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-100/60 rounded-full"></div>
                <div className="absolute top-2 right-1 w-1 h-1 bg-yellow-100/40 rounded-full"></div>
                <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-yellow-100/50 rounded-full"></div>
                <div className="w-full h-full bg-gradient-to-tr from-yellow-100/50 via-transparent to-transparent rounded-full opacity-80"></div>
              </div>
            ) : (
              /* Moon */
              <div 
                className="absolute w-12 h-12 bg-gradient-to-bl from-blue-100 to-blue-200 rounded-full shadow-lg"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 20px rgba(191, 219, 254, 0.5), inset -2px -2px 4px rgba(100, 116, 139, 0.3)'
                }}
              >
                {/* Moon crescent shadow */}
                <div className="absolute top-1 right-1 w-8 h-8 bg-gray-300/40 rounded-full"></div>
                <div className="w-full h-full bg-gradient-to-tr from-blue-50 via-transparent to-transparent rounded-full opacity-80"></div>
              </div>
            );
          })()}
          
          {/* Floating sunbeam/moonbeam particles */}
          {isClient && currentTime && Array.from({ length: 12 }, (_, i) => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            return (
              <div
                key={`beam-${i}`}
                className="absolute w-1 h-1 rounded-full opacity-60"
                style={{
                  background: isDaytime 
                    ? (i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#fed75b' : '#f59e0b')
                    : (i % 3 === 0 ? '#bfdbfe' : i % 3 === 1 ? '#dbeafe' : '#93c5fd'),
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${25 + i * 3}px)`,
                  animation: `moonbeamFloat ${3 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            );
          })}
          
          {/* Distant twinkling stars - only visible at night */}
          {isClient && currentTime && (() => {
            const hour = currentTime.getHours();
            const isDaytime = hour >= 6 && hour < 18;
            
            // Only show stars at night
            if (isDaytime) return null;
            
            return Array.from({ length: 8 }, (_, i) => (
              <div 
                key={`twinkle-${i}`}
                className="absolute text-blue-200 opacity-70"
                style={{
                  fontSize: `${((i * 17) % 80 + 60) / 10}px`,
                  top: `${((i * 23) % 80 + 10)}%`,
                  left: `${((i * 29) % 80 + 10)}%`,
                  animation: `starTwinkle ${((i * 13) % 30 + 20) / 10}s ease-in-out infinite`,
                  animationDelay: `${((i * 11) % 40) / 10}s`
                }}
              >
                {i % 4 === 0 ? '✦' : i % 4 === 1 ? '✧' : i % 4 === 2 ? '⋆' : '✩'}
              </div>
            ));
          })()}
        </div>
      </div>
    </>
  );
}