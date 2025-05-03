import ThemeWatcher from "./hooks/ThemeWatcher"
import PasswordManagerView from "./ui/PasswordManagerView"
import "./App.css"
import { Toaster } from "./components/ui/sonner"
import { useGlobalState } from "./store/useGlobalState"
import { useEffect } from "react"

function App() {
  const { loadStore } = useGlobalState()
  useEffect(() => { loadStore() }, [])

  return (
    <div>
      <Toaster />
      <ThemeWatcher />
      <PasswordManagerView />
    </div>
  )
}

export default App
