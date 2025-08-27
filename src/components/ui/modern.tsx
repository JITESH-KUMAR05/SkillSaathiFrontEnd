/**
 * Modern UI Components Library
 * Reusable components with consistent styling and animations
 */

import React from 'react'
import { patterns } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

// Loading spinner component
export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={cn('animate-spin rounded-full border-2 border-white/20 border-t-white', sizeClasses[size], className)} />
  )
}

// Skeleton loader
export const Skeleton = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn('animate-pulse bg-white/10 rounded-lg shimmer', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

// Glass card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'elevated' | 'interactive'
  children: React.ReactNode
}

export const Card = ({ variant = 'glass', className = '', children, ...props }: CardProps) => {
  const variants = {
    glass: 'glass-surface',
    elevated: 'glass-elevated', 
    interactive: 'glass-interactive'
  }
  
  return (
    <div className={cn(variants[variant], 'rounded-2xl p-6', className)} {...props}>
      {children}
    </div>
  )
}

// Modern button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: LucideIcon
  children: React.ReactNode
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  icon: Icon, 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: patterns.button.primary.trim(),
    secondary: patterns.button.secondary.trim(),
    ghost: patterns.button.ghost.trim()
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base', 
    lg: 'px-8 py-3 text-lg'
  }
  
  return (
    <button
      className={cn(
        variants[variant], 
        sizes[size],
        'inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}

// Enhanced input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
}

export const Input = ({ label, error, icon: Icon, className = '', ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/80">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        )}
        <input
          className={cn(
            patterns.input.trim(),
            Icon && 'pl-10',
            error && 'border-red-400 focus:ring-red-400/50',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

// Navigation item component
interface NavItemProps {
  href?: string
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  badge?: string | number
}

export const NavItem = ({ href, icon: Icon, label, active = false, onClick, badge }: NavItemProps) => {
  const baseClasses = active ? patterns.navItemActive.trim() : patterns.navItem.trim()
  
  const content = (
    <>
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </>
  )
  
  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    )
  }
  
  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  )
}

// Status indicator
export const StatusIndicator = ({ 
  status, 
  label 
}: { 
  status: 'online' | 'offline' | 'busy' | 'away'
  label?: string 
}) => {
  const colors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400', 
    busy: 'bg-red-400',
    away: 'bg-yellow-400'
  }
  
  const animation = status === 'online' ? 'animate-pulse' : ''
  
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2.5 h-2.5 rounded-full', colors[status], animation)} />
      {label && <span className="text-sm text-white/60">{label}</span>}
    </div>
  )
}

// Badge component
export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md' 
}: { 
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
}) => {
  const variants = {
    default: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
    success: 'bg-green-500/20 text-green-200 border-green-400/30',
    warning: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30', 
    error: 'bg-red-500/20 text-red-200 border-red-400/30'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      variants[variant],
      sizes[size]
    )}>
      {children}
    </span>
  )
}

// Modal backdrop
export const Modal = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode 
}) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative z-10 max-w-lg w-full mx-4">
        <div className="glass-elevated rounded-2xl p-6 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}

// Progress bar
export const ProgressBar = ({ 
  value, 
  max = 100, 
  className = '' 
}: { 
  value: number
  max?: number
  className?: string 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn('w-full bg-white/10 rounded-full h-2', className)}>
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Tooltip component
export const Tooltip = ({ 
  children, 
  content 
}: { 
  children: React.ReactNode
  content: string 
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-sm text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  )
}
