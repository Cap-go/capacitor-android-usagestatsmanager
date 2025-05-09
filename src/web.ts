import { WebPlugin } from '@capacitor/core';

import type { CapacitorUsageStatsManagerPlugin, PackageInfo } from './definitions';

export class CapacitorUsageStatsManagerWeb extends WebPlugin implements CapacitorUsageStatsManagerPlugin {
  isUsageStatsPermissionGranted(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  openUsageStatsSettings(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  queryAndAggregateUsageStats(_options: any): Promise<Record<string, any>> {
    throw new Error('Method not implemented.');
  }
  queryAllPackages(): Promise<{ packages: PackageInfo[] }> {
    throw new Error('Method not implemented.');
  }
}
