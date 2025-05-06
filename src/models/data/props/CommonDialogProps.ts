export interface CommonDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void

    title: string
    description?: string
    cancelButtonText?: string
    confirmButtonText?: string

    cancelButtonAction?: () => void
    confirmButtonAction?: () => Promise<void>
    sendingInviteLoadingText?: string
    isLoading?: boolean
}