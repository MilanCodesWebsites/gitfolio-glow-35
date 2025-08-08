import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Home, FolderOpen, Mail, Sun, Moon } from "lucide-react"
import { githubService, GitHubUser, GitHubPinnedRepo } from "@/lib/github"
import { ProfileSection } from "@/components/portfolio/ProfileSection"
import { PinnedProjects } from "@/components/portfolio/PinnedProjects"
import { Navigation } from "@/components/portfolio/Navigation"
import { GitfolioButton } from "@/components/GitfolioButton"
import { useToast } from "@/hooks/use-toast"

export const Portfolio = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [pinnedRepos, setPinnedRepos] = useState<GitHubPinnedRepo[]>([])
  const [readme, setReadme] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) {
      navigate('/')
      return
    }

    fetchUserData()
  }, [username])

  const fetchUserData = async () => {
    if (!username) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch user profile, repos, and readme in parallel
      const [userData, pinnedData, readmeData] = await Promise.all([
        githubService.getUser(username),
        githubService.getPinnedRepos(username),
        githubService.getUserReadme(username)
      ])

      setUser(userData)
      setPinnedRepos(pinnedData)
      setReadme(readmeData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-glow opacity-30" />
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-lg text-foreground">
              Fetching GitHub data...
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              Compiling your portfolio...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">User Not Found</h1>
            <p className="text-muted-foreground">
              {error || `GitHub user "${username}" does not exist or is not accessible.`}
            </p>
          </div>
          <GitfolioButton
            variant="glass"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </GitfolioButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 bg-grid animate-grid opacity-5" />
      <div className="fixed inset-0 bg-glow opacity-10" />
      
      {/* Navigation */}
      <Navigation username={username!} />
      
      {/* Main Content */}
      <main className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            {/* Profile Section */}
            <ProfileSection user={user} readme={readme} />
            
            {/* Pinned Projects */}
            {pinnedRepos.length > 0 && (
              <PinnedProjects repos={pinnedRepos} />
            )}
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <GitfolioButton
                variant="glass"
                onClick={() => navigate(`/${username}/projects`)}
              >
                <FolderOpen className="w-4 h-4" />
                View All Projects
              </GitfolioButton>
              
              <GitfolioButton
                variant="glass"
                onClick={() => navigate(`/${username}/contact`)}
              >
                <Mail className="w-4 h-4" />
                Contact Info
              </GitfolioButton>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}