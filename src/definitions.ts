/**
 * Usage statistics for an Android app.
 *
 * @since 1.0.0
 */
export interface UsageStats {
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

/**
 * Options for querying usage statistics.
 *
 * @since 1.0.0
 */
export interface UsageStatsOptions {
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

/**
 * Result of a usage stats permission check.
 *
 * @since 1.0.0
 */
export interface UsageStatsPermissionResult {
  /**
   * Whether the usage stats permission is granted.
   */
  granted: boolean;
}

/**
 * Capacitor plugin for accessing Android UsageStatsManager API.
 *
 * @since 1.0.0
 */
export interface CapacitorUsageStatsManagerPlugin {
  /**
   * Queries and aggregates usage stats for the given time range.
   *
   * @param options - The time range options for the query
   * @returns Promise that resolves to a record of package names and their corresponding usage stats
   * @throws Error if the permission is not granted or query fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
   * const now = Date.now();
   * const stats = await UsageStatsManager.queryAndAggregateUsageStats({
   *   beginTime: oneDayAgo,
   *   endTime: now
   * });
   *
   * for (const [packageName, usageData] of Object.entries(stats)) {
   *   console.log(`${packageName}: ${usageData.totalTimeInForeground}ms`);
   * }
   * ```
   */
  queryAndAggregateUsageStats(options: UsageStatsOptions): Promise<Record<string, UsageStats>>;

  /**
   * Checks if the usage stats permission is granted.
   *
   * @returns Promise that resolves to a permission result object
   * @throws Error if checking permission fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { granted } = await UsageStatsManager.isUsageStatsPermissionGranted();
   * if (!granted) {
   *   await UsageStatsManager.openUsageStatsSettings();
   * }
   * ```
   */
  isUsageStatsPermissionGranted(): Promise<UsageStatsPermissionResult>;

  /**
   * Open the usage stats settings screen.
   * This will open the usage stats settings screen, which allows the user to grant the usage stats permission.
   * This will always open the settings screen, even if the permission is already granted.
   *
   * @returns Promise that resolves when the settings screen is opened
   * @throws Error if opening settings fails
   * @since 1.0.0
   * @example
   * ```typescript
   * await UsageStatsManager.openUsageStatsSettings();
   * ```
   */
  openUsageStatsSettings(): Promise<void>;

  /**
   * Queries all installed packages on the device.
   * Requires the QUERY_ALL_PACKAGES permission.
   *
   * @returns Promise that resolves with an array of package information
   * @throws Error if the permission is not granted or query fails
   * @since 1.2.0
   * @example
   * ```typescript
   * const { packages } = await UsageStatsManager.queryAllPackages();
   * packages.forEach(pkg => {
   *   console.log(`${pkg.appName} (${pkg.packageName}): v${pkg.versionName}`);
   * });
   * ```
   */
  queryAllPackages(): Promise<{ packages: PackageInfo[] }>;

  /**
   * Get the native Capacitor plugin version.
   *
   * @returns Promise that resolves with the plugin version
   * @throws Error if getting the version fails
   * @since 1.0.0
   * @example
   * ```typescript
   * const { version } = await UsageStatsManager.getPluginVersion();
   * console.log('Plugin version:', version);
   * ```
   */
  getPluginVersion(): Promise<{ version: string }>;
}

/**
 * Represents a single usage event.
 *
 * @since 1.0.0
 */
export interface UsageEvent {
  /** Package name of the app */
  packageName: string;
  /** Class name (might be null) */
  className?: string;
  /** Timestamp in milliseconds since epoch */
  timeStamp: number;
  /** Event type constant (e.g., MOVE_TO_FOREGROUND, MOVE_TO_BACKGROUND) */
  eventType: number;
  /** Configuration object (requires API 28+) */
  configuration?: any;
  /** Shortcut ID (requires API 28+) */
  shortcutId?: string;
  /** App standby bucket (requires API 28+) */
  standbyBucket?: number;
  /** Notification channel ID (requires API 29+) */
  notificationChannelId?: string;
  /** Instance ID (requires API 30+) */
  instanceId?: number;
  /** Task root package name (requires API 31+) */
  taskRootPackageName?: string;
  /** Task root class name (requires API 31+) */
  taskRootClassName?: string;
}

/**
 * Represents basic information about an installed package.
 *
 * @since 1.0.0
 */
export interface PackageInfo {
  /** Package name */
  packageName: string;
  /** App display name */
  appName: string;
  /** Version name string */
  versionName: string;
  /** Version code number */
  versionCode: number;
  /** First install time in milliseconds since epoch */
  firstInstallTime: number;
  /** Last update time in milliseconds since epoch */
  lastUpdateTime: number;
}
