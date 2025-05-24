import { SavedMediaResponse } from "@/models/data/interfaces/SavedMediaResponse"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"
import { create } from "zustand"

export interface MediaState {
    initState: () => Promise<void>
    removeMedia: (mediaId: string) => Promise<void>

    medias: SavedMediaResponse[]
}

export const useMediaState = create<MediaState>((set, get) => ({
    medias: [],

    initState: async () => {
        try {
            const repository = EnvironmentRepository.getInstance()
            const medias: SavedMediaResponse[] = await repository.getAllMedias()
            set({ medias })
        } catch (error) {}
    },

    removeMedia: async (mediaId: string) => {
        const updatedMedias: SavedMediaResponse[] = get().medias.filter(media => media.id !== mediaId)
        set({ medias: updatedMedias })
    }
}))