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

	if !actionTaken {
		log.Printf("Provide actions (--cn or --pv)")
		flag.Usage()
		os.Exit(1)
	}
}
