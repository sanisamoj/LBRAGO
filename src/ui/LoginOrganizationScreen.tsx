"use client"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigationState } from "@/store/useNavigationState"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useLoginViewState } from "@/store/useLoginViewState"
import { LoginInfoResponse } from "@/models/data/interfaces/LoginInfoResponse"
import { useLanguageState } from "@/store/useLanguageState"

export default function LoginOrganizationScreen() {
  const { navigateReplace, navigateTo } = useNavigationState()
  const { userLoginInfo, selectOrganization } = useLoginViewState()
  const { translations } = useLanguageState()

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 flex flex-col p-4">
        <div className="mb-4">
          <h2 className="text-base font-bold">{translations.loginOrgScreenSelectEnvironmentTitle}</h2>
          <p className="text-xs text-muted-foreground">
            {translations.loginOrgScreenSelectEnvironmentSubtitle} <span className="font-medium">{"email"}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
            {userLoginInfo.map((info: LoginInfoResponse) => (
              <div
                key={info.orgId}
                className="flex items-center py-2 px-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => { selectOrganization(info); navigateTo(NavigationScreen.LOGIN_PASSWORD) }}
              >
                {info.organizationImageUrl ? (
                  <img
                    src={info.organizationImageUrl}
                    alt={info.organizationName}
                    className="h-8 w-8 rounded-md object-cover mr-3"
                  />
                ) : (
                  <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{info.organizationName}</h3>
                </div>
              </div>
            ))}

          </div>

          <div className="rounded-lg border border-border overflow-hidden mt-2">
            <div className="p-3 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => { navigateReplace(NavigationScreen.LOGIN_EMAIL) }}
              >
                {translations.logOut}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-border">
        <p className="text-center text-[10px] text-muted-foreground">
          {translations.loginOrgScreenCantSeeEnvironment}{" "}
          <Button variant="link" className="h-auto p-0 text-[10px] cursor-pointer">
            {translations.contactSupport}
          </Button>
        </p>
      </div>

    </div>
  )
}
