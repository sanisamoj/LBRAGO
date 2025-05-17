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

  const currentSemver = semver.parse(current)!
  const serverSemver = semver.parse(server)!

  if (currentSemver.major !== serverSemver.major) {
    return VersionCheckResult.INCOMPATIBLE
  }

  if (currentSemver.minor !== serverSemver.minor) {
    return VersionCheckResult.FEATURE_UPDATE
  }

  if (currentSemver.patch !== serverSemver.patch) {
    return VersionCheckResult.PATCH_UPDATE
  }

  return VersionCheckResult.UP_TO_DATE
}