import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
 
export default function ThemeToggle() {
  const [theme, setTheme] = useState("light")
 
  // On component mount, read the saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      setTheme("light")
    }
  }, [])
 
  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setTheme("dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setTheme("light")
    }
  }
 
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full border p-2"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </Button>
  )
}
 
 