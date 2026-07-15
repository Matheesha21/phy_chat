import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

export const ChatEmptyState: React.FC = () => {
  const [animationData, setAnimationData] = useState<object | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/Animation.json')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAnimationData(data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <div className="w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-sm">
        {animationData && <Lottie animationData={animationData} loop autoplay />}
      </div>
      <p className="text-sm text-muted-foreground mt-6 max-w-md">
        Ask me anything about physics concepts, formulas, or the Department of Physics — I'm here to help.
      </p>
    </div>
  )
}
