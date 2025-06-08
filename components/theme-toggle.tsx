'use client'

import { useTheme } from 'next-themes'
import { ThemeToggleIcon } from './icons'
import { Button } from './ui/Button'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <Button
      data-slot="button"
      onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      className="relative size-8 p-0"
      variant="ghost"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <ThemeToggleIcon />
    </Button>
  )
}