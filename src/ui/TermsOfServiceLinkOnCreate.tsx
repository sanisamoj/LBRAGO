import { Button } from "@/components/ui/button"
import { useLanguageState } from "@/store/useLanguageState"

export function TermsOfServiceLinkOnCreate() {
    const { translations } = useLanguageState()

    return (
        <div className="sticky bottom-0 bg-white dark:bg-zinc-900 pt-2 pb-2 border-t border-border">
            <p className="text-center text-[10px] text-muted-foreground">
                {translations.youConfirmWithTermsSub}{" "}
                <Button variant="link" className="h-auto p-0 text-[10px] cursor-pointer">
                    {translations.termsOfService}
                </Button>
            </p>
        </div>
    )
}