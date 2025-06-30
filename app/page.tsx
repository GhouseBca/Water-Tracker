'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (!name.trim()) return

    const savedName = localStorage.getItem('username')

    // If the user typed same as stored name and has a goal
    if (savedName === name && localStorage.getItem(`${name}_goalLiters`)) {
      router.push('/home')
    } else {
      // new user OR existing user without goal
      localStorage.setItem('username', name)
      router.push('/goal')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-50">
      <h1 className="text-2xl font-bold">Welcome! 👋</h1>
      <p className="text-gray-600">Enter your name to continue</p>
      <Input
        placeholder="Enter your name"
        className="w-72"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleLogin} className="w-72">
        Continue
      </Button>
    </div>
  )
}
