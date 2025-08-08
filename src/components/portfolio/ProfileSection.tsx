import { motion } from "framer-motion"
import { MapPin, Users, GitFork, ExternalLink, Twitter, Globe } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { GitHubUser } from "@/lib/github"
import { GitfolioButton } from "@/components/GitfolioButton"

interface ProfileSectionProps {
  user: GitHubUser
  readme: string | null
}

export const ProfileSection = ({ user, readme }: ProfileSectionProps) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:col-span-1"
      >
        <div className="glass rounded-xl p-6 space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={user.avatar_url}
                alt={`${user.name || user.login}'s avatar`}
                className="w-32 h-32 rounded-full mx-auto glow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
          </div>

          {/* Basic Info */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {user.name || user.login}
            </h1>
            <p className="text-primary font-mono">@{user.login}</p>
            {user.bio && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground">{user.public_repos}</div>
              <div className="text-xs text-muted-foreground">Repos</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground">{user.followers}</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="space-y-1">
              <div className="text-xl font-bold text-foreground">{user.following}</div>
              <div className="text-xs text-muted-foreground">Following</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {user.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user.company && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{user.company}</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="space-y-2">
            <GitfolioButton
              variant="glass"
              size="sm"
              asChild
              className="w-full"
            >
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <GitFork className="w-4 h-4" />
                View GitHub Profile
                <ExternalLink className="w-3 h-3" />
              </a>
            </GitfolioButton>

            {user.blog && (
              <GitfolioButton
                variant="ghost"
                size="sm"
                asChild
                className="w-full"
              >
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </GitfolioButton>
            )}

            {user.twitter_username && (
              <GitfolioButton
                variant="ghost"
                size="sm"
                asChild
                className="w-full"
              >
                <a
                  href={`https://twitter.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  @{user.twitter_username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </GitfolioButton>
            )}
          </div>
        </div>
      </motion.div>

      {/* About Me / README */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            About Me
            {readme && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-md font-mono">
                from README
              </span>
            )}
          </h2>
          
          {readme ? (
            <div className="prose prose-invert prose-primary max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline transition-colors"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-4">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-muted-foreground">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-muted-foreground">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {readme}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No README found</p>
              <p className="text-sm">
                Create a repository named "{user.login}" with a README.md file to showcase your story here.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}