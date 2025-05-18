'use client'

import { Button } from '@/components/ui/Button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [rotating, setRotating] = useState(false)

  const toggleTheme = () => {
    setRotating(true)
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    setTimeout(() => setRotating(false), 0)
  }, [rotating])

  return (
    <Button
      onClick={toggleTheme}
      className="relative size-[2rem]"
      variant="ghost"
      size="lg"
    >
      <Sun
        className={`transition-transform duration-500 ${resolvedTheme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'
          } ${rotating ? 'rotate-[360deg]' : ''}`}
      />
      <Moon
        className={`absolute transition-transform duration-500 ${resolvedTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          } ${rotating ? 'rotate-[360deg]' : ''}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
