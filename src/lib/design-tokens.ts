/**
 * Advanced Design System for AI Multi-Agent Platform
 * Cutting-edge, futuristic design with glassmorphism and 3D effects
 */

// Core Color Palette - Deep gradients with electric accents
export const colors = {
  // Primary gradients - Midnight blue to electric purple
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Electric purple spectrum
  electric: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  
  // Emerald to teal gradients
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  
  // Warm accent colors
  coral: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
  },
  
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Dark mode optimized grays
  dark: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Agent-specific themes
  agents: {
    friend: {
      primary: '#f43f5e', // Coral
      secondary: '#fbbf24', // Gold
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
      glow: 'rgba(244, 63, 94, 0.3)',
    },
    mentor: {
      primary: '#10b981', // Emerald
      secondary: '#06b6d4', // Cyan
      gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    interview: {
      primary: '#6366f1', // Indigo
      secondary: '#a855f7', // Purple
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      glow: 'rgba(99, 102, 241, 0.3)',
    },
  },
  
  // Glassmorphism backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    heavy: 'rgba(255, 255, 255, 0.16)',
    accent: 'rgba(99, 102, 241, 0.1)',
  },
}

// Advanced Gradients
export const gradients = {
  primary: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
  electric: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #a855f7 100%)',
  emerald: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #06b6d4 100%)',
  sunset: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 50%, #f59e0b 100%)',
  aurora: 'linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #10b981 50%, #f43f5e 75%, #fbbf24 100%)',
  mesh: 'conic-gradient(from 0deg at 50% 50%, #6366f1, #a855f7, #10b981, #f43f5e, #fbbf24, #6366f1)',
}

// 3D and Advanced Shadows
export const shadows = {
  glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
  glow: '0 0 40px rgba(99, 102, 241, 0.4)',
  electric: '0 0 60px rgba(168, 85, 247, 0.5)',
  floating: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
  neumorphic: 'inset 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px rgba(255, 255, 255, 0.1)',
  depth: {
    sm: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  },
}

// Typography System
export const typography = {
  fonts: {
    primary: "'Inter', 'Segoe UI', system-ui, sans-serif",
    display: "'Space Grotesk', 'Inter', sans-serif",
    code: "'JetBrains Mono', 'Fira Code', monospace",
    hindi: "'Noto Sans Devanagari', 'Inter', sans-serif",
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
}

// Advanced Animation System
export const animations = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    back: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  keyframes: {
    // Floating animation
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(-5px) rotate(-1deg); }
      }
    `,
    
    // Pulse glow effect
    pulseGlow: `
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
      }
    `,
    
    // Gradient shift
    gradientShift: `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    
    // Particle movement
    particles: `
      @keyframes particles {
        0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-100vh) translateX(100px) rotate(360deg); opacity: 0; }
      }
    `,
    
    // Morphing shapes
    morph: `
      @keyframes morph {
        0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        25% { border-radius: 70% 30% 50% 50% / 60% 40% 60% 40%; }
        50% { border-radius: 50% 50% 30% 70% / 40% 60% 40% 60%; }
        75% { border-radius: 40% 60% 70% 30% / 70% 30% 30% 70%; }
      }
    `,
    
    // Typing indicator
    typing: `
      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-10px); opacity: 1; }
      }
    `,
    
    // Matrix rain effect
    matrixRain: `
      @keyframes matrixRain {
        0% { transform: translateY(-100vh); opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
    `,
  },
}

// Spacing and Layout
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
}

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  default: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
  
  // Organic shapes
  organic: {
    blob1: '30% 70% 70% 30% / 30% 30% 70% 70%',
    blob2: '70% 30% 50% 50% / 60% 40% 60% 40%',
    blob3: '50% 50% 30% 70% / 40% 60% 40% 60%',
  },
}

// Glassmorphism Styles
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  },
  
  medium: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.4)',
  },
  
  heavy: {
    background: 'rgba(255, 255, 255, 0.16)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.5)',
  },
  
  colored: {
    electric: {
      background: 'rgba(99, 102, 241, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
    },
    
    emerald: {
      background: 'rgba(16, 185, 129, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
    },
    
    coral: {
      background: 'rgba(244, 63, 94, 0.1)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(244, 63, 94, 0.2)',
      boxShadow: '0 8px 32px rgba(244, 63, 94, 0.3)',
    },
  },
}

// Component Patterns
export const patterns = {
  button: {
    primary: {
      base: 'relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform-gpu',
      background: 'bg-gradient-to-r from-electric-600 to-electric-500',
      hover: 'hover:scale-105 hover:shadow-electric active:scale-95',
      glow: 'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-electric-600 before:to-electric-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20',
    },
    
    glass: {
      base: 'relative px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 backdrop-blur-16',
      background: 'bg-white/10 border border-white/20',
      hover: 'hover:bg-white/20 hover:scale-105 hover:shadow-glass',
      glow: 'hover:shadow-glow',
    },
    
    floating: {
      base: 'relative px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-500 transform-gpu',
      background: 'bg-gradient-to-r from-dark-800 to-dark-700',
      hover: 'hover:scale-110 hover:-translate-y-2 hover:shadow-floating',
      animation: 'animate-float',
    },
  },
  
  card: {
    glass: {
      base: 'relative rounded-2xl backdrop-blur-16 transition-all duration-300 transform-gpu',
      background: 'bg-white/8 border border-white/10',
      hover: 'hover:bg-white/12 hover:scale-102 hover:shadow-glass',
      glow: 'hover:shadow-glow',
    },
    
    floating: {
      base: 'relative rounded-3xl transition-all duration-500 transform-gpu',
      background: 'bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-20',
      hover: 'hover:scale-105 hover:-translate-y-4 hover:shadow-floating',
      animation: 'animate-float',
    },
    
    neumorphic: {
      base: 'relative rounded-2xl transition-all duration-300',
      background: 'bg-dark-800',
      shadow: 'shadow-neumorphic',
      hover: 'hover:shadow-glow',
    },
  },
  
  input: {
    glass: {
      base: 'w-full px-4 py-3 rounded-xl backdrop-blur-16 transition-all duration-300 text-white placeholder-white/50',
      background: 'bg-white/8 border border-white/20',
      focus: 'focus:bg-white/12 focus:border-electric-500 focus:shadow-glow focus:outline-none',
    },
    
    floating: {
      base: 'w-full px-4 py-3 rounded-xl transition-all duration-300 text-white placeholder-white/50 transform-gpu',
      background: 'bg-dark-800/80 border border-dark-600',
      focus: 'focus:scale-105 focus:bg-dark-700/80 focus:border-electric-500 focus:shadow-electric focus:outline-none',
    },
  },
}

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
}

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

export default {
  colors,
  gradients,
  shadows,
  typography,
  animations,
  spacing,
  borderRadius,
  glassmorphism,
  patterns,
  breakpoints,
  zIndex,
}
