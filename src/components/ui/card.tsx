'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'floating' | 'neumorphic' | 'agent'
  agent?: 'friend' | 'mentor' | 'interview'
  interactive?: boolean
  glow?: boolean
  morphing?: boolean
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'glass', 
    agent,
    interactive = false,
    glow = false,
    morphing = false,
    children,
    ...props 
  }, ref) => {
    const baseClasses = 'relative transition-all duration-300 transform-gpu'
    
    const variants = {
      glass: 'glass-light backdrop-blur-16 rounded-2xl p-6',
      floating: 'bg-gradient-to-br from-dark-800/80 to-dark-900/80 backdrop-blur-20 rounded-3xl p-6 animate-float hover:scale-105 hover:-translate-y-4 hover:shadow-floating',
      neumorphic: 'bg-dark-800 rounded-2xl p-6 shadow-neumorphic hover:shadow-glow',
      agent: agent === 'friend' 
        ? 'glass-coral backdrop-blur-16 rounded-2xl p-6 border-coral-500/20'
        : agent === 'mentor'
        ? 'glass-emerald backdrop-blur-16 rounded-2xl p-6 border-emerald-500/20'
        : 'glass-electric backdrop-blur-16 rounded-2xl p-6 border-electric-500/20'
    }
    
    const interactiveClasses = interactive 
      ? 'cursor-pointer hover:scale-102 hover:shadow-glass hover:glass-medium active:scale-98' 
      : ''
    
    const glowClasses = glow 
      ? agent === 'friend'
        ? 'hover:shadow-[0_0_40px_rgba(244,63,94,0.4)]'
        : agent === 'mentor'
        ? 'hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]'
        : 'hover:shadow-glow'
      : ''
    
    const morphingClasses = morphing ? 'morph-shape' : ''
    
    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          interactiveClasses,
          glowClasses,
          morphingClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect for interactive cards */}
        {interactive && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Floating particles for agent cards */}
        {variant === 'agent' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-current opacity-20 rounded-full animate-particles" />
            <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-current opacity-30 rounded-full animate-particles animation-delay-500" />
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-current opacity-15 rounded-full animate-particles animation-delay-1000" />
          </div>
        )}
        
        {/* Glow border effect */}
        {glow && (
          <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-electric-500/20 via-electric-400/20 to-electric-500/20 opacity-0 transition-opacity duration-300 hover:opacity-100 blur-sm -z-10" />
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Title Component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  gradient?: boolean
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, gradient = false, children, ...props }, ref) => {
    const gradientClasses = gradient ? 'gradient-text' : 'text-white'
    
    return (
      <h3
        className={cn(
          'font-display text-2xl font-semibold leading-none tracking-tight',
          gradientClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'

// Card Description Component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('text-white/70 text-sm leading-relaxed', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('pb-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center pt-4 border-t border-white/10', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
}
