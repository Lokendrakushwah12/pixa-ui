'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './ui/Button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setIsRotating(true)
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

    setTimeout(() => setIsRotating(false), 10)
  }

  if (!mounted) {
    return (
      <Button
        className="relative size-8 p-0"
        variant="ghost"
        size="sm"
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      onClick={toggleTheme}
      className="relative size-8 p-0"
      variant="ghost"
      size="sm"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <Sun
        className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-500 rotate-0 ease-in-out ${isDark
          ? 'scale-0 opacity-0'
          : 'scale-100 opacity-100'
          } ${isRotating ? 'rotate-[360deg]' : ''}`}
      />
      <Moon
        className={`absolute inset-0 m-auto h-4 w-4 transition-all duration-500 rotate-0 ease-in-out ${isDark
          ? 'scale-100 opacity-100'
          : 'scale-0 opacity-0'
          } ${isRotating ? 'rotate-[360deg]' : ''}`}
      />
    </Button>
  )
}