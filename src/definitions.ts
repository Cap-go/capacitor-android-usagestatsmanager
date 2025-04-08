interface UsageStats {
  firstTimeStamp: number;
  lastTimeStamp: number;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  lastTimeForegroundServiceUsed?: number;
  lastTimeUsed: number;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  lastTimeVisible?: number;
  packageName: string;
  /**
   * Only available on Android Q (API level 29) and above.
   * Will be undefined on lower Android versions.
   */
  totalForegroundServiceUsed?: number;
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
  queryAndAggregateUsageStats(options: UsageStatsOptions): Promise<Record<string, UsageStats>>;
  isUsageStatsPermissionGranted(): Promise<UsageStatsPermissionResult>;
  /**
   * Open the usage stats settings screen.
   * This will open the usage stats settings screen, which allows the user to grant the usage stats permission.
   * This will always open the settings screen, even if the permission is already granted.
   */
  openUsageStatsSettings(): Promise<void>;
}
