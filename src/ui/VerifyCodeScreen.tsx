"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react"
import { useLoginViewState } from "@/store/useLoginViewState"
import { useLanguageState } from "@/store/useLanguageState"

export default function VerifyCodeScreen() {
    const { translations } = useLanguageState()
    const {
        email, isLoading, verificationCodeInput, setVerificationCodeInput, verifyCode, resendCode,
        errorMessage, resetToEmailInput, isError
    } = useLoginViewState()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        verifyCode()
    }

    return (
        <div className="flex flex-col justify-center items-center bg-white dark:bg-zinc-900 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col justify-center items-center p-4 space-y-4">
                <div className="flex flex-col items-center space-y-2">
                    <img src="/logo.png" alt="LemBraGO" className="h-12 w-12" />
                    <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">{translations.verifyYourEmail || "Verifique seu Email"}</h1>
                    <p className="text-xs text-muted-foreground text-center dark:text-gray-400 px-4">
                        {translations.codeSentTo} <strong>{email}</strong>.
                    </p>
                    <p className="text-xs text-muted-foreground text-center dark:text-gray-400 px-4">
                        {translations.enterCodeBelow}
                    </p>
                </div>

                <div className="w-full space-y-1">
                    <Label htmlFor="verificationCode" className="text-xs font-medium dark:text-gray-300">
                        {translations.verificationCode || "Código de Verificação"}
                    </Label>
                    <div className="relative">
                        <KeyRound className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground dark:text-gray-400" />
                        <Input
                            id="verificationCode"
                            type="text"
                            inputMode="numeric"
                            value={verificationCodeInput || ""}
                            onChange={(e) => setVerificationCodeInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
                            className="h-8 pl-8 text-xs tracking-widest text-center"
                            placeholder={translations.codePlaceHolder}
                            maxLength={7}
                            required
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>
                    {isError && <p className="text-[10px] text-red-500">{errorMessage || translations.invalidCode}</p>}
                </div>

                <div className="flex justify-between w-full pt-2">
                    <Button
                        variant="link"
                        type="button"
                        onClick={resetToEmailInput}
                        className="h-auto p-0 text-[10px] font-semibold cursor-pointer text-muted-foreground hover:text-primary"
                        disabled={isLoading}
                    >
                        {translations.changeEmail}
                    </Button>
                    <Button
                        variant="link"
                        type="button"
                        onClick={resendCode}
                        className="h-auto p-0 text-[10px] font-semibold cursor-pointer text-muted-foreground hover:text-primary"
                        disabled={isLoading} // Pode adicionar lógica de cooldown aqui também
                    >
                        {translations.resendCode}
                    </Button>
                </div>
            </form>
        </div>
    )
}