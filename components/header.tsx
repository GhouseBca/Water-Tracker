// components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [username, setUsername] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('username')
    if (name) {
      setUsername(name)
    }
  }, [])

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-blue-100 dark:bg-gray-900 shadow-md">
      <h1 className="text-xl font-bold text-blue-900 dark:text-white">💧 Drink Water Reminder</h1>
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-700 dark:text-white">Hi, {username}</p>
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(val) => setTheme(val ? 'dark' : 'light')}
        />
      </div>
    </header>
  )
}
