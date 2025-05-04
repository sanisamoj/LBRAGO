import { useState } from 'react'
import { Mail, Key, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddUserView() {
    // Estados internos deste componente
    const [addUserEmail, setAddUserEmail] = useState("");
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [copied, setCopied] = useState(false);

    // Handler para gerar o código (lógica interna)
    const handleGenerateCode = async () => {
        if (!addUserEmail || !addUserEmail.includes('@')) {
            console.error("Email inválido."); return;
        }
        setIsGeneratingCode(true);
        setGeneratedCode(null);
        setCopied(false);
        console.log(`Simulando geração de código para: ${addUserEmail}`);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const code = Math.random().toString(36).substring(2, 10).toUpperCase();
            setGeneratedCode(code);
            console.log(`Código gerado: ${code}`);
            // TODO: Chamar API real aqui
        } catch (error) {
            console.error("Erro ao gerar código (simulado):", error);
        } finally {
            setIsGeneratingCode(false);
        }
    };

    // Handler para copiar o código (lógica interna)
    const handleCopyCode = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch(err => console.error('Falha ao copiar código: ', err));
        }
    };

    return (
        <div className="space-y-4">
            <div className="p-4  space-y-4 max-w-lg">
                <div className="space-y-1">
                    <Label htmlFor="add-user-email" className="text-sm font-medium">
                        Email do Usuário
                    </Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="relative flex-grow">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="add-user-email" type="email" placeholder="nome@exemplo.com"
                                value={addUserEmail} onChange={(e) => setAddUserEmail(e.target.value)}
                                className="h-10 pl-9 text-sm w-full"
                                disabled={isGeneratingCode}
                            />
                        </div>
                        <Button
                            type="button" onClick={handleGenerateCode}
                            className="h-10 px-4 flex-shrink-0 w-full sm:w-auto"
                            disabled={!addUserEmail.includes('@') || isGeneratingCode}
                        >
                            {isGeneratingCode ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gerando...
                                </>
                            ) : "Confirmar Email"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">Confirme o email para gerar um código de convite único.</p>
                </div>

                {/* Display do Código Gerado */}
                {isGeneratingCode && (
                    <div className="text-center pt-2">
                        <p className="text-sm text-muted-foreground">Gerando código de convite...</p>
                    </div>
                )}
                {generatedCode && !isGeneratingCode && (
                    <div className="pt-4 border-t mt-4 space-y-2">
                        <p className="text-sm font-medium text-green-600">Código de Convite Gerado com sucesso!</p>
                        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-md bg-muted border">
                            <Key className="h-5 w-5 text-primary flex-shrink-0" />
                            <code className="text-xl font-mono text-primary font-semibold flex-grow break-all text-center sm:text-left">
                                {generatedCode}
                            </code>
                            <Button variant="ghost" size="sm" className="h-8 px-3 w-full sm:w-auto" onClick={handleCopyCode}>
                                <Copy className="mr-2 h-4 w-4" />
                                {copied ? "Copiado!" : "Copiar"}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground pt-1">
                            Envie este código para <span className="font-medium">{addUserEmail}</span>. Ele precisará inserir este código durante o cadastro.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}