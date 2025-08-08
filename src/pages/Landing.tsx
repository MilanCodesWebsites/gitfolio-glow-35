import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, FolderGit2, Share2, ExternalLink } from "lucide-react"
import { GitHubForm } from "@/components/GitHubForm"
import { FeatureCard } from "@/components/FeatureCard"
import { GitfolioButton } from "@/components/GitfolioButton"
import { useNavigate } from "react-router-dom"

export const Landing = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleFormSubmit = async (username: string) => {
    setIsLoading(true)
    
    // Simulate loading before navigation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    navigate(`/${username}`)
    setIsLoading(false)
  }

  const features = [
    {
      icon: Zap,
      title: "Instant Portfolio",
      description: "Transform any GitHub profile into a stunning portfolio in seconds. No setup required."
    },
    {
      icon: FolderGit2,
      title: "Showcase Projects",
      description: "Automatically fetch and beautifully display your best repositories with live stats."
    },
    {
      icon: Share2,
      title: "Shareable Link",
      description: "Get a beautiful, shareable URL to showcase your work to employers and collaborators."
    }
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid animate-grid opacity-10" />
      <div className="absolute inset-0 bg-glow opacity-20" />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-16 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <h1 className="text-3xl md:text-7xl font-bold font-mono text-gradient">
                {"{ Gitfolio }"}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                Beautiful Developer Portfolio{" "}
                <span className="text-primary">in Seconds</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-light">
                From GitHub to Gorgeous — Instantly.
              </p>
            </motion.div>

            {/* GitHub Form */}
            <div className="flex justify-center">
              <GitHubForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>

            {/* Demo CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4"
            >
              <GitfolioButton
                variant="glass"
                size="sm"
                onClick={() => handleFormSubmit("octocat")}
                disabled={isLoading}
              >
                View Demo Portfolio
                <ExternalLink className="w-4 h-4" />
              </GitfolioButton>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Choose Gitfolio?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Showcase your coding journey with style. No complex setup, no maintenance — just beautiful portfolios.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </section>

        {/* About Developer Section */}
        <section className="container mx-auto px-6 py-16 border-t border-border/30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                About the dev
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Gitfolio was crafted with passion to help developers showcase their work beautifully. 
                Built with modern web technologies and a focus on user experience.
              </p>
            </div>
            
            <div className="pt-4">
              <GitfolioButton
                variant="glass"
                size="sm"
                asChild
              >
                <a 
                  href="https://onrooleyy.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Developer Site
                </a>
              </GitfolioButton>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-border/30">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-mono">
              built by{" "}
              <a 
                href="https://onrooleyy.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                prince
              </a>
            </p>
            <p className="text-xs text-muted-foreground/60">
              © 2024 Gitfolio. Open source & made with ❤️
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}