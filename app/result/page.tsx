'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ResultPage() {
    const [logs, setLogs] = useState<{ time: string; amount: number }[]>([])
    const [goal, setGoal] = useState(2)
    const [drank, setDrank] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const user = localStorage.getItem('username')
        if (!user) {
            router.push('/login')
            return
        }

        const goalLiters = Number(localStorage.getItem(`${user}_goalLiters`)) || 2
        const drankLiters = Number(localStorage.getItem(`${user}_currentDrank`)) || 0
        const drinkLogs = JSON.parse(localStorage.getItem(`${user}_drinkLogs`) || '[]')

        setGoal(goalLiters)
        setDrank(drankLiters)
        setLogs(drinkLogs.reverse())
    }, [router])

    return (
        <div className="min-h-screen px-6 py-10 bg-white">
            <h1 className="text-2xl font-bold text-blue-700 text-center mb-8">
                Water Intake Summary 💧
            </h1>

            <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
                <div className="w-full lg:w-1/2">
                    <h2 className="text-xl font-semibold mb-4">Drink Log</h2>
                    <div className="border p-4 rounded-lg shadow max-h-[400px] overflow-auto">
                        {logs.length === 0 ? (
                            <p className="text-gray-500 text-center">No entries yet.</p>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className="flex justify-between border-b py-2 text-sm">
                                    <span>+{log.amount}L</span>
                                    <span>{new Date(log.time).toLocaleTimeString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center">
                    {/* RIGHT: Cylinder Chart */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative w-62 h-94">
                            <svg viewBox="0 0 100 200" className="w-full h-full">
                                {/* Background */}
                                <rect x="20" y="20" width="60" height="160" rx="30" ry="30" fill="#e5e7eb" stroke="#ccc" strokeWidth="2" />

                                {/* Water Fill */}
                                <clipPath id="clip">
                                    <rect x="20" y={180 - (drank / goal) * 160} width="60" height="160" rx="30" ry="30" />
                                </clipPath>
                                <rect
                                    x="20"
                                    y="20"
                                    width="60"
                                    height="160"
                                    rx="30"
                                    ry="30"
                                    fill="#3b82f6"
                                    clipPath="url(#clip)"
                                />
                            </svg>

                            {/* Text Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center font-semibold text-blue-800">
                                {drank}L / {goal}L
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Button onClick={() => router.push('/goal')}>⬅ Back to Set Goal</Button>
            </div>
        </div>
    )
}
