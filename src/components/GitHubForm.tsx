import { useState } from "react"
import { motion } from "framer-motion"
import { Github, ArrowRight, Loader2 } from "lucide-react"
import { GitfolioButton } from "./GitfolioButton"
import { Input } from "./ui/input"
import { useToast } from "@/hooks/use-toast"

interface GitHubFormProps {
  onSubmit: (username: string) => void
  isLoading?: boolean
}

export const GitHubForm = ({ onSubmit, isLoading = false }: GitHubFormProps) => {
  const [username, setUsername] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username",
        variant: "destructive"
      })
      return
    }

    // Basic validation for GitHub username format
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
    if (!usernameRegex.test(username.trim())) {
      toast({
        title: "Invalid username",
        description: "Please enter a valid GitHub username",
        variant: "destructive"
      })
      return
    }

    onSubmit(username.trim())
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4"
    >
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Github className="w-5 h-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="pl-12 h-12 bg-input border-border focus:border-primary focus:glow transition-all duration-300 font-mono"
          />
        </div>
        
        <GitfolioButton
          type="submit"
          variant="hero"
          size="lg"
          disabled={isLoading || !username.trim()}
          className="w-full h-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Portfolio...
            </>
          ) : (
            <>
              Create My Portfolio
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </GitfolioButton>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground font-mono">
          <span className="text-primary">$</span> git clone https://github.com/{username || "username"}.git
        </p>
      </div>
    </motion.form>
  )
}