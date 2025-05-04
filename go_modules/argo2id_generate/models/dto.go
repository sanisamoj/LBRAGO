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

type DecryptedPasswordMetadata struct {
	Name        string `json:"name"`
	ImageUrl    string `json:"imageUrl"`
	Username    string `json:"username"`
	Description string `json:"description"`
	Url         string `json:"url"`
	Password    string `json:"password"`
	Notes       string `json:"notes"`
}

type EncryptedVault struct {
	EcryptedVaultMetadata AesGcmEncryptedData `json:"e_vaultmetadata"`
	EncryptedPubKUser     string              `json:"esvk_pubK_user"`
}

type EncryptVaultMetadataDTO struct {
	UserPubK string         `json:"userPubkey"`
	Metadata DecryptedVault `json:"metadata"`
}

type EncryptPasswordMetadataDTO struct {
	PasswordMetadata DecryptedPasswordMetadata `json:"encryptedPasswordMetadata"`
	PrivUserK        string                    `json:"privUserK"`
	ESVKPubUserK     string                    `json:"esvkPubKUser"`
}

type DecryptPasswordMetadataDTO struct {
	EncryptedPasswordMetadata AesGcmEncryptedData `json:"encryptedPasswordMetadata"`
	PrivUserK                 string              `json:"privUserK"`
	ESVKPubUserK              string              `json:"esvkPubKUser"`
}
