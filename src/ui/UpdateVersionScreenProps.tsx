import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGlobalState } from "@/store/useGlobalState"
import { useLanguageState } from "@/store/useLanguageState"

export default function UpdateVersionScreen() {
  const { translations } = useLanguageState()
  const { latestVersion: versionInfo, updateAppVersion } = useGlobalState()

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Data inválida"
    }
  }

  return (
    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">{translations.updateScreenTitle}</h2>
        <p className="text-muted-foreground">{translations.updateScreenSubtitle}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">{translations.versionLabel}</h3>
            <p className="text-lg font-bold text-foreground">{versionInfo.version}</p>
          </div>

          {versionInfo.type && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">{translations.typeLabel}</h3>
              <Badge variant="outline" className="text-sm">{versionInfo.type}</Badge>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">{translations.releaseNotesLabel}</h3>
          <p className="text-sm text-foreground bg-muted p-2 rounded-md">{versionInfo.notes}</p>
        </div>

        {versionInfo.changes && versionInfo.changes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">{translations.mainChangesLabel}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground pl-2 bg-muted p-2 rounded-md">
              {versionInfo.changes.map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">{translations.releaseDateLabel}</h3>
          <p className="text-sm text-foreground">{formatDate(versionInfo.createdAt)}</p>
        </div>
      </div>

      <Button
        onClick={updateAppVersion}
        className="w-full h-10 text-sm mt-4"
      >
        {translations.updateNowButton}
      </Button>
      <p className="text-xs text-muted-foreground text-center pt-2">
        {translations.appWillRestartMessage}
      </p>
    </div>
  )
}