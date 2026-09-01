import { WebPlugin } from '@capacitor/core';

import type {
  CapacitorUsageStatsManagerPlugin,
  PackageInfo,
  QueryEventsOptions,
  QueryEventsResult,
  QueryUsageStatsOptions,
  QueryUsageStatsResult,
} from './definitions';

export class CapacitorUsageStatsManagerWeb extends WebPlugin implements CapacitorUsageStatsManagerPlugin {
  isUsageStatsPermissionGranted(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  openUsageStatsSettings(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /**
   * Android-only. Web does not expose UsageStatsManager.
   *
   * @param _options Time range and optional package filter
   * @returns Never; web always throws
   */
  queryAndAggregateUsageStats(_options: any): Promise<Record<string, any>> {
    throw new Error('Method not implemented.');
  }
  /**
   * Android-only. Web does not expose UsageStatsManager.
   *
   * @param _options Interval type, time range, and optional package filter
   * @returns Never; web always throws
   */
  queryUsageStats(_options: QueryUsageStatsOptions): Promise<QueryUsageStatsResult> {
    throw new Error('Method not implemented.');
  }
  /**
   * Android-only. Web does not expose UsageStatsManager events.
   *
   * @param _options Time range and optional package filter
   * @returns Never; web always throws
   */
  queryEvents(_options: QueryEventsOptions): Promise<QueryEventsResult> {
    throw new Error('Method not implemented.');
  }
  queryAllPackages(_options?: { includeIcon?: boolean }): Promise<{ packages: PackageInfo[] }> {
    throw new Error('Method not implemented.');
  }

  async getPluginVersion(): Promise<{ version: string }> {
    return { version: 'web' };
  }
}
