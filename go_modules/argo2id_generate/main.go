package main

import (
	"encoding/json"
	"fmt"
	"lembrago/models"
	"lembrago/utils"
	"log"
	"os"
)

func main() {
	password := os.Args[1]
	pvHash, err := utils.GeneratePasswordHash(password)
	if err != nil {
		log.Printf("Error generating password hash: %v\n", err)
		os.Exit(1)
	}
	ekHash, err := utils.GeneratePasswordHash(password)
	if err != nil {
		log.Printf("Error generating password hash: %v\n", err)
		os.Exit(1)
	}

	keys, err := utils.GenerateRsaKeys()
	if err != nil {
		log.Printf("Error generating RSA key pair: %v\n", err)
		os.Exit(1)
	}

	sk, err := utils.GenerateAES256Key()
	if err != nil {
		log.Printf("Error generating sk: %v\n", err)
		os.Exit(1)
	}

	privKBytes, err := utils.Base64ToBytes(keys.PrivateKey)
	if err != nil {
		log.Printf("Error generating privKBytes: %v\n", err)
		os.Exit(1)
	}
	eUserPrik, err := utils.AesGcmEncrypt(privKBytes, sk)
	if err != nil {
		log.Printf("Error generating eUserPrik: %v", err)
		os.Exit(1)
	}

	ekBytes, err := utils.Base64ToBytes(ekHash.Hash)
	if err != nil {
		log.Printf("Error generating ekBytes: %v", err)
		os.Exit(1)
	}
	esk, err := utils.AesGcmEncrypt(sk, ekBytes)
	if err != nil {
		log.Printf("Error generating esk: %v", err)
		os.Exit(1)
	}

	user := models.User{
		PasswordVerifier: models.PasswordVerifier{
			Salt:     pvHash.Salt,
			Verifier: pvHash.Hash,
			Parameters: models.PasswordVerifierParameters{
				Memory:      utils.Argon2MemCostKiB,
				Time:        utils.Argon2TimeCost,
				Parallelism: utils.Argon2Parallelism,
				SaltLength:  utils.SaltLenBytes,
				KeyLength:   utils.HashLenBytes,
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
