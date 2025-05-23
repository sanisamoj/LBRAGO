import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface DownloadButtonProps extends React.ComponentProps<typeof Button> {
    isDownloading?: boolean
    label?: string
}

export function DownloadButton({
    isDownloading = false,
    label = "Download",
    children,
    ...props
}: DownloadButtonProps) {
    return (
        <Button {...props} disabled={isDownloading || props.disabled}>
            {isDownloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            {children || label}
        </Button>
    )
}

interface DownloadProgressIndicatorProps {
    progress: number // 0 to 100
    status?: "downloading" | "completed" | "error" | "idle"
    fileName?: string
    className?: string
}

export function DownloadProgressIndicator({
    progress,
    status = "idle",
    fileName,
    className,
}: DownloadProgressIndicatorProps) {
    if (status === "idle" && progress === 0) return null;

    return (
        <div className={cn("p-3 border rounded-lg bg-muted/50", className)}>
            {fileName && <p className="text-sm font-medium mb-1 truncate">{fileName}</p>}
            <div className="flex items-center gap-2">
                {status === "downloading" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                {status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                <Progress value={status === "completed" ? 100 : progress} className="w-full h-2" />
                <span className="text-xs text-muted-foreground">{status === "completed" ? "100" : progress.toFixed(0)}%</span>
            </div>
            {status === "error" && <p className="text-xs text-destructive mt-1">Falha no download.</p>}
        </div>
    )
}