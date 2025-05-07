import ThemeWatcher from "./hooks/ThemeWatcher"
import { Toaster } from "./components/ui/sonner"
import { useGlobalState } from "./store/useGlobalState"
import { useEffect } from "react"
import LBragoApp from "./ui/LBragoApp"
import "./App.css"

function App() {
  const { loadStore } = useGlobalState()
  useEffect(() => { loadStore() }, [])

  return (
    <div>
      <Toaster />
      <ThemeWatcher />
      <LBragoApp />
    </div>
  )
}

export default App
