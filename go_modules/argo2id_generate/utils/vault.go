package utils

import (
	"encoding/json"
	"lembrago/models"
)

func RegenerateSVK(eskvPubKUser, privKeyBase64 string) ([]byte, error) {
	svk, err := DecryptWithRsaPrivateKey(eskvPubKUser, privKeyBase64)
	if err != nil {
		return nil, err
	}

	return svk, nil
}

func DecryptVaultMetadata(svk []byte, parameters models.AesGcmEncryptedData) (*models.DecryptedVault, error) {
	cipherBytes, err := Base64ToBytes(parameters.Cipher)
	if err != nil {
		return nil, err
	}

	nonceBytes, err := Base64ToBytes(parameters.Nonce)
	if err != nil {
		return nil, err
	}

	metadataBytes, err := AesGcmDecrypt(svk, nonceBytes, cipherBytes)
	if err != nil {
		return nil, err
	}

	var decryptedData models.DecryptedVault
	err = json.Unmarshal(metadataBytes, &decryptedData)
	if err != nil {
		return nil, err
	}

	return &decryptedData, nil
}


