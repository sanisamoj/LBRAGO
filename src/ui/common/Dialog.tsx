import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommonDialogProps } from "@/models/data/props/CommonDialogProps"
import { Loader2 } from "lucide-react"

export function CommonDialog({ isOpen, onOpenChange, title, description, cancelButtonText, confirmButtonText, cancelButtonAction, confirmButtonAction, sendingInviteLoadingText, isLoading }: CommonDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-sm">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <div className="flex justify-center gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" onClick={cancelButtonAction}>
                                {cancelButtonText}
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={confirmButtonAction}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4" />
                                    {sendingInviteLoadingText}
                                </>
                            ) : (
                                confirmButtonText
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}