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

  const fillPercent = Math.min((drank / goal) * 100, 100)

  return (
    <div className="min-h-screen px-6 py-10 bg-white">
      <h1 className="text-2xl font-bold text-blue-700 text-center mb-8">
        Water Intake Summary 💧
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 justify-center items-start">
        {/* LEFT: Drink Logs */}
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

        {/* RIGHT: Droplet Chart */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-[150px] h-[220px]">
            <svg viewBox="0 0 150 220" className="w-full h-full">
              <defs>
                {/* Real droplet clipPath */}
                <clipPath id="droplet">
                  <path
                    d="M75 0
                       C105 50, 130 90, 75 210
                       C20 90, 45 50, 75 0
                       Z"
                  />
                </clipPath>
              </defs>

              {/* Light droplet outline */}
              <path
                d="M75 0
                   C105 50, 130 90, 75 210
                   C20 90, 45 50, 75 0
                   Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="2"
              />

              {/* Water fill (animated) */}
              <rect
                x="0"
                y={220 - (fillPercent * 2.1)}
                width="150"
                height="220"
                fill="#3b82f6"
                clipPath="url(#droplet)"
              >
                <animate
                  attributeName="y"
                  to={220 - (fillPercent * 2.1)}
                  dur="1s"
                  fill="freeze"
                  begin="0s"
                />
                <animate
                  attributeName="height"
                  to={(fillPercent * 2.1)}
                  dur="1s"
                  fill="freeze"
                  begin="0s"
                />
              </rect>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center text-blue-800 font-semibold text-lg">
              {drank}L / {goal}L
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
