export interface IconSelectorScreenProps {
    imageUrl?: string
    setFile: (file: File | undefined) => void
    setImageUrl: (url: string | undefined) => void
}