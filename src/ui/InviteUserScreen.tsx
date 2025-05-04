import { useState, useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Key, Copy, Loader2 } from 'lucide-react'
import { useLanguageState } from '@/store/useLanguageState'
import { useInviteUserState } from '@/store/useInviteUserState'
import { useNavigationState } from '@/store/useNavigationState'

export default function InviteUserScreen() {
    const { translations } = useLanguageState()
    const { getCurrentScreen } = useNavigationState()
    const { email, role, isLoading, code, setEmail, setRole, generateCode, clearState } = useInviteUserState()

    const [copied, setCopied] = useState(false)
    const codeSectionRef = useRef<HTMLDivElement>(null)

    const handleCopyCode = () => {
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
        }
    }

    useEffect(() => {
        if (code && codeSectionRef.current) {
            codeSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }
    }, [code])

    useEffect(() => {
        return () => {
            clearState()
        }
    }, [getCurrentScreen])

    return (
        <div className="space-y-4">
            <div className="p-4 space-y-4 max-w-lg border rounded-md shadow-sm">
                <div className="space-y-1">
                    <Label htmlFor="add-user-email" className="text-xs font-medium">
                        {translations.emailUser}
                    </Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="add-user-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-8 pl-8 text-xs"
                                placeholder={translations.emailPlaceHolder}
                                disabled={isLoading || code !== undefined}
                                required
                                autoFocus
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={generateCode}
                            className="w-full sm:w-auto h-8 text-xs"
                            disabled={!email.includes('@') || isLoading || code !== undefined}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    {translations.sendingInvite}
                                </>
                            ) : (
                                translations.confirmEmailAndSendMail
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">{translations.confirmEmailDescription}</p>
                </div>

                <div className="space-y-2 pt-3 border-t mt-3">
                    <Label className="text-xs font-medium">
                        {translations.userType}
                    </Label>
                    <RadioGroup
                        value={role}
                        onValueChange={(value: "admin" | "member") => setRole(value)}
                        className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                        disabled={isLoading || code !== undefined}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="member" id="role-member" />
                            <Label htmlFor="role-member" className="text-xs font-normal cursor-pointer">{translations.member}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="role-admin" />
                            <Label htmlFor="role-admin" className="text-xs font-normal cursor-pointer">{translations.admin}</Label>
                        </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground pt-1">{translations.selectPermissionDescription}</p>
                </div>

                {isLoading && (
                    <div className="text-center pt-4 border-t mt-4">
                        <p className="text-sm text-muted-foreground flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {translations.inviteCodeGeneratingTo} <span className='font-medium px-1'>{role === 'admin' ? translations.admin : translations.member}</span>...
                        </p>
                    </div>
                )}

                {code && (
                    <div ref={codeSectionRef} className="pt-4 border-t mt-4 space-y-2">
                        <p className="text-sm font-medium text-green-600">{translations.inviteCode} ({role === 'admin' ? translations.admin : translations.member}) {translations.generatedSuccessfully}</p>
                        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-md bg-muted border">
                            <Key className="h-5 w-5 text-primary flex-shrink-0" />
                            <code className="text-xl font-mono text-primary font-semibold flex-grow break-all text-center sm:text-left">
                                {code}
                            </code>
                            <Button variant="ghost" size="sm" className="h-8 px-3 w-full sm:w-auto" onClick={handleCopyCode}>
                                <Copy className="mr-2 h-4 w-4" />
                                {copied ? `${translations.copied}!` : translations.copy}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                            {translations.finalInviteSuccessDescriptionFirstPart} <span className="font-medium">{email}</span>. {translations.finalInviteSuccessDescriptionSecondPart} <span className='font-medium'>{role === 'admin' ? translations.admin : translations.member}</span>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}