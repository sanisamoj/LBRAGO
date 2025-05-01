"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import IconSelectorScreen from "./IconSelectScreen"
import { TermsOfServiceLinkOnCreate } from "./TermsOfServiceLinkOnCreate"
import { useEnvironmentCreationState } from "@/store/useEnvironmentCreationState"
import { useLanguageState } from "@/store/useLanguageState"
import { Progress } from "@/components/ui/progress"
import { calculatePasswordStrength, getStrengthColor, getStrengthText } from "@/utils/calculatePasswordStrength"

export default function CreateEnvironmentScreen() {
    const { translations } = useLanguageState()
    const {
        isLoading, environmentName, setEnvironmentName, username, setUsername, email, setEmail,
        password, setPassword, confirmPassword, setConfirmPassword, isPasswordError, createEnvironment,
        imageUrl, setFile, setImageUrl
    } = useEnvironmentCreationState()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const passwordStrength: number = calculatePasswordStrength(password)

    return (
        <div className="flex flex-col h-full">
            <div className="p-4">
                <form onSubmit={(e) => { e.preventDefault(); createEnvironment() }} className="space-y-3">
                    {/* Icon Selector */}
                    <IconSelectorScreen imageUrl={imageUrl} setFile={setFile} setImageUrl={setImageUrl} />

                    {/* Environment Name */}
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-medium">
                            {translations.environmentName}
                        </Label>
                        <Input
                            id="name"
                            value={environmentName}
                            onChange={(e) => setEnvironmentName(e.target.value)}
                            className="h-8 text-xs"
                            placeholder={translations.environmentNamePlaceholder}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    {/* User Information Section */}
                    <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-medium">{translations.accessInfomartions}</h3>

                        {/* User Email */}
                        <div className="space-y-1">
                            <Label htmlFor="userEmail" className="text-xs font-medium">
                                {translations.emailUser}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="userEmail"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-8 pl-8 text-xs"
                                    placeholder={translations.emailPlaceHolder}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* User Name */}
                        <div className="space-y-1">
                            <Label htmlFor="userName" className="text-xs font-medium">
                                {translations.user}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="userName"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="h-8 pl-8 text-xs"
                                    placeholder="Ex: Jomasinas"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* User Password */}
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
                    </div>

                    <Button type="submit" className="w-full h-8 text-xs mt-4" disabled={isLoading}>
                        {isLoading ? translations.encryptingData : translations.createEnvironment}
                    </Button>
                </form>
            </div>
            <TermsOfServiceLinkOnCreate />
        </div>
    )
}
