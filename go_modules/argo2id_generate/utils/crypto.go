package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"lembrago/models"
	"log"

	"golang.org/x/crypto/argon2"
)

const (
	SaltLenBytes      uint32 = 16    // 16 bytes is a common length for salts
	Argon2MemCostKiB  uint32 = 65536 // 64 MiB (corresponds to memoryCost: ARGON2_MEM_COST_KIB)
	Argon2TimeCost    uint32 = 6     // corresponds to timeCost: ARGON2_TIME_COST
	Argon2Parallelism uint8  = 4     // corresponds to parallelism: ARGON2_PARALLELISM
	HashLenBytes      uint32 = 32    // corresponds to hashLength: HASH_LEN_BYTES
)

const rsaKeySize = 4096

func GeneratePasswordHash(password string) (*models.PasswordHashData, error) {
	salt := make([]byte, SaltLenBytes)
	_, err := rand.Read(salt)
	if err != nil {
		log.Printf("Error generating random salt: %v\n", err)
		return nil, fmt.Errorf("failed to generate salt: %w", err)
	}

	hashBytes := argon2.IDKey(
		[]byte(password),
		salt,
		Argon2TimeCost,
		Argon2MemCostKiB,
		Argon2Parallelism,
		HashLenBytes,
	)

	saltBase64 := BytesToBase64(salt)
	hashBase64 := BytesToBase64(hashBytes)

	return &models.PasswordHashData{
		Salt: saltBase64,
		Hash: hashBase64,
	}, nil

}

func AesGcmEncrypt(plaintext []byte, key []byte) (models.AesGcmEncryptedData, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		log.Printf("Error creating AES cipher: %v\n", err)
		return models.AesGcmEncryptedData{}, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	nonce := make([]byte, 12)
	if _, err := rand.Read(nonce); err != nil {
		log.Printf("Error generating random nonce: %v\n", err)
		return models.AesGcmEncryptedData{}, fmt.Errorf("failed to generate nonce: %w", err)
	}

	aesGcm, err := cipher.NewGCM(block)
	if err != nil {
		log.Printf("Error creating GCM cipher: %v\n", err)
		return models.AesGcmEncryptedData{}, fmt.Errorf("failed to create GCM cipher: %w", err)
	}

	ciphertext := aesGcm.Seal(nil, nonce, plaintext, nil)
	return models.AesGcmEncryptedData{
		Nonce:  BytesToBase64(nonce),
		Cipher: BytesToBase64(ciphertext),
	}, nil
}

func AesGcmDecrypt(key, nonce, ciphertext []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		log.Printf("Error creating AES cipher: %v\n", err)
		return nil, fmt.Errorf("failed to create AES cipher: %w", err)
	}

	aesGcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	plaintext, err := aesGcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, err
	}

	return plaintext, err
}

func GenerateRsaKeys() (models.RsaKeyPair, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, rsaKeySize)
	if err != nil {
		log.Printf("Error generating RSA private key: %v\n", err)
		return models.RsaKeyPair{}, fmt.Errorf("failed to generate RSA private key: %w", err)
	}

	publicKey := &privateKey.PublicKey

	// Encode Private Key to PEM format
	privBytes := x509.MarshalPKCS1PrivateKey(privateKey) // Ou PKCS8
	privPem := pem.EncodeToMemory(&pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privBytes,
	})

	// Encode Public Key to PEM format
	pubBytes, err := x509.MarshalPKIXPublicKey(publicKey)
	if err != nil {
		log.Printf("Error marshalling RSA public key: %v\n", err)
		return models.RsaKeyPair{}, fmt.Errorf("failed to marshal RSA public key: %w", err)
	}
	pubPem := pem.EncodeToMemory(&pem.Block{
		Type:  "PUBLIC KEY",
		Bytes: pubBytes,
	})

	return models.RsaKeyPair{
		PublicKey:  BytesToBase64(pubPem),
		PrivateKey: BytesToBase64(privPem),
	}, nil
}

func EncryptWithRsaPublicKey(data []byte, pubKeyBase64 string) (string, error) {
	pubPemBytes, err := base64.RawStdEncoding.DecodeString(pubKeyBase64)
	if err != nil {
		log.Printf("Error decoding base64 public key: %v\n", err)
		return "", fmt.Errorf("failed to decode base64 public key: %w", err)
	}

	block, _ := pem.Decode(pubPemBytes)
	if block == nil || block.Type != "PUBLIC KEY" {
		log.Println("Failed to decode PEM block containing public key")
		return "", fmt.Errorf("failed to decode PEM block containing public key")
	}

	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		log.Printf("Error parsing public key: %v\n", err)
		return "", fmt.Errorf("failed to parse public key: %w", err)
	}

	rsaPubKey, ok := pub.(*rsa.PublicKey)
	if !ok {
		log.Println("Public key is not an RSA key")
		return "", fmt.Errorf("key is not an RSA public key")
	}

	// Use OAEP for padding
	ciphertext, err := rsa.EncryptOAEP(sha256.New(), rand.Reader, rsaPubKey, data, nil)
	if err != nil {
		log.Printf("Error encrypting data with RSA public key: %v\n", err)
		return "", fmt.Errorf("failed to encrypt with RSA public key: %w", err)
	}

	return BytesToBase64(ciphertext), nil
}

func DecryptWithRsaPrivateKey(ciphertextBase64 string, privKeyBase64 string) ([]byte, error) {
	privPemBytes, err := base64.RawStdEncoding.DecodeString(privKeyBase64)
	if err != nil {
		log.Printf("Error decoding base64 private key: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 private key: %w", err)
	}

	block, _ := pem.Decode(privPemBytes)
	if block == nil || block.Type != "RSA PRIVATE KEY" { // Adjust type if you used PKCS8
		log.Println("Failed to decode PEM block containing private key")
		return nil, fmt.Errorf("failed to decode PEM block containing private key")
	}

	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes) // Or ParsePKCS8PrivateKey
	if err != nil {
		log.Printf("Error parsing private key: %v\n", err)
		return nil, fmt.Errorf("failed to parse private key: %w", err)
	}

	ciphertext, err := base64.RawStdEncoding.DecodeString(ciphertextBase64)
	if err != nil {
		log.Printf("Error decoding base64 ciphertext: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 ciphertext: %w", err)
	}

	// Use OAEP for padding
	plaintext, err := rsa.DecryptOAEP(sha256.New(), rand.Reader, priv, ciphertext, nil)
	if err != nil {
		log.Printf("Error decrypting data with RSA private key: %v\n", err)
		return nil, fmt.Errorf("failed to decrypt with RSA private key: %w", err)
	}

	return plaintext, nil
}

func GenerateAES256Key() ([]byte, error) {
	key := make([]byte, 32)
	_, err := rand.Read(key)
	if err != nil {
		return nil, fmt.Errorf("failed to generate AES key: %w", err)
	}
	return key, nil
}

func Base64ToBytes(base64Str string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(base64Str)
}

func BytesToBase64(bytes []byte) string {
	return base64.StdEncoding.EncodeToString(bytes)
}
