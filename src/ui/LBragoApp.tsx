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
import { VaultUser } from "@/models/data/interfaces/VaultUser"
import { useState } from "react"
import { VaultUserListView } from "./VaultUserListView"
import VaultsListScreen from "./VaultsListScreen"
import PasswordsListScreen from "./PasswordsListScreen"

export default function LBragoApp() {
  const { getCurrentScreen } = useNavigationState()

  const allCompanyUsersExample: VaultUser[] = [
    { id: "1", email: "alice@example.com", name: "Alice Wonderland", avatar: "/placeholder.svg?text=AW" },
    { id: "2", email: "bob@example.com", name: "Bob The Builder", avatar: "/placeholder.svg?text=BB" },
    { id: "3", email: "carol@example.com", name: "Carol Danvers", avatar: "/placeholder.svg?text=CD" },
    { id: "4", email: "david@example.com", name: "David Copperfield", avatar: "/placeholder.svg?text=DC" },
    { id: "5", email: "eve@example.com", name: "Eve Harrington", avatar: "/placeholder.svg?text=EH" },
  ];

  const [initialVaultUsersExample, setInitialVaultUsersExample] = useState<VaultUser[]>([
    allCompanyUsersExample[0], // Alice
    allCompanyUsersExample[2], // Carol
  ]);

  const handleAddToVault = (vaultId: string, user: VaultUser) => {
    console.log(`Adding user ${user.name} to vault ${vaultId}`);
    // In a real app, you'd make an API call here
    // Then update state if necessary, though the component handles its internal state for UI
    // setInitialVaultUsersExample(prev => [...prev, user]); // This would be redundant if component manages its own list fully
  };

  const handleRemoveFromVault = (vaultId: string, userId: string) => {
    console.log(`Removing user ID ${userId} from vault ${vaultId}`);
    // API call
    // setInitialVaultUsersExample(prev => prev.filter(u => u.id !== userId));
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

          {getCurrentScreen() === NavigationScreen.VAULTS && <VaultsListScreen />}

          {getCurrentScreen() === NavigationScreen.CREATE_VAULTS && <CreateVaultScreen />}

          {getCurrentScreen() === NavigationScreen.ENVIRONMENTS && <EnvironmentsScreen />}

          {getCurrentScreen() === NavigationScreen.CREATE_ENVIRONMENT && (<CreateEnvironmentScreen />)}

          {getCurrentScreen() === NavigationScreen.PASSWORDS && <PasswordsListScreen />}

          {getCurrentScreen() === NavigationScreen.MANAGE_VAULT_MEMBERS &&
            (
              <VaultUserListView
                vaultId="project-phoenix-001"
                allCompanyUsers={allCompanyUsersExample}
                initialVaultUsers={initialVaultUsersExample} // Pass current vault users
                onAddUserToVault={handleAddToVault}
                onRemoveUserFromVault={handleRemoveFromVault}
              />
            )}

          {getCurrentScreen() === NavigationScreen.CREATE_PASSWORDS && <AddPasswordScreen />}

          {getCurrentScreen() === NavigationScreen.SETTINGS && <SettingsScreen />}

          {getCurrentScreen() === NavigationScreen.ALL_USERS && <UserListView />}

          {getCurrentScreen() === NavigationScreen.ADD_USER && <InviteUserScreen />}
        </div>
      </div>
    </div>
  )
}