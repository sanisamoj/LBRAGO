package models

type PVGenerateDTO struct {
	Salt       string                     `json:"salt"`
	Parameters PasswordVerifierParameters `json:"parameters"`
	Password   string                     `json:"password"`
}

type RegenerateUserKeysDTO struct {
	PVGenerateDTO PVGenerateDTO `json:"pvGenerateDTO"`
	Keys          Keys          `json:"keys"`
}
type DecryptVaultMetadataDTO struct {
	VaultMetadata AesGcmEncryptedData `json:"encryptedVaultMetadata"`
	PrivUserK     string              `json:"privUserK"`
	ESKPubUserK   string              `json:"esvkPubKUser"`
}

type DecryptedVault struct {
	ImageUrl    string `json:"imageUrl"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
