export const calculatePasswordStrength = (pass: string): number => {
    if (!pass) return 0

    let strength = 0

    // Caracteres mínimos
    if (pass.length >= 8) strength += 25
    // Letras minúsculas
    if (/[a-z]/.test(pass)) strength += 25
    // Letras maiúsculas
    if (/[A-Z]/.test(pass)) strength += 25
    // Números ou símbolos
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(pass)) strength += 25

    // Penalidade por ser muito curta, mesmo que tenha variedade
    if (pass.length <= 12) strength -= 15

    // Garante que nunca fique abaixo de zero
    return Math.max(0, strength)
}


export const getStrengthColor = (passwordStrength: number) => {
    if (passwordStrength < 50) return "bg-red-500"
    if (passwordStrength < 75) return "bg-yellow-500"
    return "bg-green-500"
}

export const getStrengthText = (passwordStrength: number) => {
    if (passwordStrength < 50) return "Fraca"
    if (passwordStrength < 75) return "Média"
    return "Forte"
}