export default function GlobalStyles() {
  return (
    <style jsx>{`
      @keyframes milkyWayFlow {
        0%, 100% { 
          transform: rotate(0deg) scale(1);
          opacity: 0.1;
        }
        50% { 
          transform: rotate(2deg) scale(1.05);
          opacity: 0.15;
        }
      }
      @media (prefers-color-scheme: dark) {
        @keyframes milkyWayFlow {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 0.2;
          }
          50% { 
            transform: rotate(2deg) scale(1.05);
            opacity: 0.25;
          }
        }
      }
      @keyframes starTwinkle {
        0%, 100% { 
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% { 
          opacity: 1;
          transform: scale(1.2);
        }
      }
      @keyframes cloudDrift {
        0% { 
          transform: translateX(-100px) translateY(0px) rotate(0deg);
        }
        25% { 
          transform: translateX(calc(100vw + 100px)) translateY(-20px) rotate(90deg);
        }
        50% { 
          transform: translateX(calc(100vw + 200px)) translateY(20px) rotate(180deg);
        }
        75% { 
          transform: translateX(calc(100vw + 100px)) translateY(-10px) rotate(270deg);
        }
        100% { 
          transform: translateX(-100px) translateY(0px) rotate(360deg);
        }
      }
      @keyframes parallaxStar1 {
        0% { 
          transform: translateX(-100%) translateY(0%);
        }
        100% { 
          transform: translateX(calc(100vw + 100%)) translateY(-20%);
        }
      }
      @keyframes parallaxStar2 {
        0% { 
          transform: translateX(-100%) translateY(10%);
        }
        100% { 
          transform: translateX(calc(100vw + 100%)) translateY(-10%);
        }
      }
      @keyframes parallaxStar3 {
        0% { 
          transform: translateX(-100%) translateY(-5%);
        }
        100% { 
          transform: translateX(calc(100vw + 100%)) translateY(15%);
        }
      }
      @keyframes parallaxNebula {
        0% { 
          transform: translateX(-50%) translateY(0%) rotate(0deg);
        }
        100% { 
          transform: translateX(calc(100vw + 50%)) translateY(-5%) rotate(360deg);
        }
      }
      @keyframes rippleExpand {
        0% { 
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.8;
        }
        50% {
          opacity: 0.4;
        }
        100% { 
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
      }
      @keyframes ripplePulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.3;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.1;
        }
      }
      @keyframes centralGlow {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.9;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 1;
        }
      }
      @keyframes particleFloat {
        0%, 100% { 
          opacity: 0.7;
          transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-20px) scale(1);
        }
        50% { 
          opacity: 1;
          transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-30px) scale(1.2);
        }
      }
      @keyframes moonRayExpand {
        0% { 
          transform: translate(-50%, -50%) scale(0.3);
          opacity: 0.4;
        }
        50% {
          opacity: 0.2;
        }
        100% { 
          transform: translate(-50%, -50%) scale(1);
          opacity: 0;
        }
      }
      @keyframes moonRayPulse {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0.25;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.15;
        }
      }
      @keyframes moonHaloGlow {
        0%, 100% { 
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.4;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.05);
          opacity: 0.6;
        }
      }
      @keyframes moonbeamFloat {
        0%, 100% { 
          opacity: 0.6;
          transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-25px) scale(1);
        }
        50% { 
          opacity: 0.9;
          transform: translate(-50%, -50%) rotate(var(--rotation, 0deg)) translateY(-35px) scale(1.3);
        }
      }
      @keyframes waterShimmer {
        0%, 100% { 
          transform: translateX(-100%);
          opacity: 0;
        }
        50% { 
          transform: translateX(100%);
          opacity: 0.8;
        }
      }
      @keyframes modal {
        0% {
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      @keyframes fadeIn {
        0% {
          opacity: 0;
          transform: translateX(20px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      @keyframes scaleUp {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
      .animate-scale-up {
        animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
    `}</style>
  );
}