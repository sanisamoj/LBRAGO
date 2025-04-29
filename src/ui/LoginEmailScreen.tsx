import type React from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigationState } from "@/store/useNavigationState"
import { useLoginViewState } from "@/store/useLoginViewState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useLanguageState } from "@/store/useLanguageState"

export default function LoginEmailScreen() {
  const { email, isLoading, setEmail, verifyEmail, isError, errorMessage } = useLoginViewState()
  const { translations } = useLanguageState()
  const { navigateTo } = useNavigationState()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyEmail()
  }

  return (
    <div className="flex flex-col min-h-screen justify-center items-center  bg-white dark:bg-zinc-900 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col justify-center items-center p-6 space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LemBraGO" className="h-12 w-12" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">LemBraGO</h1>
          </div>
          <p className="text-xs text-muted-foreground text-center dark:text-gray-400">
            {translations.loginDescription}
          </p>
          <p className="text-xs text-muted-foreground text-center dark:text-gray-400">
            {translations.loginSubDescription}
          </p>
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="email" className="text-xs font-medium dark:text-gray-300">
            Email
          </Label>
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground dark:text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-8 pl-8 text-xs"
              placeholder={translations.emailPlaceHolder}
              required
              autoFocus
            />
          </div>
          {isError && <p className="text-[10px] text-red-500">{errorMessage}</p>}
        </div>

        <Button type="submit" className="w-full h-8 text-xs" disabled={isLoading}>
          {isLoading ? "Verificando..." : "Continuar"}
        </Button>
      </form>

      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-4 mb-2">
        {translations.loginBottomDescription}
      </p>

      <div className="pt-2 border-t border-border w-full max-w-sm">
        <p className="text-center text-[11px] text-muted-foreground dark:text-gray-400">
          {translations.dontHaveAccount}{" "}
          <Button
            variant="link"
            onClick={() => navigateTo(NavigationScreen.REGISTER_EMAIL)}
            className="h-auto p-0 text-[10px] font-semibold cursor-pointer"
          >
            {translations.createAccount}
          </Button>
        </p>
      </div>
      <div className="p-2 w-full max-w-sm">
        <p className="text-center text-[11px] text-muted-foreground dark:text-gray-400">
          {translations.wantCreateEnvironmentToYourTeam}{" "}
          <Button onClick={() => navigateTo(NavigationScreen.CREATE_ENVIRONMENT)} variant="link" className="h-auto p-0 text-[10px] cursor-pointer">
            {translations.clickHere}
          </Button>
        </p>
      </div>

    </div>
  )
}
