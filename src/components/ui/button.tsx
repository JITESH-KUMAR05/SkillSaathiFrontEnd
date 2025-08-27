'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'floating' | 'agent'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  agent?: 'friend' | 'mentor' | 'interview'
  glow?: boolean
  loading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    agent,
    glow = false,
    loading = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'relative overflow-hidden font-semibold text-white transition-all duration-300 transform-gpu focus:outline-none focus:ring-2 focus:ring-electric-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-gradient-to-r from-electric-600 to-electric-500 hover:from-electric-500 hover:to-electric-400 hover:scale-105 hover:shadow-electric active:scale-95',
      secondary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 hover:scale-105 hover:shadow-emerald active:scale-95',
      glass: 'glass-medium backdrop-blur-16 hover:glass-heavy hover:scale-105 hover:shadow-glass',
      floating: 'bg-gradient-to-r from-dark-800 to-dark-700 hover:scale-110 hover:-translate-y-2 hover:shadow-floating animate-float',
      agent: agent === 'friend' 
        ? 'bg-gradient-friend hover:scale-105 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]'
        : agent === 'mentor'
        ? 'bg-gradient-mentor hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]'
        : 'bg-gradient-interview hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl'
    }
    
    const glowClasses = glow ? 'before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-r before:from-electric-600 before:to-electric-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20' : ''
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowClasses,
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {children}
        </span>
        
        {/* Particle effects for agent buttons */}
        {variant === 'agent' && (
          <>
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-particles" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-particles animation-delay-300" />
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-particles animation-delay-600" />
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
