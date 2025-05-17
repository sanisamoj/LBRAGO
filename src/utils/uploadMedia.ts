import { SavedMediaResponse } from "@/models/data/interfaces/SavedMediaResponse"
import { EnvironmentRepository } from "@/models/repository/EnvironmentRepository"

export async function UploadMedia(file: File): Promise<SavedMediaResponse> {
    const repository = EnvironmentRepository.getInstance()
    const savedMediaResponse: SavedMediaResponse = await repository.uploadMedia(file)
    return savedMediaResponse
}