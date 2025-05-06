import { VaultUser } from "@/models/data/interfaces/VaultUser";

export interface VaultUserListViewProps {
    vaultId: string;
    initialVaultUsers?: VaultUser[];
    allCompanyUsers: VaultUser[]; // All users potentially available to be added
    onAddUserToVault: (vaultId: string, user: VaultUser) => Promise<void> | void;
    onRemoveUserFromVault: (vaultId: string, userId: string) => Promise<void> | void;
}