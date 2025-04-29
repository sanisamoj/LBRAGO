import type React from "react"
import {
  Activity,
  BarChart,
  Blocks,
  Circle,
  Cloud,
  Facebook,
  Github,
  Instagram,
  Megaphone,
  Triangle,
} from "lucide-react"

interface VaultIconProps {
  icon: string
  className?: string
  iconColor?: string
  showLabel?: string | number
}

export function VaultIcon({ icon, className = "h-6 w-6", iconColor = "currentColor", showLabel }: VaultIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    megaphone: <Megaphone className={className} color={iconColor} />,
    "bar-chart": <BarChart className={className} color={iconColor} />,
    blocks: <Blocks className={className} color={iconColor} />,
    triangle: (
      <div className="relative flex items-center justify-center">
        <Triangle className={className} color={iconColor} />
        {showLabel && <span className="absolute text-[8px] font-bold text-teal-700">{showLabel}</span>}
      </div>
    ),
    github: <Github className={className} color={iconColor} />,
    docker: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path d="M18 10H22V14H18V10Z" fill="#2396ED" />
        <path d="M13 10H17V14H13V10Z" fill="#2396ED" />
        <path d="M8 10H12V14H8V10Z" fill="#2396ED" />
        <path d="M3 15H7V19H3V15Z" fill="#2396ED" />
        <path d="M8 15H12V19H8V15Z" fill="#2396ED" />
        <path d="M13 15H17V19H13V15Z" fill="#2396ED" />
        <path d="M18 15H22V19H18V15Z" fill="#2396ED" />
        <path d="M23 15H27V19H23V15Z" fill="#2396ED" />
        <path d="M27.5 12.5C27.5 12.5 26 11 24 12C22 13 22.5 15.5 22.5 15.5" stroke="#2396ED" strokeWidth="1" />
        <path
          d="M27 13C28.6569 13 30 11.6569 30 10C30 8.34315 28.6569 7 27 7C25.3431 7 24 8.34315 24 10C24 11.6569 25.3431 13 27 13Z"
          fill="#2396ED"
        />
      </svg>
    ),
    facebook: <Facebook className={className} color="#1877F2" />,
    instagram: <Instagram className={className} color="#E4405F" />,
    cloud: <Cloud className={className} color={iconColor} />,
    activity: <Activity className={className} color={iconColor} />,
  }

  return <>{iconMap[icon] || <Circle className={className} color={iconColor} />}</>
}
