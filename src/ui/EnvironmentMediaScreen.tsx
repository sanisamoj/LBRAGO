import { useState, useEffect, useMemo, useRef } from 'react'
import { Download, Image as ImageIcon, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguageState } from '@/store/useLanguageState'
import { SavedMediaResponse } from '@/models/data/interfaces/SavedMediaResponse'
import { useMediaState } from '@/store/useMediaState'

const MOCKED_TOTAL_AVAILABLE_STORAGE_BYTES = 5 * 1024 * 1024 * 1024 // 5 GB

export default function EnvironmentMediaScreen() {
    const { translations } = useLanguageState()
    const { medias: mediaItemsData } = useMediaState()
    const [mediaItems, setMediaItems] = useState<SavedMediaResponse[]>(mediaItemsData)
    const [searchTerm, _] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMediaItems(mediaItemsData)
    }, [mediaItemsData])

    const totalStoredBytes = useMemo(() => {
        if(!mediaItems) return 0
        return mediaItems.reduce((acc, item) => acc + item.size, 0)
    }, [mediaItems])

    const formatFileSize = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return translations.notAvailableText || "N/A"
        try {
            return new Date(dateString).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
        } catch (error) {
            return translations.invalidDateText || "Data inválida"
        }
    }

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        link.setAttribute('target', '_blank')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const filteredMediaItems = useMemo(() => {
        if (!searchTerm.trim()) return mediaItems
        return mediaItems.filter(item =>
            item.filename.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [mediaItems, searchTerm])

    const storagePercentage = (totalStoredBytes / MOCKED_TOTAL_AVAILABLE_STORAGE_BYTES) * 100

    const getFileIcon = (filename: string) => {
        const extension = filename.split('.').pop()?.toLowerCase()
        if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '')) {
            return ImageIcon
        }
        return FileText
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        
    }

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="mb-2 p-4 border rounded-lg bg-card shadow flex flex-col gap-2">
                <div className="flex flex-raw sm:flex-row justify-between items-center text-sm mb-2">
                    <p className='flex flex-col gap-1'>{translations.totalStoredLabel} <Badge variant="secondary">{formatFileSize(totalStoredBytes)}</Badge></p>
                    <p className='flex flex-col gap-1'>{translations.totalAvailableLabel} <Badge variant="outline">{formatFileSize(MOCKED_TOTAL_AVAILABLE_STORAGE_BYTES)}</Badge></p>
                </div>
                <Progress value={storagePercentage > 100 ? 100 : storagePercentage} className="h-3" />
                {storagePercentage > 100 && (
                    <p className="text-xs text-destructive mt-1">{translations.storageExceededError}</p>
                )}
            </div>

            {/* <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={translations.searchMediaPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm h-9 pl-8 w-full"
                    />
                </div>
                <Button variant="outline" className="w-full sm:w-auto h-9" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    <p className='text-xs'>{translations.uploadNewMediaButton}</p>
                </Button>
            </div> */}

            {filteredMediaItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                    <p>{searchTerm ? translations.noMediaFoundForSearch : translations.noMediaItems}</p>
                </div>
            ) : (
                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-1">
                        {filteredMediaItems.map(item => {
                            const FileSpecificIcon = getFileIcon(item.filename)
                            const isImage = FileSpecificIcon === ImageIcon

                            return (
                                <Card key={item.id} className="overflow-hidden flex flex-col">
                                    <CardHeader className="p-0 relative aspect-square bg-muted flex items-center justify-center">
                                        {isImage ? (
                                            <img src={item.url} alt={item.filename} className="w-full h-full object-contain" />
                                        ) : (
                                            <FileSpecificIcon className="w-12 h-12 text-muted-foreground" />
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-2 md:p-3 space-y-1 flex-grow">
                                        <p className="text-xs sm:text-sm font-semibold truncate" title={item.filename}>{item.filename}</p>
                                        <div className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                                            <p>{translations.fileSizeLabel} {formatFileSize(item.size)}</p>
                                            <p>{translations.uploadDateLabel} {formatDate(item.savedAt)}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-1.5 sm:p-2 border-t">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-[10px] sm:text-xs h-7 sm:h-8"
                                            onClick={() => handleDownload(item.url, item.filename)}
                                        >
                                            <Download className="mr-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            {translations.downloadButtonLabel}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })}
                    </div>
                </ScrollArea>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    )
}