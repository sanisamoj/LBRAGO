# LBRAGO 🔒

[![Status do Build](https://img.shields.io/github/actions/workflow/status/sanisamoj/LBRAGO.git/build.yml?branch=main)](https://github.com/sanisamoj/LBRAGO.git/actions)
[![Última Release](https://img.shields.io/github/v/release/sanisamoj/LBRAGO.git)](https://github.com/sanisamoj/LBRAGO.git/releases/latest)
[![Licença](https://img.shields.io/github/license/sanisamoj/LBRAGO.git)](LICENSE)

**Um gerenciador de senhas seguro, de código aberto, com arquitetura Zero-Knowledge e Criptografia de Ponta-a-Ponta (E2EE), agora no seu desktop.**

## Introdução

LBRAGO é a aplicação de desktop para o LemBraGO, projetada para oferecer uma maneira segura e privada de armazenar, gerenciar e compartilhar suas senhas e informações sensíveis. Construído sobre uma arquitetura Zero-Knowledge, garantimos que **nem mesmo nós** (os desenvolvedores do serviço) podemos acessar suas senhas descriptografadas. Seus dados são criptografados e descriptografados localmente no seu dispositivo usando sua Senha Mestra, que nunca sai do seu computador.

Esta aplicação sincroniza seus dados criptografados com nosso servidor seguro (Backend em Go), permitindo acesso em múltiplos dispositivos sem comprometer sua privacidade.

## ✨ Funcionalidades Principais

* **Segurança Zero-Knowledge:** Seus dados mais sensíveis são inacessíveis para o servidor.
* **Criptografia de Ponta-a-Ponta (E2EE):** Toda criptografia/descriptografia ocorre localmente no seu dispositivo.
* **Senha Mestra Forte:** Única chave que você precisa memorizar, usada para derivar suas chaves de criptografia (via Argon2id).
* **Cofres Seguros:** Organize suas senhas e segredos em cofres individuais.
* **Compartilhamento Seguro:** Compartilhe cofres com outros usuários da sua organização de forma segura, usando criptografia assimétrica (ECC/Curve25519).
* **Multiplataforma:** Disponível para Windows, macOS e Linux (graças ao Tauri).
* **Gerador de Senhas Fortes:** Crie senhas complexas e únicas facilmente.
* **Acesso Offline:** Acesse seus dados armazenados localmente mesmo sem conexão com a internet (após o primeiro login/sincronização). // Verificar possível implementação
* **(Opcional) Preenchimento Automático:** Integração com navegadores para preenchimento automático (se implementado).
* **(Opcional) Suporte a Organizações:** Gerencie usuários e acessos dentro de uma estrutura organizacional (dependendo do plano).

## 🔐 Modelo de Segurança

A segurança e a privacidade são a base deste projeto.

* **Senha Mestra (MP):** Nunca transmitida ou armazenada no servidor. Usada localmente para derivar:
    * **Verificador de Senha (PV):** Um hash seguro (Argon2id) enviado ao servidor *apenas* para verificar o login, sem revelar a MP.
    * **Chave de Criptografia (EK):** Chave intermediária (não armazenada) usada para criptografar/descriptografar sua Chave Secreta (SK).
* **Chave Secreta (SK):** Sua chave principal de criptografia simétrica (AES-GCM), gerada localmente e armazenada no servidor de forma criptografada (`ESK`). Usada para proteger sua Chave Privada (`UserPrivK`).
* **Par de Chaves Assimétricas (`UserPubK`/`UserPrivK`):** Usadas para o compartilhamento seguro de cofres (RSA). Sua `UserPrivK` é criptografada com sua `SK` e armazenada no servidor (`EUserPrivK`).
* **Chave de Cofre Compartilhado (SVK):** Chave simétrica (AES-GCM) única para cada cofre, usada para criptografar os metadados e itens do cofre. Ao compartilhar, a SVK é criptografada com a `UserPubK` de cada membro.
* **Servidor:** Armazena apenas dados que não pode descriptografar: `PV`, `salts`, `ESK`, `EUserPrivK`, metadados e itens criptografados (`EncryptedVaultMetadata`, `EID`), e as chaves de cofre criptografadas para cada membro (`ESVK_PubKey_User`).

**Em resumo: Seus dados sensíveis só existem em formato legível no seu dispositivo, quando você está logado.**

## 🖼️ Screenshots

![Login](https://www.sanisamojrepository.com/image-repo/media?media=zkxSnD1DzY4sjzrfKk56Ym6wNpYwA74NDCnP-Captura%20de%20tela%202025-05-03%20170226.png)

## 🚀 Instalação

Você pode baixar a versão mais recente para o seu sistema operacional na nossa [**Página de Releases**](https://github.com/seu_usuario/seu_repo/releases/latest).

* **Windows:** Baixe o arquivo `.msi` e siga o instalador.
* **macOS:** Baixe o arquivo `.dmg`, abra-o e arraste o aplicativo para a pasta "Aplicativos".
* **Linux:** Baixe o arquivo `.deb` (para sistemas baseados em Debian/Ubuntu) ou `.AppImage`.
    * Para `.deb`: `sudo dpkg -i nome_do_arquivo.deb` (pode precisar de `sudo apt --fix-broken install`).
    * Para `.AppImage`: Dê permissão de execução (`chmod +x nome_do_arquivo.AppImage`) e execute (`./nome_do_arquivo.AppImage`).

## 🖱️ Uso Básico

1.  Abra a aplicação LBRAGO.
2.  **Crie uma Conta:** Se for seu primeiro acesso, siga as instruções para criar sua conta, definindo seu email e uma **Senha Mestra forte e única**. Guarde-a bem!
3.  **Faça Login:** Use seu email (e identificador da organização, se aplicável) e sua Senha Mestra.
4.  **Crie um Cofre:** Organize seus itens criando cofres (ex: "Pessoal", "Trabalho").
5.  **Adicione Itens:** Clique para adicionar novos itens (logins de sites, notas seguras, etc.), preenchendo as informações necessárias. Use o gerador de senhas para criar senhas fortes.
6.  **Compartilhe Cofres (Opcional):** Se precisar dar acesso a um cofre para outro usuário da sua organização, use a opção de compartilhar.

## 🛠️ Tecnologias Utilizadas

* **Framework Aplicação:** [Tauri](https://tauri.app/) (Backend Rust + Scripts GO + Frontend via Webview)
* **Linguagem Frontend:** React + TypeScript
* **Linguagem Backend (Tauri Core):** Rust
* **Criptografia (Client-side):** Implementada com Go. Este código é compilado em um executável auxiliar que é invocado pela aplicação Tauri a partir do frontend JavaScript.
As operações criptográficas (`crypto/aes`, `crypto/cipher`, `crypto/rand`, `crypto/rsa`, `crypto/sha256`, `crypto/x509`, `golang.org/x/crypto/argon2`) são executadas neste processo Go separado, localmente na máquina do usuário.
* **API Backend (Sincronização):** Go
* **Banco de Dados (Backend):** MongoDB

## 💻 Desenvolvimento (Para Contribuidores)

Interessado em contribuir? Ótimo!

**Pré-requisitos:**

* [Node.js](https://nodejs.org/) (versão 22.14.0 ou superior)
* [Rust](https://www.rust-lang.org/tools/install) e Cargo
* Dependências do sistema para Tauri (veja a [documentação do Tauri](https://tauri.app/v1/guides/getting-started/prerequisites))
* [Gerenciador de Pacotes: pnpm]

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/sanisamoj/LBRAGO](https://github.com/sanisamoj/LBRAGO)
    cd seu_repo
    ```
2.  **Instale as dependências do frontend:**
    ```bash
    pnpm install
    ```
3.  **Execute em modo de desenvolvimento:**
    ```bash
    pnpm run tdev
    ```
4.  **Build da aplicação:**
    ```bash
    pnpm run tauri build
    ```