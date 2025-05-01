import { useState, useRef, useEffect } from "react"
import { companies, passwords as allPasswords, vaults as allVaults } from "../data"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useNavigationState } from "@/store/useNavigationState"
import { Vault, Password } from "@/types"
import HeaderNavigation from "./HeaderNavigation"
import LoginEmailScreen from "./LoginEmailScreen"
import LoginOrganizationScreen from "./LoginOrganizationScreen"
import LoginPasswordScreen from "./LoginPasswordScreen"
import PasswordsScreen from "./PasswordsScreen"
import RegisterScreen from "./RegisterScreen"
import SettingsScreen from "./SettingsScreen"
import VaultsScreen from "./VaultsScreen"
import CreateVaultScreen from "./CreateVaultScreen"
import AddPasswordScreen from "./AddPasswordScreen"
import EnvironmentsScreen from "./EnvironmentsScreen"
import CreateEnvironmentScreen from "./CreateEnvironmentScreen"
import VerifyCodeScreen from "./VerifyCodeScreen"

export default function PasswordManagerView() {
  const { getCurrentScreen, navigateTo } = useNavigationState()

  const [selectedVault, setSelectedVault] = useState<Vault | null>(null)
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)

  const [showPassword, setShowPassword] = useState(false) // Específico de PasswordsScreen, mas pode ser útil manter aqui

  // Específico de PasswordsScreen
  const [mounted, setMounted] = useState(false)
  const [editingPassword, setEditingPassword] = useState<string | null>(null) // Específico de PasswordsScreen
  const [editedPasswordData, setEditedPasswordData] = useState<Partial<Password>>({}) // Específico de PasswordsScreen
  const [settingsTab, setSettingsTab] = useState("general") // Específico de SettingsScreen

  // Settings state (gerenciado aqui, passado para SettingsScreen)
  const [autoLockTimeout, setAutoLockTimeout] = useState(5)
  const [clipboardClearTimeout, setClipboardClearTimeout] = useState(30)
  const [showFavoritesFirst, setShowFavoritesFirst] = useState(true)
  const [minimizeOnCopy, setMinimizeOnCopy] = useState(false)

  const mainContainerRef = useRef<HTMLDivElement>(null) // Ref principal para ResizeObserver

  // --- Effects ---
  useEffect(() => {
    setMounted(true)
  }, [])

  // --- Funções de Callback ---
  const handleVaultClick = (vault: Vault) => {
    setSelectedVault(vault)
    navigateTo(NavigationScreen.PASSWORDS)
    setSelectedPassword(null) // Resetar ao mudar de cofre
    setEditingPassword(null)  // Resetar ao mudar de cofre
  }

  const handlePasswordClick = (password: Password) => {
    if (editingPassword === password.id) return;
    if (password.id === selectedPassword?.id) {
      setSelectedPassword(null);
    } else {
      setSelectedPassword(password);
      setEditingPassword(null); // Cancela edição ao selecionar outra senha
      setEditedPasswordData({});
    }
    // A lógica de scroll interno agora deve ir para PasswordsScreen
  }

  const navigateBack = () => {
    if (getCurrentScreen() === "passwords") {
      navigateTo(NavigationScreen.VAULTS)
      setSelectedPassword(null)
      setEditingPassword(null)
    } else if (getCurrentScreen() === "settings") {
      navigateTo(NavigationScreen.VAULTS) // Ou talvez voltar para a tela anterior? Aqui volta pra cofres.
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (minimizeOnCopy) {
      // Idealmente, chamar handleToggleMinimize se a animação for desejad
      // Ou apenas: setMinimized(true); se for instantâneo
    }
  }

  const toggleTheme = () => {
    // Implementar lógica de tema aqui ou em um contexto global
    console.log("Toggle theme clicked");
  }

  const openSettings = () => {
    navigateTo(NavigationScreen.SETTINGS)
    setSelectedPassword(null)
    setEditingPassword(null)
  }

  // Funções de Edição (passadas para PasswordsScreen)
  const startEditing = (password: Password) => {
    setEditingPassword(password.id);
    setEditedPasswordData({ // Inicia com dados atuais
      username: password.username,
      password: password.password,
      url: password.url,
      notes: password.notes,
    });
  }

  const cancelEditing = () => {
    setEditingPassword(null);
    setEditedPasswordData({});
  }

  const savePasswordChanges = (passwordId: string) => {
    console.log("Simulando salvar senha:", passwordId, editedPasswordData);
    // Aqui você atualizaria seus dados `allPasswords` e persistiria
    setEditingPassword(null);
    setEditedPasswordData({});
    // Pode ser necessário forçar um re-render ou atualizar a lista `filteredPasswords`
  }

  const handleEditChange = (field: keyof Password, value: string) => {
    setEditedPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // Função utilitária (pode ser movida para um arquivo utils.ts)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };


  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-zinc-900" data-tauri-drag-region>
      <div
        ref={mainContainerRef}
        className="w-full h-full bg-card flex flex-col overflow-hidden"
      >
        <HeaderNavigation />

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-invisible">

          {getCurrentScreen() === NavigationScreen.LOGIN_EMAIL && <LoginEmailScreen />}

          {getCurrentScreen() === NavigationScreen.VERIFY_CODE && <VerifyCodeScreen />}

          {getCurrentScreen() === NavigationScreen.REGISTER_EMAIL && <RegisterScreen />}

          {getCurrentScreen() === NavigationScreen.LOGIN_ORGANIZATION && <LoginOrganizationScreen />}

          {getCurrentScreen() === NavigationScreen.LOGIN_PASSWORD && <LoginPasswordScreen />}

          {getCurrentScreen() === NavigationScreen.ENVIRONMENTS && (
            <EnvironmentsScreen
              onEnvironmentClick={() => { }}
            />
          )}

          {getCurrentScreen() === NavigationScreen.CREATE_ENVIRONMENT && (<CreateEnvironmentScreen />)}

          {getCurrentScreen() === NavigationScreen.VAULTS && (
            <VaultsScreen
              vaults={allVaults}
              onVaultClick={handleVaultClick}
            />
          )}

          {getCurrentScreen() === NavigationScreen.PASSWORDS && selectedVault && ( // Garante que selectedVault não é null
            <PasswordsScreen
              // Dados necessários
              selectedVault={selectedVault}
              passwords={allPasswords.filter(p => p.vaultId === selectedVault.id)} // Filtra senhas aqui
              selectedPassword={selectedPassword}
              editingPassword={editingPassword}
              editedPasswordData={editedPasswordData}
              showPassword={showPassword}
              minimizeOnCopy={minimizeOnCopy} // Passa a configuração

              // Callbacks / Funções
              onNavigateBack={navigateBack}
              onPasswordClick={handlePasswordClick}
              onStartEditing={startEditing} // Passa a função de iniciar edição
              onCancelEditing={cancelEditing}
              onSavePassword={savePasswordChanges} // Passa a função de salvar
              onEditChange={handleEditChange} // Passa a função de mudança de edição
              onShowPasswordToggle={setShowPassword}
              onOpenSettings={openSettings}
              copyToClipboard={copyToClipboard} // Passa a função de copiar
              toggleTheme={toggleTheme}
              formatDate={formatDate} // Passa a função de formatar data
              mounted={mounted}
            />
          )}

          {getCurrentScreen() === NavigationScreen.SETTINGS && (
            <SettingsScreen
              // Estados das configurações
              settingsTab={settingsTab}
              autoLockTimeout={autoLockTimeout}
              clipboardClearTimeout={clipboardClearTimeout}
              showFavoritesFirst={showFavoritesFirst}
              minimizeOnCopy={minimizeOnCopy} // Usado na UI de settings

              // Callbacks para alterar configurações
              onSettingsTabChange={setSettingsTab}
              onAutoLockTimeoutChange={setAutoLockTimeout}
              onClipboardClearTimeoutChange={setClipboardClearTimeout}
              onShowFavoritesFirstChange={setShowFavoritesFirst}
              onMinimizeOnCopyChange={setMinimizeOnCopy}
              vaults={allVaults} // Para a lista de Gerenciar Cofres
            />
          )}

          {getCurrentScreen() === NavigationScreen.CREATE_VAULTS && (
            <CreateVaultScreen
              onSave={() => { }}
            />
          )}

          {getCurrentScreen() === NavigationScreen.CREATE_PASSWORDS && (
            <AddPasswordScreen
              onSave={() => { }} vault={selectedVault!} />
          )}
        </div>
      </div>
    </div>
  )
}