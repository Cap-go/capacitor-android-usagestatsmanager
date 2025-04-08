export interface CapacitorUsageStatsManagerPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
