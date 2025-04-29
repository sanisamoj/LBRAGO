import ThemeWatcher from "./hooks/ThemeWatcher"
import PasswordManagerView from "./ui/PasswordManagerView"
import "./App.css"
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <div>
      <Toaster />
      <ThemeWatcher />
      <PasswordManagerView />
    </div>
  )
}

export default App
