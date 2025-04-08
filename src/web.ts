import { WebPlugin } from '@capacitor/core';

import type { CapacitorUsageStatsManagerPlugin } from './definitions';

export class CapacitorUsageStatsManagerWeb extends WebPlugin implements CapacitorUsageStatsManagerPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
