import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Filter, Star, Calendar, ArrowUpDown, Loader2, AlertCircle } from "lucide-react"
import { githubService, GitHubRepo } from "@/lib/github"
import { Navigation } from "@/components/portfolio/Navigation"
import { GitfolioButton } from "@/components/GitfolioButton"
import { Input } from "@/components/ui/input"
import { PinnedProjects } from "@/components/portfolio/PinnedProjects"

type SortOption = 'stars' | 'updated' | 'alphabetical'

export const Projects = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>('stars')

  useEffect(() => {
    if (!username) {
      navigate('/')
      return
    }
    fetchRepos()
  }, [username])

  useEffect(() => {
    filterAndSortRepos()
  }, [repos, searchQuery, sortBy])

  const fetchRepos = async () => {
    if (!username) return

    setIsLoading(true)
    setError(null)

    try {
      const reposData = await githubService.getUserRepos(username)
      setRepos(reposData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortRepos = () => {
    let filtered = repos

    // Filter by search query
    if (searchQuery) {
      filtered = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort repos
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredRepos(filtered)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation username={username!} />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="font-mono text-muted-foreground">Loading repositories...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation username={username!} />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <p className="text-foreground font-semibold">Failed to load repositories</p>
            <p className="text-muted-foreground">{error}</p>
            <GitfolioButton onClick={fetchRepos} variant="glass">
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
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-foreground">All Projects</h1>
              <p className="text-muted-foreground">
                Explore all {repos.length} repositories from @{username}
              </p>
            </div>

            {/* Search and Filters */}
            <div className="glass rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-mono"
                  />
                </div>

                {/* Sort Options */}
                <div className="flex gap-2">
                  <GitfolioButton
                    variant={sortBy === 'stars' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('stars')}
                  >
                    <Star className="w-4 h-4" />
                    Stars
                  </GitfolioButton>
                  <GitfolioButton
                    variant={sortBy === 'updated' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('updated')}
                  >
                    <Calendar className="w-4 h-4" />
                    Updated
                  </GitfolioButton>
                  <GitfolioButton
                    variant={sortBy === 'alphabetical' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('alphabetical')}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    A-Z
                  </GitfolioButton>
                </div>
              </div>

              {searchQuery && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Found {filteredRepos.length} repositories matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Results */}
            {filteredRepos.length > 0 ? (
              <PinnedProjects 
                repos={filteredRepos.map(repo => ({ ...repo, isPinned: false }))} 
              />
            ) : (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <Filter className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">No repositories found</p>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? `No repositories match "${searchQuery}"`
                        : "This user has no public repositories"
                      }
                    </p>
                  </div>
                  {searchQuery && (
                    <GitfolioButton
                      variant="ghost"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </GitfolioButton>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}