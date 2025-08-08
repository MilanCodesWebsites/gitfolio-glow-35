import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState("Initializing Gitfolio...")

  const loadingTexts = [
    "Initializing Gitfolio...",
    "Loading design system...",
    "Preparing magical experience...",
    "Almost there..."
  ]

  useEffect(() => {
    const duration = 3000 // 3 seconds total loading time
    const interval = duration / 100

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1
        
        // Change text based on progress
        if (newProgress === 25) setCurrentText(loadingTexts[1])
        else if (newProgress === 50) setCurrentText(loadingTexts[2])
        else if (newProgress === 75) setCurrentText(loadingTexts[3])
        
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500) // Small delay before completing
        }
        
        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid animate-grid opacity-20" />
      
      {/* Glowing orb effect */}
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="relative z-10 text-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-6xl font-bold font-mono text-gradient animate-glow">
            {"{ Gitfolio }"}
          </h1>
        </motion.div>

        {/* Loading text */}
        <motion.p
          key={currentText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-mono text-muted-foreground"
        >
          {currentText}
        </motion.p>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full glow"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm font-mono text-muted-foreground mt-2">
            {progress}%
          </p>
        </div>

        {/* Floating dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}