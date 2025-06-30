'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

export default function HomePage() {
  const router = useRouter()
  const [goalLiters, setGoalLiters] = useState(2)
  const [drankLiters, setDrankLiters] = useState(0)
  const [progress, setProgress] = useState(0)
  const [nextReminder, setNextReminder] = useState(0)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('username')
    if (!user) {
      router.push('/login')
      return
    }
    setUsername(user)

    const goal = Number(localStorage.getItem(`${user}_goalLiters`))
    const drank = Number(localStorage.getItem(`${user}_currentDrank`))
    const interval = Number(localStorage.getItem(`${user}_reminderInterval`))

    if (!goal || isNaN(goal)) {
      router.push('/goal')
      return
    }

    setGoalLiters(goal)
    setDrankLiters(isNaN(drank) ? 0 : drank)
    setProgress((drank / goal) * 100)
    setNextReminder((isNaN(interval) ? 60 : interval) * 60)

    const countdown = setInterval(() => {
      setNextReminder((prev) => {
        if (prev === 1) {
          toast('💧 Time to drink water!')
          return (isNaN(interval) ? 60 : interval) * 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [router])

  const handleAddWater = (amount: number) => {
    if (drankLiters >= goalLiters) {
      toast('🎉 Goal already reached!')
      return
    }

    const newDrank = Math.min(drankLiters + amount, goalLiters)
    setDrankLiters(newDrank)
    setProgress((newDrank / goalLiters) * 100)

    localStorage.setItem(`${username}_currentDrank`, newDrank.toString())

    const oldLogs = JSON.parse(localStorage.getItem(`${username}_drinkLogs`) || '[]')
    const updatedLogs = [...oldLogs, { time: new Date().toISOString(), amount }]
    localStorage.setItem(`${username}_drinkLogs`, JSON.stringify(updatedLogs))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-blue-50 px-4">
      <h1 className="text-2xl font-bold text-blue-800">Today's Progress 💦</h1>

      {drankLiters === 0 ? (
        <p className="text-gray-500 text-sm">No water logged yet. Start tracking!</p>
      ) : (
        <>
          <Progress value={progress} className="w-full max-w-md h-6 rounded-full bg-white" />
          <p className="text-lg font-medium text-gray-700">
            {drankLiters}L / {goalLiters}L
          </p>
        </>
      )}

      <div className="flex gap-4">
        <Button onClick={() => handleAddWater(0.25)}>+250ml</Button>
        <Button onClick={() => handleAddWater(0.5)}>+500ml</Button>
      </div>

      <div className="mt-4 text-gray-600 text-sm">
        ⏳ Next reminder in: {Math.floor(nextReminder / 60)}m {nextReminder % 60}s
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="secondary" onClick={() => router.push('/result')}>
          View Results
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.clear()
            router.push('/login')
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}
