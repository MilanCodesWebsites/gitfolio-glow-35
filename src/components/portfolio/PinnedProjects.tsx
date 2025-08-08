import { motion } from "framer-motion"
import { Star, GitFork, ExternalLink, Calendar } from "lucide-react"
import { GitHubPinnedRepo, githubService } from "@/lib/github"
import { GitfolioButton } from "@/components/GitfolioButton"

interface PinnedProjectsProps {
  repos: GitHubPinnedRepo[]
}

export const PinnedProjects = ({ repos }: PinnedProjectsProps) => {
  if (repos.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Pinned Projects</h2>
        <p className="text-muted-foreground">Showcasing the best repositories</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo, index) => (
          <ProjectCard key={repo.id} repo={repo} delay={index * 0.1} />
        ))}
      </div>
    </motion.section>
  )
}

interface ProjectCardProps {
  repo: GitHubPinnedRepo
  delay?: number
}

const ProjectCard = ({ repo, delay = 0 }: ProjectCardProps) => {
  const languageColor = githubService.getLanguageColor(repo.language)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-xl p-6 hover:bg-card/20 group interactive cursor-pointer"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {repo.name}
            </h3>
            {repo.isPinned && (
              <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-mono shrink-0">
                PINNED
              </div>
            )}
          </div>
          
          {repo.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {repo.description}
            </p>
          )}
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{repo.topics.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: languageColor }}
                />
                <span className="text-muted-foreground">{repo.language}</span>
              </div>
            )}
            
            {repo.stargazers_count > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-3 h-3" />
                <span>{repo.stargazers_count}</span>
              </div>
            )}
            
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <GitFork className="w-3 h-3" />
                <span>{repo.forks_count}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{githubService.formatDate(repo.updated_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <GitfolioButton
            variant="glass"
            size="sm"
            asChild
            className="flex-1"
          >
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              View Code
            </a>
          </GitfolioButton>
          
          {repo.homepage && (
            <GitfolioButton
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                Live Demo
              </a>
            </GitfolioButton>
          )}
        </div>
      </div>
    </motion.div>
  )
}