import { NavigationScreen } from "@/models/data/enums/NavigationScreen"
import { useNavigationState } from "@/store/useNavigationState"
import HeaderNavigation from "./HeaderNavigation"
import LoginEmailScreen from "./LoginEmailScreen"
import LoginOrganizationScreen from "./LoginOrganizationScreen"
import LoginPasswordScreen from "./LoginPasswordScreen"
import RegisterScreen from "./RegisterScreen"
import SettingsScreen from "./SettingsScreen"
import CreateVaultScreen from "./CreateVaultScreen"
import AddPasswordScreen from "./AddPasswordScreen"
import EnvironmentsScreen from "./EnvironmentsScreen"
import CreateEnvironmentScreen from "./CreateEnvironmentScreen"
import VerifyCodeScreen from "./VerifyCodeScreen"
import { UserListView } from "./UserListView"
import InviteUserScreen from "./InviteUserScreen"
import { VaultUserListView } from "./VaultUserListView"
import VaultsListScreen from "./VaultsListScreen"
import PasswordsListScreen from "./PasswordsListScreen"

export default function LBragoApp() {
  const { getCurrentScreen } = useNavigationState()

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

          {getCurrentScreen() === NavigationScreen.VAULTS && <VaultsListScreen />}

          {getCurrentScreen() === NavigationScreen.CREATE_VAULTS && <CreateVaultScreen />}

          {getCurrentScreen() === NavigationScreen.ENVIRONMENTS && <EnvironmentsScreen />}

          {getCurrentScreen() === NavigationScreen.CREATE_ENVIRONMENT && <CreateEnvironmentScreen />}

          {getCurrentScreen() === NavigationScreen.PASSWORDS && <PasswordsListScreen />}

          {getCurrentScreen() === NavigationScreen.MANAGE_VAULT_MEMBERS && <VaultUserListView />}

          {getCurrentScreen() === NavigationScreen.CREATE_PASSWORDS && <AddPasswordScreen />}

          {getCurrentScreen() === NavigationScreen.SETTINGS && <SettingsScreen />}

          {getCurrentScreen() === NavigationScreen.ALL_USERS && <UserListView />}

          {getCurrentScreen() === NavigationScreen.ADD_USER && <InviteUserScreen />}
        </div>
      </div>
    </div>
  )
}