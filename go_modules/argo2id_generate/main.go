package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"lembrago/models"
	"lembrago/utils"
	"log"
	"os"
)

func main() {
	createUserF := flag.String("cn", "", "User passwords")
	pvGenerateF := flag.String("pv", "", "Generate password verifier")
	privKRegenerateF := flag.String("pk", "", "Regenerate private key")

	decryptVMetadataF := flag.String("dvm", "", "Regenerate vault metadata")
	encryptVMetadataF := flag.String("evm", "", "Encrypt vault metadata")

	decryptPMetadataF := flag.String("dpm", "", "Regenerate password metadata")
	encryptPMetadataF := flag.String("epm", "", "Encrypt password metadata")
	flag.Parse()

	actionTaken := false

	if *createUserF != "" {
		var dto models.CreateUserParameters
		err := json.Unmarshal([]byte(*createUserF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}
		utils.GenerateUser(dto)
		actionTaken = true
		os.Exit(0)
	}

	if *pvGenerateF != "" {
		var dto models.PVGenerateDTO
		err := json.Unmarshal([]byte(*pvGenerateF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		phd, err := utils.GeneratePswHashWithParam(dto)
		if err != nil {
			log.Printf("Error generating password hash: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(phd)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if *privKRegenerateF != "" {
		var dto models.RegenerateUserKeysDTO
		err := json.Unmarshal([]byte(*privKRegenerateF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		keys, err := utils.RegenerateUserKeys(dto.PVGenerateDTO, dto.Keys)
		if err != nil {
			log.Printf("Error generating RSA key pair: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(keys)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if *decryptVMetadataF != "" {
		var dto models.DecryptVaultMetadataDTO
		err := json.Unmarshal([]byte(*decryptVMetadataF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		svk, err := utils.RegenerateSVK(dto.ESKPubUserK, dto.PrivUserK)
		if err != nil {
			log.Printf("Error generating RSA and Sk key pair: %v\n", err)
			os.Exit(1)
		}

		decryptedVault, err := utils.DecryptVaultMetadata(svk, dto.VaultMetadata)
		if err != nil {
			log.Printf("Error regenerating vault metadata: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(decryptedVault)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if *encryptVMetadataF != "" {
		var dto models.EncryptVaultMetadataDTO
		err := json.Unmarshal([]byte(*encryptVMetadataF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		evmetada, err := utils.EncryptVaultMetadata(dto.UserPubK, dto.Metadata)
		if err != nil {
			log.Printf("Error encrypting vault metadata: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(evmetada)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if *encryptPMetadataF != "" {
		var dto models.EncryptPasswordMetadataDTO
		err := json.Unmarshal([]byte(*encryptPMetadataF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		encryptedPasswordMetadata, err := utils.EncryptPasswordMetadata(dto.ESVKPubUserK, dto.PrivUserK, dto.PasswordMetadata)
		if err != nil {
			log.Printf("Error encrypting password metadata: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(encryptedPasswordMetadata)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if *decryptPMetadataF != "" {
		var dto models.DecryptPasswordMetadataDTO
		err := json.Unmarshal([]byte(*decryptPMetadataF), &dto)
		if err != nil {
			log.Printf("Error unmarshalling json: %v\n", err)
			os.Exit(1)
		}

		decryptedPasswordMetadata, err := utils.DecryptPasswordMetadata(dto.ESVKPubUserK, dto.PrivUserK, dto.EncryptedPasswordMetadata)
		if err != nil {
			log.Printf("Error decrypting password metadata: %v\n", err)
			os.Exit(1)
		}

		jsonData, err := json.Marshal(decryptedPasswordMetadata)
		if err != nil {
			log.Printf("Error generating json: %v", err)
			os.Exit(1)
		}

		fmt.Println(string(jsonData))

		actionTaken = true
		os.Exit(0)
	}

	if !actionTaken {
		log.Printf("Provide actions (--cn or --pv)")
		flag.Usage()
		os.Exit(1)
	}
}
