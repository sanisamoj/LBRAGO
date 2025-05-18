import semver from "semver"

export enum VersionCheckResult {
    INCOMPATIBLE = "incompatible",
    FEATURE_UPDATE = "feature-update",
    PATCH_UPDATE = "patch-update",
    UP_TO_DATE = "up-to-date"
}

export function checkVersion(current: string, server: string): VersionCheckResult {
  if (!semver.valid(current) || !semver.valid(server)) {
    throw new Error("Versão inválida")
  }

  if (semver.gt(current, server)) {
    return VersionCheckResult.UP_TO_DATE
  }

  if (semver.major(current) !== semver.major(server)) {
    return VersionCheckResult.INCOMPATIBLE
  }

  if (semver.minor(current) !== semver.minor(server)) {
    return VersionCheckResult.FEATURE_UPDATE
  }

  if (semver.patch(current) !== semver.patch(server)) {
    return VersionCheckResult.PATCH_UPDATE
  }

  return VersionCheckResult.UP_TO_DATE
}