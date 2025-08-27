import type { Config } from 'tailwindcss'
import { colors, shadows, borderRadius, typography, animations, spacing } from './src/lib/design-tokens'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors from our design system
      colors: {
        primary: colors.primary,
        electric: colors.electric,
        emerald: colors.emerald,
        coral: colors.coral,
        gold: colors.gold,
        dark: colors.dark,
        glass: {
          light: colors.glass.light,
          medium: colors.glass.medium,
          heavy: colors.glass.heavy,
          accent: colors.glass.accent,
        },
      },
      
      // Typography
      fontFamily: {
        sans: typography.fonts.primary.split(',').map(font => font.trim().replace(/'/g, '')),
        display: typography.fonts.display.split(',').map(font => font.trim().replace(/'/g, '')),
        mono: typography.fonts.code.split(',').map(font => font.trim().replace(/'/g, '')),
        hindi: typography.fonts.hindi.split(',').map(font => font.trim().replace(/'/g, '')),
      },
      
      fontSize: typography.sizes,
      fontWeight: typography.weights,
      
      // Spacing from design system
      spacing: spacing,
      
      // Border radius including organic shapes
      borderRadius: {
        ...borderRadius,
        'blob-1': borderRadius.organic.blob1,
        'blob-2': borderRadius.organic.blob2,
        'blob-3': borderRadius.organic.blob3,
      },
      
      // Advanced shadows
      boxShadow: {
        'glass': shadows.glass,
        'glow': shadows.glow,
        'electric': shadows.electric,
        'floating': shadows.floating,
        'neumorphic': shadows.neumorphic,
        'depth-sm': shadows.depth.sm,
        'depth': shadows.depth.md,
        'depth-lg': shadows.depth.lg,
        'depth-xl': shadows.depth.xl,
        'depth-2xl': shadows.depth['2xl'],
      },
      
      // Animation durations and easing
      transitionDuration: animations.duration,
      transitionTimingFunction: animations.easing,
      
      // Background gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)',
        'gradient-electric': 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #a855f7 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #06b6d4 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 50%, #f59e0b 100%)',
        'gradient-aurora': 'linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #10b981 50%, #f43f5e 75%, #fbbf24 100%)',
        'gradient-mesh': 'conic-gradient(from 0deg at 50% 50%, #6366f1, #a855f7, #10b981, #f43f5e, #fbbf24, #6366f1)',
        
        // Agent-specific gradients
        'gradient-friend': 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)',
        'gradient-mentor': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-interview': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      },
      
      // Backdrop blur utilities
      backdropBlur: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '32': '32px',
      },
      
      // Transform utilities
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
      },
      
      // Animation keyframes
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
          },
          '33%': { 
            transform: 'translateY(-10px) rotate(1deg)',
          },
          '66%': { 
            transform: 'translateY(-5px) rotate(-1deg)',
          },
        },
        
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
          },
        },
        
        'gradient-shift': {
          '0%': { 
            backgroundPosition: '0% 50%',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
          },
          '100%': { 
            backgroundPosition: '0% 50%',
          },
        },
        
        particles: {
          '0%': { 
            transform: 'translateY(0px) translateX(0px) rotate(0deg)',
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(-100vh) translateX(100px) rotate(360deg)',
            opacity: '0',
          },
        },
        
        morph: {
          '0%, 100%': { 
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          },
          '25%': { 
            borderRadius: '70% 30% 50% 50% / 60% 40% 60% 40%',
          },
          '50%': { 
            borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%',
          },
          '75%': { 
            borderRadius: '40% 60% 70% 30% / 70% 30% 30% 70%',
          },
        },
        
        typing: {
          '0%, 60%, 100%': { 
            transform: 'translateY(0)',
            opacity: '0.4',
          },
          '30%': { 
            transform: 'translateY(-10px)',
            opacity: '1',
          },
        },
        
        'matrix-rain': {
          '0%': { 
            transform: 'translateY(-100vh)',
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(100vh)',
            opacity: '0',
          },
        },
        
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      
      // Animation utilities
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'particles': 'particles 10s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 1s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'fade-in-delayed': 'fade-in 0.5s ease-out 0.2s both',
        'slide-in-delayed': 'slide-in 0.5s ease-out 0.3s both',
      },
      
      // Grid utilities
      gridTemplateColumns: {
        'auto-fill-xs': 'repeat(auto-fill, minmax(240px, 1fr))',
        'auto-fill-sm': 'repeat(auto-fill, minmax(280px, 1fr))',
        'auto-fill-md': 'repeat(auto-fill, minmax(320px, 1fr))',
        'auto-fill-lg': 'repeat(auto-fill, minmax(380px, 1fr))',
      },
    },
  },
  plugins: [
    // Plugin for glassmorphism utilities
    function({ addUtilities }: any) {
      addUtilities({
        '.glass-light': {
          'background': 'rgba(255, 255, 255, 0.08)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 8px 32px rgba(31, 38, 135, 0.37)',
        },
        '.glass-medium': {
          'background': 'rgba(255, 255, 255, 0.12)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
          'box-shadow': '0 8px 32px rgba(31, 38, 135, 0.4)',
        },
        '.glass-heavy': {
          'background': 'rgba(255, 255, 255, 0.16)',
          'backdrop-filter': 'blur(20px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px rgba(31, 38, 135, 0.5)',
        },
        '.glass-electric': {
          'background': 'rgba(99, 102, 241, 0.1)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(99, 102, 241, 0.2)',
          'box-shadow': '0 8px 32px rgba(99, 102, 241, 0.3)',
        },
        '.glass-emerald': {
          'background': 'rgba(16, 185, 129, 0.1)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(16, 185, 129, 0.2)',
          'box-shadow': '0 8px 32px rgba(16, 185, 129, 0.3)',
        },
        '.glass-coral': {
          'background': 'rgba(244, 63, 94, 0.1)',
          'backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(244, 63, 94, 0.2)',
          'box-shadow': '0 8px 32px rgba(244, 63, 94, 0.3)',
        },
      })
    },
    
    // Plugin for transform-gpu utility
    function({ addUtilities }: any) {
      addUtilities({
        '.transform-gpu': {
          'transform': 'translate3d(0, 0, 0)',
        },
      })
    },
  ],
}

export default config
