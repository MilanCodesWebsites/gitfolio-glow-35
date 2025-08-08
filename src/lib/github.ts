import { Octokit } from "octokit"

export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  twitter_username: string | null
  blog: string | null
  html_url: string
  company: string | null
  hireable: boolean | null
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  topics: string[]
  homepage: string | null
  archived: boolean
  fork: boolean
}

export interface GitHubPinnedRepo extends GitHubRepo {
  isPinned: boolean
}

class GitHubService {
  private octokit: Octokit

  constructor() {
    this.octokit = new Octokit()
  }

  async getUser(username: string): Promise<GitHubUser> {
    try {
      const { data } = await this.octokit.rest.users.getByUsername({
        username,
      })
      return data as GitHubUser
    } catch (error) {
      console.error('Error fetching user:', error)
      throw new Error(`User "${username}" not found`)
    }
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 100,
        type: 'owner'
      })
      
      // Filter out forks and archived repos, then sort by stars
      return data
        .filter(repo => !repo.fork && !repo.archived)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          topics: repo.topics || [],
          homepage: repo.homepage,
          archived: repo.archived,
          fork: repo.fork,
        }))
    } catch (error) {
      console.error('Error fetching repos:', error)
      throw new Error(`Failed to fetch repositories for "${username}"`)
    }
  }

  async getPinnedRepos(username: string): Promise<GitHubPinnedRepo[]> {
    try {
      // Get all repos first
      const allRepos = await this.getUserRepos(username)
      
      // Since we can't easily get pinned repos from REST API,
      // we'll return the top 6 repos by stars as "pinned"
      const topRepos = allRepos.slice(0, 6)
      
      return topRepos.map(repo => ({
        ...repo,
        isPinned: true
      }))
    } catch (error) {
      console.error('Error fetching pinned repos:', error)
      return []
    }
  }

  async getUserReadme(username: string): Promise<string | null> {
    try {
      // Try to get README from the special profile repository (username/username)
      const { data } = await this.octokit.rest.repos.getContent({
        owner: username,
        repo: username,
        path: 'README.md',
      })

      if ('content' in data) {
        // Decode base64 content
        return atob(data.content)
      }
      
      return null
    } catch (error) {
      // If profile repo doesn't exist or no README, return null
      console.log(`No profile README found for ${username}`)
      return null
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  getLanguageColor(language: string | null): string {
    if (!language) return '#6b7280' // gray
    
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
      HTML: '#e34c26',
      CSS: '#1572B6',
      SCSS: '#c6538c',
      Vue: '#4FC08D',
      React: '#61DAFB',
      Svelte: '#ff3e00',
      Shell: '#89e051',
      Dockerfile: '#384d54',
      'Jupyter Notebook': '#DA5B0B',
    }
    
    return colors[language] || '#6b7280'
  }
}

export const githubService = new GitHubService()