interface UsageStats {
  /**
   * The first timestamp of the usage stats.
   */
  firstTimeStamp: number;
  /**
   * The last timestamp of the usage stats.
   */
  lastTimeStamp: number;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  lastTimeForegroundServiceUsed?: number;
  /**
   * The last time the app was used.
   */
  lastTimeUsed: number;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  lastTimeVisible?: number;
  /**
   * The name of the package.
   */
  packageName: string;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  totalForegroundServiceUsed?: number;
  /**
   * The total time the app was in the foreground.
   */
  totalTimeInForeground: number;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  totalTimeVisible?: number;
}

interface UsageStatsOptions {
  /**
   * The inclusive beginning of the range of stats to include in the results.
   * Defined in terms of "Unix time"
   */
  beginTime: number;

  /**
   * The exclusive end of the range of stats to include in the results.
   * Defined in terms of "Unix time"
   */
  endTime: number;
}

interface UsageStatsPermissionResult {
  /**
   * Whether the usage stats permission is granted.
   */
  granted: boolean;
}

export interface CapacitorUsageStatsManagerPlugin {
  /**
   * Queries and aggregates usage stats for the given options.
   *
   * @param options - The options for the query.
   * @returns A promise that resolves to a record of package names and their corresponding usage stats.
   */
  queryAndAggregateUsageStats(options: UsageStatsOptions): Promise<Record<string, UsageStats>>;
  /**
   * Checks if the usage stats permission is granted.
   *
   * @returns A promise that resolves to a UsageStatsPermissionResult object.
   */
  isUsageStatsPermissionGranted(): Promise<UsageStatsPermissionResult>;
  /**
   * Open the usage stats settings screen.
   * This will open the usage stats settings screen, which allows the user to grant the usage stats permission.
   * This will always open the settings screen, even if the permission is already granted.
   */
  openUsageStatsSettings(): Promise<void>;
  /**
   * Queries all installed packages on the device.
   * Requires the QUERY_ALL_PACKAGES permission.
   *
   * @since 1.2.0
   */
  queryAllPackages(): Promise<{ packages: PackageInfo[] }>;
}

/**
 * Represents a single usage event.
 */
export interface UsageEvent {
  packageName: string;
  className?: string; // Might be null
  timeStamp: number; // Milliseconds since epoch
  eventType: number; // Event type constant (e.g., MOVE_TO_FOREGROUND, MOVE_TO_BACKGROUND)
  configuration?: any; // Configuration object (requires API 28+)
  shortcutId?: string; // Shortcut ID (requires API 28+)
  standbyBucket?: number; // App standby bucket (requires API 28+)
  notificationChannelId?: string; // Notification channel ID (requires API 29+)
  instanceId?: number; // Instance ID (requires API 30+)
  taskRootPackageName?: string; // Task root package name (requires API 31+)
  taskRootClassName?: string; // Task root class name (requires API 31+)
}

/**
 * Represents basic information about an installed package.
 */
export interface PackageInfo {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  firstInstallTime: number; // Milliseconds since epoch
  lastUpdateTime: number; // Milliseconds since epoch

  /**
   * Get the native Capacitor plugin version
   *
   * @returns {Promise<{ id: string }>} an Promise with version for this device
   * @throws An error if the something went wrong
   */
  getPluginVersion(): Promise<{ version: string }>;
}
