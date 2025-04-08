import { registerPlugin } from '@capacitor/core';

import type { CapacitorUsageStatsManagerPlugin } from './definitions';

const CapacitorUsageStatsManager = registerPlugin<CapacitorUsageStatsManagerPlugin>('CapacitorUsageStatsManager', {
  web: () => import('./web').then((m) => new m.CapacitorUsageStatsManagerWeb()),
});

export * from './definitions';
export { CapacitorUsageStatsManager };
