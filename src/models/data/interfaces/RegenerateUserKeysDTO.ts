import { Keys } from "./Keys"
import { PVGenerateDTO } from "./PVGenerateDTO"

export interface RegenerateUserKeysDTO {
    pVGenerateDTO: PVGenerateDTO
    keys: Keys
}