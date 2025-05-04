import { useState, useEffect } from "react"
import { passwords as allPasswords } from "../data"
import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useNavigationState } from "@/store/useNavigationState"
import { Password } from "@/types"
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
import AdminUserManagementScreen from "./AdminUserManagementScreen"
import { UserListView } from "./UserListView"
import { AddUserView } from "./AddUserView"

export default function PasswordManagerView() {
  const { getCurrentScreen } = useNavigationState()

  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Específico de PasswordsScreen
  const [mounted, setMounted] = useState(false)
  const [editingPassword, setEditingPassword] = useState<string | null>(null) // Específico de PasswordsScreen
  const [editedPasswordData, setEditedPasswordData] = useState<Partial<Password>>({}) // Específico de PasswordsScreen
  // Específico de SettingsScreen

  const [minimizeOnCopy, setMinimizeOnCopy] = useState(false)

  // --- Effects ---
  useEffect(() => {
    setMounted(true)
  }, [])

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (minimizeOnCopy) {
      // Idealmente, chamar handleToggleMinimize se a animação for desejad
      // Ou apenas: setMinimized(true); se for instantâneo
    }
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
    <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-zinc-900" data-tauri-drag-region>
      <div className="w-full h-full bg-card flex flex-col overflow-hidden">
        <HeaderNavigation />

        <div key={getCurrentScreen()} className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-invisible">

          {getCurrentScreen() === NavigationScreen.LOGIN_EMAIL && <LoginEmailScreen />}

          {getCurrentScreen() === NavigationScreen.VERIFY_CODE && <VerifyCodeScreen />}

          {getCurrentScreen() === NavigationScreen.REGISTER_EMAIL && <RegisterScreen />}

          {getCurrentScreen() === NavigationScreen.LOGIN_ORGANIZATION && <LoginOrganizationScreen />}

          {getCurrentScreen() === NavigationScreen.LOGIN_PASSWORD && <LoginPasswordScreen />}

          {getCurrentScreen() === NavigationScreen.VAULTS && <VaultsScreen />}

          {getCurrentScreen() === NavigationScreen.CREATE_VAULTS && <CreateVaultScreen />}

          {getCurrentScreen() === NavigationScreen.ENVIRONMENTS && (
            <EnvironmentsScreen
              onEnvironmentClick={() => { }}
            />
          )}

          {getCurrentScreen() === NavigationScreen.CREATE_ENVIRONMENT && (<CreateEnvironmentScreen />)}



          {getCurrentScreen() === NavigationScreen.PASSWORDS && (
            <PasswordsScreen
              selectedVault={undefined}
              passwords={[]}
              selectedPassword={selectedPassword}
              editingPassword={editingPassword}
              editedPasswordData={editedPasswordData}
              showPassword={showPassword}

              onPasswordClick={handlePasswordClick}
              onStartEditing={startEditing} // Passa a função de iniciar edição
              onCancelEditing={cancelEditing}
              onSavePassword={savePasswordChanges} // Passa a função de salvar
              onEditChange={handleEditChange} // Passa a função de mudança de edição
              onShowPasswordToggle={setShowPassword}
              copyToClipboard={copyToClipboard} // Passa a função de copiar
              formatDate={formatDate} // Passa a função de formatar data
            />
          )}

          {getCurrentScreen() === NavigationScreen.CREATE_PASSWORDS && <AddPasswordScreen />}

          {getCurrentScreen() === NavigationScreen.SETTINGS && <SettingsScreen />}

          {getCurrentScreen() === NavigationScreen.ALL_USERS && <UserListView />}

          {getCurrentScreen() === NavigationScreen.ADD_USER && <AddUserView />}


        </div>
      </div>
    </div>
  )
}