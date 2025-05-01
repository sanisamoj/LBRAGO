"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, Lock, TicketCheck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useUserCreationState } from "@/store/useUserCreationState"
import { calculatePasswordStrength, getStrengthColor, getStrengthText } from "@/utils/calculatePasswordStrength"
import { useLanguageState } from "@/store/useLanguageState"
import { TermsOfServiceLinkOnCreate } from "./TermsOfServiceLinkOnCreate"
import { useNavigationState } from "@/store/useNavigationState"

export default function RegisterScreen() {
    const { translations } = useLanguageState()
    const { history } = useNavigationState()
    const {
        code, setCode, isCodeError, organizationName, imageUrl, nickname,
        setNickname, password, setPassword, confirmPassword, setConfirmPassword,
        createUser, isLoading, isPasswordError, clearState
    } = useUserCreationState()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const passwordStrength: number = calculatePasswordStrength(password)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createUser()
    }

    useEffect(() => {
        clearState()
    }, [history])

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4">
                <div className="space-y-1 mb-4 text-center">
                    <h1 className="text-sm font-semibold">👋 {translations.receivedAnInvitation}</h1>
                    <p className="text-xs text-muted-foreground">{translations.useTheCodeToCreateAccount}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="inviteCode" className="text-xs font-medium">
                            {translations.invitationCode}
                        </Label>
                        <div className="relative">
                            <TicketCheck className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="inviteCode"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="h-8 pl-8 text-xs"
                                placeholder={translations.invitationCode}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                        {isCodeError && <p className="text-[10px] text-red-500">{translations.noInvitationFound}</p>}

                        {code && organizationName && (
                            <div className="flex items-center gap-2 mt-1 ml-1">
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="Logo da organização"
                                        className="w-5 h-5 rounded-sm border"
                                    />
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                    {translations.invitedBy}: <strong>{organizationName}</strong>
                                </span>
                            </div>
                        )}

                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="user" className="text-xs font-medium">
                            {translations.user}
                        </Label>
                        <div className="relative">
                            <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="user"
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="h-8 pl-8 pr-8 text-xs"
                                placeholder={translations.createUsername}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-xs font-medium">
                            {translations.masterPassword}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-8 pl-8 pr-8 text-xs"
                                placeholder={translations.createStrongPassword}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                        </div>
                        {password && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <Progress value={passwordStrength} className={`h-1 ${getStrengthColor(passwordStrength)}`} />
                                    <span className="text-[10px] ml-2">{getStrengthText(passwordStrength)}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    {translations.passwordInstructions}
                                </p>
                            </div>
                        )}
                        {isPasswordError && <p className="text-[10px] text-red-500">{translations.passwordsDontMatch}</p>}
                    </div>


                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword" className="text-xs font-medium">
                            {translations.confirmPassword}
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-8 pl-8 pr-8 text-xs"
                                placeholder={translations.confirmYourPassword}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </Button>
                        </div>
                        {isPasswordError && <p className="text-[10px] text-red-500">{translations.passwordsDontMatch}</p>}
                    </div>

                    <Button type="submit" className="w-full h-8 text-xs mt-4" disabled={isLoading}>
                        {isLoading ? translations.encryptingData : translations.createAccount}
                    </Button>
                </form>
            </div>
            <TermsOfServiceLinkOnCreate />
        </div>
    )
}
