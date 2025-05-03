package utils

import (
	"encoding/json"
	"fmt"
	"lembrago/models"
	"log"
	"os"

	"golang.org/x/crypto/argon2"
)

func GenerateUser(arg models.CreateUserParameters) {
	pvHash, err := GeneratePasswordHash(arg.Password, arg.Parameters)
	if err != nil {
		log.Printf("Error generating password hash: %v\n", err)
		os.Exit(1)
	}
	ekHash, err := GeneratePasswordHash(arg.Password, arg.Parameters)
	if err != nil {
		log.Printf("Error generating password hash: %v\n", err)
		os.Exit(1)
	}

	keys, err := GenerateRsaKeys()
	if err != nil {
		log.Printf("Error generating RSA key pair: %v\n", err)
		os.Exit(1)
	}

	sk, err := GenerateAES256Key()
	if err != nil {
		log.Printf("Error generating sk: %v\n", err)
		os.Exit(1)
	}

	privKBytes, err := Base64ToBytes(keys.PrivateKey)
	if err != nil {
		log.Printf("Error generating privKBytes: %v\n", err)
		os.Exit(1)
	}
	eUserPrik, err := AesGcmEncrypt(privKBytes, sk)
	if err != nil {
		log.Printf("Error generating eUserPrik: %v", err)
		os.Exit(1)
	}

	ekBytes, err := Base64ToBytes(ekHash.Hash)
	if err != nil {
		log.Printf("Error generating ekBytes: %v", err)
		os.Exit(1)
	}
	esk, err := AesGcmEncrypt(sk, ekBytes)
	if err != nil {
		log.Printf("Error generating esk: %v", err)
		os.Exit(1)
	}

	user := models.User{
		PasswordVerifier: models.PasswordVerifier{
			Salt:     pvHash.Salt,
			Verifier: pvHash.Hash,
			Parameters: models.PasswordVerifierParameters{
				Memory:      Argon2MemCostKiB,
				Time:        Argon2TimeCost,
				Parallelism: Argon2Parallelism,
				SaltLength:  SaltLenBytes,
				KeyLength:   HashLenBytes,
			},
		},
		SaltEk: ekHash.Salt,
		Keys: models.Keys{
			PublicKey: keys.PublicKey,
			EncryptedPrivateKey: models.AesGcmEncryptedData{
				Cipher: eUserPrik.Cipher,
				Nonce:  eUserPrik.Nonce,
			},
			EncryptedSecretKey: models.AesGcmEncryptedData{
				Cipher: esk.Cipher,
				Nonce:  esk.Nonce,
			},
		},
	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		log.Printf("Error generating json: %v", err)
		os.Exit(1)
	}

	fmt.Println(string(jsonData))
}

func RegenerateUserKeys(dto models.PVGenerateDTO, keys models.Keys) (*models.DecryptedUserKeys, error) {
	ek_saltBytes, err := Base64ToBytes(dto.Salt)
	if err != nil {
		log.Printf("Error decoding base64 salt: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 salt: %w", err)
	}

	ekBytesAttempt := argon2.IDKey(
		[]byte(dto.Password),
		ek_saltBytes,
		dto.Parameters.Time,
		dto.Parameters.Memory,
		dto.Parameters.Parallelism,
		dto.Parameters.KeyLength,
	)

	eskCipherBytes, err := Base64ToBytes(keys.EncryptedSecretKey.Cipher)
	if err != nil {
		log.Printf("Error decoding base64 secret key: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 secret key: %w", err)
	}
	eskNonceBytes, err := Base64ToBytes(keys.EncryptedSecretKey.Nonce)
	if err != nil {
		log.Printf("Error decoding base64 nonce: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 nonce: %w", err)
	}

	sk, err := AesGcmDecrypt(ekBytesAttempt, eskNonceBytes, eskCipherBytes)
	if err != nil {
		log.Printf("Error decrypting secret key: %v\n", err)
		return nil, fmt.Errorf("failed to decrypt secret key: %w", err)
	}

	uPrivKCipherBytes, err := Base64ToBytes(keys.EncryptedPrivateKey.Cipher)
	if err != nil {
		log.Printf("Error decoding base64 user private key: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 user private key: %w", err)
	}
	uPrivKNonceBytes, err := Base64ToBytes(keys.EncryptedPrivateKey.Nonce)
	if err != nil {
		log.Printf("Error decoding base64 nonce: %v\n", err)
		return nil, fmt.Errorf("failed to decode base64 nonce: %w", err)
	}

	userPrivK, err := AesGcmDecrypt(sk, uPrivKNonceBytes, uPrivKCipherBytes)
	if err != nil {
		log.Printf("Error decrypting user private key: %v\n", err)
		return nil, fmt.Errorf("failed to decrypt user private key: %w", err)
	}

	userPrivK_base64 := BytesToBase64(userPrivK)
	
	return &models.DecryptedUserKeys{ PrivateKey: userPrivK_base64 }, nil
}
