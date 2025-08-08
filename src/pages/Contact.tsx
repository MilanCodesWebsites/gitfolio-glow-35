import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { githubService, GitHubUser } from "@/lib/github"
import { Navigation } from "@/components/portfolio/Navigation"
import { GitfolioButton } from "@/components/GitfolioButton"
import { useToast } from "@/hooks/use-toast"

export const Contact = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) {
      navigate('/')
      return
    }
    fetchUser()
  }, [username])

  const fetchUser = async () => {
    if (!username) return

    setIsLoading(true)
    setError(null)

    try {
      const userData = await githubService.getUser(username)
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    })
  }

  const terminalCommands = [
    {
      command: "whoami",
      output: user?.name || user?.login || "",
      description: "Full name"
    },
    {
      command: "pwd",
      output: user?.location || "Earth",
      description: "Current location"
    },
    {
      command: "cat bio.txt",
      output: user?.bio || "No bio available",
      description: "About me"
    },
    {
      command: "ls -la social/",
      output: [
        user?.blog && `website: ${user.blog}`,
        user?.twitter_username && `twitter: @${user.twitter_username}`,
        `github: ${user?.html_url}`,
      ].filter(Boolean),
      description: "Social links"
    },
    {
      command: "cat stats.json",
      output: {
        public_repos: user?.public_repos || 0,
        followers: user?.followers || 0,
        following: user?.following || 0,
      },
      description: "GitHub stats"
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation username={username!} />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="font-mono text-muted-foreground">Loading contact info...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation username={username!} />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <p className="text-foreground font-semibold">Failed to load contact info</p>
            <p className="text-muted-foreground">{error}</p>
            <GitfolioButton onClick={fetchUser} variant="glass">
              Try Again
            </GitfolioButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid animate-grid opacity-5" />
      <Navigation username={username!} />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold text-foreground">Contact Information</h1>
              <p className="text-muted-foreground">
                Connect with @{username} through various channels
              </p>
            </div>

            {/* Terminal Interface */}
            <div className="space-y-6">
              {terminalCommands.map((cmd, index) => (
                <motion.div
                  key={cmd.command}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="terminal"
                >
                  <div className="space-y-3">
                    {/* Command */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">$</span>
                        <span className="text-foreground font-mono">{cmd.command}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{cmd.description}</span>
                    </div>

                    {/* Output */}
                    <div className="ml-4 space-y-2">
                      {Array.isArray(cmd.output) ? (
                        cmd.output.map((line, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <span className="text-muted-foreground">{line}</span>
                            {line?.includes('http') && (
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <GitfolioButton
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(line.split(': ')[1], 'Link')}
                                >
                                  <Copy className="w-3 h-3" />
                                </GitfolioButton>
                                <GitfolioButton
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={line.split(': ')[1].startsWith('http') 
                                      ? line.split(': ')[1] 
                                      : `https://${line.split(': ')[1]}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </GitfolioButton>
                              </div>
                            )}
                          </div>
                        ))
                      ) : typeof cmd.output === 'object' ? (
                        <div className="text-muted-foreground">
                          <pre className="text-sm">
                            {JSON.stringify(cmd.output, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group">
                          <span className="text-muted-foreground">{cmd.output}</span>
                          {cmd.output && cmd.output.toString().length > 0 && (
                            <GitfolioButton
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(cmd.output.toString(), cmd.description)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-3 h-3" />
                            </GitfolioButton>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <GitfolioButton
                    variant="glass"
                    asChild
                    className="justify-start"
                  >
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">GitHub Profile</div>
                        <div className="text-xs text-muted-foreground">View full profile</div>
                      </div>
                    </a>
                  </GitfolioButton>

                  {user.blog && (
                    <GitfolioButton
                      variant="glass"
                      asChild
                      className="justify-start"
                    >
                      <a
                        href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Personal Website</div>
                          <div className="text-xs text-muted-foreground">Visit homepage</div>
                        </div>
                      </a>
                    </GitfolioButton>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}