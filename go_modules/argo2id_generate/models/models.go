package models

type User struct {
	PasswordVerifier PasswordVerifier `json:"passwordVerifier"`
	SaltEk           string           `json:"salt_ek"`
	Keys             Keys             `json:"keys"`
}

type CreateUserParameters struct {
	Password   string                     `json:"password"`
	Parameters PasswordVerifierParameters `json:"parameters"`
}

type DecryptedUserKeys struct {
	PrivateKey string `json:"privateKey"`
}

type PasswordVerifierParameters struct {
	Memory      uint32 `json:"memory"`
	Time        uint32 `json:"time"`
	Parallelism uint8  `json:"parallelism"`
	SaltLength  uint32 `json:"saltLength"`
	KeyLength   uint32 `json:"keyLength"`
}

type Keys struct {
	PublicKey           string              `json:"publicKey"`
	EncryptedPrivateKey AesGcmEncryptedData `json:"encryptedPrivateKey"`
	EncryptedSecretKey  AesGcmEncryptedData `json:"encryptedSecretKey"`
}

type MyVault struct {
	EVaultMetadata AesGcmEncryptedData `json:"e_vaultmetadata"`
	EsvkPubKUser   string              `json:"esvk_pubK_user"`
}

type PasswordVerifier struct {
	Salt       string                     `json:"salt"`
	Verifier   string                     `json:"verifier"`
	Parameters PasswordVerifierParameters `json:"parameters"`
}

type PasswordHashData struct {
	Salt string `json:"salt"` // Base64 encoded salt
	Hash string `json:"hash"` // Base64 encoded hash
}

type AesGcmEncryptedData struct {
	Nonce  string `json:"nonce"`      // Base64 encoded nonce
	Cipher string `json:"ciphertext"` // Base64 encoded cipher
}

type RsaKeyPair struct {
	PublicKey  string // Base64 encoded PEM
	PrivateKey string // Base64 encoded PEM
}