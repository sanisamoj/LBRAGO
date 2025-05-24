import { SavedMediaResponse } from "@/models/data/interfaces/SavedMediaResponse"

export interface MediaState {
    initState: () => Promise<void>
    removeMedia: (mediaId: string) => Promise<void>

    medias: SavedMediaResponse[]
}