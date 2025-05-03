import { Circle } from "lucide-react"

interface VaultIconProps {
  icon?: string
  className?: string
}

export function VaultIcon({ icon, className = "h-6 w-6" }: VaultIconProps) {

  if (icon) {
    return (
      <img
        src={icon}
        alt="Vault Icon"
        className={className}
      />
    )
  }

  return <Circle className={className} color="currentColor" />
}