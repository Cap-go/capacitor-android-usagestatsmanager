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

  /**
   * Optional package name. When set, only stats for this package are returned.
   * Omit to return stats for every package (previous behavior).
   * An empty string is rejected.
   *
   * @since 8.1.3
   */
  packageName?: string;
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
   * Android reads pre-aggregated daily/weekly/monthly/yearly buckets and sums
   * every bucket that intersects `[beginTime, endTime)`, without clipping to it.
   * `totalTimeInForeground` can therefore include usage from outside the window.
   * Use `queryUsageStats` for the unmerged per-interval buckets, or `queryEvents`
   * for timestamped lifecycle events in the requested range.
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
   *   endTime: now,
   *   packageName: 'com.example.app',
   * });
   *
   * for (const [packageName, usageData] of Object.entries(stats)) {
   *   console.log(`${packageName}: ${usageData.totalTimeInForeground}ms`);
   * }
   * ```
   */
  queryAndAggregateUsageStats(options: UsageStatsOptions): Promise<Record<string, UsageStats>>;

  /**
   * Queries usage stats for the given interval type and time range.
   *
   * Wraps Android `UsageStatsManager.queryUsageStats`. Unlike
   * `queryAndAggregateUsageStats`, this does not merge buckets: the result is
   * one `UsageStats` object per package per overlapping interval. Android may
   * expand `[beginTime, endTime)` to the nearest whole interval period, so
   * `totalTimeInForeground` can include usage from outside the window.
   *
   * On Android R (API 30) and above, the OS returns no data while the user is
   * locked; this plugin then resolves `{ stats: [] }`, which must not be treated
   * as zero foreground usage.
   *
   * This uses the same `PACKAGE_USAGE_STATS` permission as
   * `queryAndAggregateUsageStats`.
   *
   * @param options - The interval type, time range, and optional package filter
   * @returns Promise that resolves to the matching usage stats buckets
   * @throws Error if the permission is not granted or query fails
   * @since 8.1.3
   * @example
   * ```typescript
   * const startOfDay = new Date().setHours(0, 0, 0, 0);
   * const { stats } = await UsageStatsManager.queryUsageStats({
   *   intervalType: 0, // INTERVAL_DAILY
   *   beginTime: startOfDay,
   *   endTime: Date.now(),
   *   packageName: 'com.example.app',
   * });
   * stats.forEach((bucket) => {
   *   console.log(`${bucket.packageName}: ${bucket.totalTimeInForeground}ms`);
   * });
   * ```
   */
  queryUsageStats(options: QueryUsageStatsOptions): Promise<QueryUsageStatsResult>;

  /**
   * Queries the raw usage event log for the given time range.
   *
   * Returns lifecycle events whose timestamps fall in `[beginTime, endTime)`.
   * Android does not emit a synthetic event for "already in foreground at
   * beginTime" or "still in foreground at endTime". To measure duration across
   * those boundaries, pass an earlier `beginTime` as lookback and clip locally:
   * treat an unmatched pause as starting at the window start, and an unmatched
   * resume as ending at the window end.
   *
   * Android retains events for only a few days. Older ranges may return an
   * incomplete or empty list; that is not the same as zero foreground usage.
   * On Android R (API 30) and above, the OS also returns no events while the
   * user is locked; this plugin then resolves `{ events: [] }`, which likewise
   * must not be treated as zero foreground usage.
   *
   * Callers can sum resumed-to-paused intervals from the returned events.
   * This uses the same `PACKAGE_USAGE_STATS` permission as
   * `queryAndAggregateUsageStats`.
   *
   * Only lifecycle events are returned, to keep the bridge payload small:
   * - `1` — ACTIVITY_RESUMED / MOVE_TO_FOREGROUND
   * - `2` — ACTIVITY_PAUSED / MOVE_TO_BACKGROUND
   * - `23` — ACTIVITY_STOPPED
   * - `26` — DEVICE_SHUTDOWN
   *
   * @param options - The time range and optional package filter
   * @returns Promise that resolves to the matching usage events
   * @throws Error if the permission is not granted or query fails
   * @since 8.1.3
   * @example
   * ```typescript
   * const startOfDay = new Date().setHours(0, 0, 0, 0);
   * const { events } = await UsageStatsManager.queryEvents({
   *   beginTime: startOfDay,
   *   endTime: Date.now(),
   *   packageName: 'com.example.app',
   * });
   * events.forEach((event) => {
   *   console.log(`${event.packageName} type=${event.eventType} at ${event.timeStamp}`);
   * });
   * ```
   */
  queryEvents(options: QueryEventsOptions): Promise<QueryEventsResult>;

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
   * @param options - Optional query settings
   * @returns Promise that resolves with an array of package information
   * @throws Error if the permission is not granted or query fails
   * @since 1.2.0
   * @example
   * ```typescript
   * const { packages } = await UsageStatsManager.queryAllPackages({ includeIcon: true });
   * packages.forEach(pkg => {
   *   console.log(`${pkg.appName} (${pkg.packageName}): category=${pkg.category}`);
   * });
   * ```
   */
  queryAllPackages(options?: QueryAllPackagesOptions): Promise<{ packages: PackageInfo[] }>;

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
 * Options for querying per-interval usage statistics.
 *
 * @since 8.1.3
 */
export interface QueryUsageStatsOptions {
  /**
   * Interval type from `android.app.usage.UsageStatsManager`:
   * - `0` — INTERVAL_DAILY
   * - `1` — INTERVAL_WEEKLY
   * - `2` — INTERVAL_MONTHLY
   * - `3` — INTERVAL_YEARLY
   * - `4` — INTERVAL_BEST
   */
  intervalType: number;

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

  /**
   * Optional package name. When set, only stats for this package are returned.
   * An empty string is rejected.
   */
  packageName?: string;
}

/**
 * Result of a `queryUsageStats` call.
 *
 * @since 8.1.3
 */
export interface QueryUsageStatsResult {
  /**
   * Usage stats buckets in the requested range, ordered as returned by the OS.
   * The same package can appear more than once when multiple intervals overlap.
   */
  stats: UsageStats[];
}

/**
 * Options for querying the raw usage event log.
 *
 * @since 8.1.3
 */
export interface QueryEventsOptions {
  /**
   * The inclusive beginning of the range of events to include in the results.
   * Defined in terms of "Unix time"
   */
  beginTime: number;

  /**
   * The exclusive end of the range of events to include in the results.
   * Defined in terms of "Unix time"
   */
  endTime: number;

  /**
   * Optional package name. When set, only events for this package are returned.
   * Keeps the Capacitor bridge payload small when you care about one app.
   * An empty string is rejected.
   */
  packageName?: string;
}

/**
 * Result of a `queryEvents` call.
 *
 * @since 8.1.3
 */
export interface QueryEventsResult {
  /**
   * Lifecycle usage events in the requested range, ordered as returned by the OS.
   */
  events: UsageEvent[];
}

/**
 * Represents a single usage event.
 *
 * `queryEvents` currently populates `packageName`, `className`, `timeStamp`,
 * and `eventType`. Other fields remain optional for compatibility.
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
  /**
   * Event type constant from `android.app.usage.UsageEvents.Event`.
   * `queryEvents` returns lifecycle types only:
   * - `1` — ACTIVITY_RESUMED / MOVE_TO_FOREGROUND
   * - `2` — ACTIVITY_PAUSED / MOVE_TO_BACKGROUND
   * - `23` — ACTIVITY_STOPPED
   * - `26` — DEVICE_SHUTDOWN
   */
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
 * Options for querying installed packages.
 *
 * @since 8.0.33
 */
export interface QueryAllPackagesOptions {
  /**
   * When true, includes each app's launcher icon as a base64 data URL.
   * Defaults to false because icons significantly increase the response size.
   *
   * @default false
   */
  includeIcon?: boolean;
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
  /**
   * Application category from `ApplicationInfo.category`.
   * Only available on Android 8.0 (API level 26) and above.
   *
   * Common values:
   * - `0` — undefined
   * - `1` — game
   * - `2` — audio
   * - `3` — video
   * - `4` — image
   * - `5` — social
   * - `6` — news
   * - `7` — maps
   * - `8` — productivity
   *
   * @since 8.0.33
   */
  category?: number;
  /**
   * App icon as a base64 data URL (`data:image/png;base64,...`).
   * Only present when `queryAllPackages({ includeIcon: true })` is used.
   *
   * @since 8.0.33
   */
  icon?: string;
}
