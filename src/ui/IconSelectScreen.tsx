"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { iconCategories } from "@/models/data/others/iconCategories"
import { getIconUrl } from "@/utils/getIconUrl"
import { Config } from "@/Config"
import { useLanguageState } from "@/store/useLanguageState"
import { IconSelectorScreenProps } from "@/models/data/props/IconSelectorScreenProps"

export default function IconSelectorScreen({ imageUrl, setFile, setImageUrl }: IconSelectorScreenProps) {
  
  const { translations } = useLanguageState()
  const [previewImage, setPreviewImage] = useState<string | undefined>(Config.FAVICON_URL)
  const [activeTab, setActiveTab] = useState<string>(Config.FAVICON_URL ? "upload" : "icons")
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedIconUrl, setSelectedIconUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    const currentPreview = previewImage
    return () => {
      if (currentPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    }
  }, [previewImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (imageUrl) { setImageUrl(undefined) }
    setFile(file)

    const oldPreview = previewImage;
    const image = URL.createObjectURL(file)
    setPreviewImage(image)
    setActiveTab("upload")

    if (oldPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(oldPreview)
    }
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  const clearCustomImage = () => {
    const currentPreview = previewImage
    setPreviewImage(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""

    if (currentPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(currentPreview)
    }
  }

  const handleIconSelect = (iconIdentifier: string) => {
    const url: string = getIconUrl(iconIdentifier)
    setImageUrl(url)
    setFile(undefined)
    const currentPreview = previewImage

    setSelectedIconUrl(url)
    setPreviewImage(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setActiveTab("icons")

    if (currentPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(currentPreview);
    }
  }

  const displayUrl = previewImage || selectedIconUrl

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className={`h-10 w-10 border rounded-lg flex items-center justify-center cursor-pointer bg-white dark:bg-neutral-800`}
          onClick={() => setOpen(!open)}
        >
          {displayUrl ? (
            <img src={displayUrl} alt="Selected icon" className="h-6 w-6 object-contain" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          {!open && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs w-full"
              onClick={() => setOpen(true)}
            >
              {translations.selectIcon}
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="border rounded-lg p-4 space-y-4 bg-background">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">{translations.selectAnIcon}</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 h-7">
              <TabsTrigger value={translations.icons} className="text-[10px]"> {translations.icons} </TabsTrigger>
              <TabsTrigger value={translations.upload} className="text-[10px]"> {translations.upload} </TabsTrigger>
            </TabsList>

            <TabsContent value={translations.icons}className="mt-2">
              <ScrollArea className="custom-scroll-area max-h-60 overflow-y-auto space-y-3 pr-2">
                {iconCategories.map((category) => (
                  <div key={category.name} className="space-y-1">
                    <h4 className="text-[10px] font-medium text-muted-foreground">{category.name}</h4>
                    <div className="grid grid-cols-6 gap-1">
                      {category.icons.map((iconIdentifier) => {
                        const iconUrl = getIconUrl(iconIdentifier);
                        console.log(iconUrl)
                        return (
                          <div
                            key={iconIdentifier}
                            className={`h-8 w-8 border rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 transition bg-white dark:bg-zinc-900 ${selectedIconUrl === iconUrl && !previewImage ? "ring-2 ring-primary" : ""}`}
                            onClick={() => handleIconSelect(iconIdentifier)}
                          >
                            <img src={iconUrl} alt={iconIdentifier} className="h-5 w-5 object-contain" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>

            </TabsContent>

            <TabsContent value="upload" className="mt-2">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-4">
                {previewImage ? (
                  <>
                    <div className={`h-16 w-16 border rounded-lg flex items-center justify-center mb-2 bg-white dark:bg-neutral-800`}>
                      <img src={previewImage} alt="Preview" className="h-12 w-12 object-contain" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={triggerFileInput}>{translations.replace}</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={clearCustomImage}>{translations.remove}</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-xs text-center text-muted-foreground">{translations.dragOrClickToUpload}</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs mt-2" onClick={triggerFileInput}>
                      {translations.selectImage}
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </TabsContent>
          </Tabs>

        </div>
      )}
    </div>
  )
}