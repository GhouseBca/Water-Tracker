'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function GoalPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [liters, setLiters] = useState('') // ❗ make it empty initially
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [reminder, setReminder] = useState('60')

  useEffect(() => {
    const name = localStorage.getItem('username')
    if (!name) {
      router.push('/login')
    } else {
      setUsername(name)

      const storedLiters = localStorage.getItem(`${name}_goalLiters`)
      if (storedLiters) {
        setLiters(storedLiters)
      }
    }
  }, [router])

  // Auto calculate water when weight is entered
  useEffect(() => {
    const w = parseFloat(weight)
    if (!isNaN(w) && w > 0) {
      const calculated = (w * 0.033).toFixed(2)
      setLiters(calculated)
    }
  }, [weight])

  const handleSubmit = () => {
    if (!liters || !reminder || !startTime || !endTime) return

    localStorage.setItem(`${username}_goalLiters`, liters)
    localStorage.setItem(`${username}_reminderInterval`, reminder)
    localStorage.setItem(`${username}_startTime`, startTime)
    localStorage.setItem(`${username}_endTime`, endTime)

    if (!localStorage.getItem(`${username}_currentDrank`)) {
      localStorage.setItem(`${username}_currentDrank`, '0')
    }
    if (!localStorage.getItem(`${username}_drinkLogs`)) {
      localStorage.setItem(`${username}_drinkLogs`, JSON.stringify([]))
    }

    router.push('/home')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800">Welcome {username} 👋</h1>
        <h2 className="text-2xl font-bold text-blue-700 mt-1">Set Your Water Goal 💧</h2>
      </div>

      {/* Optional inputs */}
    
      <div className="flex flex-col gap-2">
        <Label>Height (cm) <span className="text-gray-400 text-sm">(optional)</span></Label>
        <Input
          type="number"
          min={1}
          placeholder="Enter your height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-72"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Weight (kg) <span className="text-gray-400 text-sm">(optional)</span></Label>
        <Input
          type="number"
          min={1}
          placeholder="Enter your weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-72"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Total Water Goal (in Liters)</Label>
        <Input
          type="number"
          min={1}
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          placeholder="E.g., 2.5"
          className="w-72"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Set Time Range</Label>
        <div className="flex gap-4">
          <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-30" />
          <span className="mt-2">to</span>
          <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-30" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Reminder Interval</Label>
        <Select value={reminder} onValueChange={(val) => setReminder(val)}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 min</SelectItem>
            <SelectItem value="30">30 min</SelectItem>
            <SelectItem value="45">45 min</SelectItem>
            <SelectItem value="60">1 Hour</SelectItem>
            <SelectItem value="90">1.5 Hours</SelectItem>
            <SelectItem value="120">2 Hours</SelectItem>
            <SelectItem value="150">2.5 Hours</SelectItem>
            <SelectItem value="180">3 Hours</SelectItem>
            <SelectItem value="210">3.5 Hours</SelectItem>
            <SelectItem value="240">4 Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} className="w-72">
        Save & Start
      </Button>
    </div>
  )
}
