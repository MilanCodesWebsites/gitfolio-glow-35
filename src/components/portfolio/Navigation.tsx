import { motion } from "framer-motion"
import { Home, FolderOpen, Mail, ArrowLeft } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { GitfolioButton } from "@/components/GitfolioButton"
import { cn } from "@/lib/utils"

interface NavigationProps {
  username: string
}

export const Navigation = ({ username }: NavigationProps) => {
  const navigate = useNavigate()

  const navItems = [
    { icon: Home, label: "Profile", to: `/${username}` },
    { icon: FolderOpen, label: "Projects", to: `/${username}/projects` },
    { icon: Mail, label: "Contact", to: `/${username}/contact` },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-40"
      >
        <div className="glass rounded-xl p-4 space-y-4">
          {/* Back to Home */}
          <GitfolioButton
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="w-12 h-12 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </GitfolioButton>
          
          <div className="w-full h-px bg-border" />
          
          {/* Navigation Items */}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground glow"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                )
              }
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Navigation - Perfectly Centered Dock */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="md:hidden fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4"
      >
        <div className="glass rounded-2xl p-3 border border-primary/20 backdrop-blur-xl">
          <div className="flex items-center justify-center gap-4">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-105"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-105"
                  )
                }
              >
                <item.icon className="w-6 h-6" />
              </NavLink>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Top Bar for Mobile */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/30"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Back to Home */}
            <GitfolioButton
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="w-10 h-10 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </GitfolioButton>
            
            <h1 className="text-xl font-bold font-mono text-gradient">
              {"{ " + username + " }"}
            </h1>
            
            {/* Spacer for balance */}
            <div className="w-10 h-10" />
          </div>
        </div>
      </motion.header>
    </>
  )
}