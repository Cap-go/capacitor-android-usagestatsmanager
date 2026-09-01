# @capgo/capacitor-android-usagestatsmanager
<a href="https://capgo.app/"><img src="https://capgo.app/readme-banner.svg?repo=Cap-go/capacitor-android-usagestatsmanager" alt="Capgo - Instant updates for Capacitor" /></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin_android_usagestatsmanager"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin_android_usagestatsmanager"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

## Description
Exposes the Android's UsageStatsManager SDK to Capacitor

## Why Android UsageStatsManager?

The only plugin exposing Android's **UsageStatsManager API** to Capacitor - this Android API was not supported by any plugin before:

- **App usage tracking** - Monitor which apps users open and for how long
- **Screen time analytics** - Build parental controls and digital wellbeing features
- **Exact-window events** - Query raw lifecycle events when you need foreground time clipped to a specific range
- **Package information** - Query all installed apps on the device
- **Time-based queries** - Get usage stats for any time range

Perfect for parental control apps, digital wellbeing tools, productivity trackers, and screen time managers.

## Usage

Requires the following permissions in your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"
    tools:ignore="QueryAllPackagesPermission" />
```



## Documentation

The most complete doc is available here: https://capgo.app/docs/plugins/android-usagestatsmanager/

## Compatibility

| Plugin version | Capacitor compatibility | Maintained |
| -------------- | ----------------------- | ---------- |
| v8.\*.\*       | v8.\*.\*                | ✅          |
| v7.\*.\*       | v7.\*.\*                | On demand   |
| v6.\*.\*       | v6.\*.\*                | ❌          |
| v5.\*.\*       | v5.\*.\*                | ❌          |

> **Note:** The major version of this plugin follows the major version of Capacitor. Use the version that matches your Capacitor installation (e.g., plugin v8 for Capacitor 8). Only the latest major version is actively maintained.

## Install

You can use our AI-Assisted Setup to install the plugin. Add the Capgo skills to your AI tool using the following command:

```bash
npx skills add https://github.com/cap-go/capacitor-skills --skill capacitor-plugins
```

Then use the following prompt:

```text
Use the `capacitor-plugins` skill from `cap-go/capacitor-skills` to install the `@capgo/capacitor-android-usagestatsmanager` plugin in my project.
```

If you prefer Manual Setup, install the plugin by running the following commands and follow the platform-specific instructions below:

```bash
npm install @capgo/capacitor-android-usagestatsmanager
npx cap sync
```

## API

<docgen-index>

* [`queryAndAggregateUsageStats(...)`](#queryandaggregateusagestats)
* [`queryUsageStats(...)`](#queryusagestats)
* [`queryEvents(...)`](#queryevents)
* [`isUsageStatsPermissionGranted()`](#isusagestatspermissiongranted)
* [`openUsageStatsSettings()`](#openusagestatssettings)
* [`queryAllPackages(...)`](#queryallpackages)
* [`getPluginVersion()`](#getpluginversion)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

Capacitor plugin for accessing Android UsageStatsManager API.

### queryAndAggregateUsageStats(...)

```typescript
queryAndAggregateUsageStats(options: UsageStatsOptions) => Promise<Record<string, UsageStats>>
```

Queries and aggregates usage stats for the given time range.

Android reads pre-aggregated daily/weekly/monthly/yearly buckets and sums
every bucket that intersects `[beginTime, endTime)`, without clipping to it.
`totalTimeInForeground` can therefore include usage from outside the window.
Use `queryUsageStats` for the unmerged per-interval buckets, or `queryEvents`
for timestamped lifecycle events in the requested range.

| Param         | Type                                                            | Description                            |
| ------------- | --------------------------------------------------------------- | -------------------------------------- |
| **`options`** | <code><a href="#usagestatsoptions">UsageStatsOptions</a></code> | - The time range options for the query |

**Returns:** <code>Promise&lt;<a href="#record">Record</a>&lt;string, <a href="#usagestats">UsageStats</a>&gt;&gt;</code>

**Since:** 1.0.0

--------------------


### queryUsageStats(...)

```typescript
queryUsageStats(options: QueryUsageStatsOptions) => Promise<QueryUsageStatsResult>
```

Queries usage stats for the given interval type and time range.

Wraps Android `UsageStatsManager.queryUsageStats`. Unlike
`queryAndAggregateUsageStats`, this does not merge buckets: the result is
one <a href="#usagestats">`UsageStats`</a> object per package per overlapping interval. Android may
expand `[beginTime, endTime)` to the nearest whole interval period, so
`totalTimeInForeground` can include usage from outside the window.

On Android R (API 30) and above, the OS returns no data while the user is
locked; this plugin then resolves `{ stats: [] }`, which must not be treated
as zero foreground usage.

This uses the same `PACKAGE_USAGE_STATS` permission as
`queryAndAggregateUsageStats`.

| Param         | Type                                                                      | Description                                                  |
| ------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **`options`** | <code><a href="#queryusagestatsoptions">QueryUsageStatsOptions</a></code> | - The interval type, time range, and optional package filter |

**Returns:** <code>Promise&lt;<a href="#queryusagestatsresult">QueryUsageStatsResult</a>&gt;</code>

**Since:** 8.1.3

--------------------


### queryEvents(...)

```typescript
queryEvents(options: QueryEventsOptions) => Promise<QueryEventsResult>
```

Queries the raw usage event log for the given time range.

Returns lifecycle events whose timestamps fall in `[beginTime, endTime)`.
Android does not emit a synthetic event for "already in foreground at
beginTime" or "still in foreground at endTime". To measure duration across
those boundaries, pass an earlier `beginTime` as lookback and clip locally:
treat an unmatched pause as starting at the window start, and an unmatched
resume as ending at the window end.

Android retains events for only a few days. Older ranges may return an
incomplete or empty list; that is not the same as zero foreground usage.
On Android R (API 30) and above, the OS also returns no events while the
user is locked; this plugin then resolves `{ events: [] }`, which likewise
must not be treated as zero foreground usage.

Callers can sum resumed-to-paused intervals from the returned events.
This uses the same `PACKAGE_USAGE_STATS` permission as
`queryAndAggregateUsageStats`.

Only lifecycle events are returned, to keep the bridge payload small:
- `1` — ACTIVITY_RESUMED / MOVE_TO_FOREGROUND
- `2` — ACTIVITY_PAUSED / MOVE_TO_BACKGROUND
- `23` — ACTIVITY_STOPPED
- `26` — DEVICE_SHUTDOWN (device-wide closer; still returned when
  `packageName` is set. Android typically reports package `"android"`.
  `packageName` is omitted if the OS does not attach one.)

| Param         | Type                                                              | Description                                  |
| ------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **`options`** | <code><a href="#queryeventsoptions">QueryEventsOptions</a></code> | - The time range and optional package filter |

**Returns:** <code>Promise&lt;<a href="#queryeventsresult">QueryEventsResult</a>&gt;</code>

**Since:** 8.1.3

--------------------


### isUsageStatsPermissionGranted()

```typescript
isUsageStatsPermissionGranted() => Promise<UsageStatsPermissionResult>
```

Checks if the usage stats permission is granted.

**Returns:** <code>Promise&lt;<a href="#usagestatspermissionresult">UsageStatsPermissionResult</a>&gt;</code>

**Since:** 1.0.0

--------------------


### openUsageStatsSettings()

```typescript
openUsageStatsSettings() => Promise<void>
```

Open the usage stats settings screen.
This will open the usage stats settings screen, which allows the user to grant the usage stats permission.
This will always open the settings screen, even if the permission is already granted.

**Since:** 1.0.0

--------------------


### queryAllPackages(...)

```typescript
queryAllPackages(options?: QueryAllPackagesOptions | undefined) => Promise<{ packages: PackageInfo[]; }>
```

Queries all installed packages on the device.
Requires the QUERY_ALL_PACKAGES permission.

| Param         | Type                                                                        | Description               |
| ------------- | --------------------------------------------------------------------------- | ------------------------- |
| **`options`** | <code><a href="#queryallpackagesoptions">QueryAllPackagesOptions</a></code> | - Optional query settings |

**Returns:** <code>Promise&lt;{ packages: PackageInfo[]; }&gt;</code>

**Since:** 1.2.0

--------------------


### getPluginVersion()

```typescript
getPluginVersion() => Promise<{ version: string; }>
```

Get the native Capacitor plugin version.

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

**Since:** 1.0.0

--------------------


### Interfaces


#### UsageStats

Usage statistics for an Android app.

| Prop                                | Type                | Description                                                                                        |
| ----------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| **`firstTimeStamp`**                | <code>number</code> | The first timestamp of the usage stats.                                                            |
| **`lastTimeStamp`**                 | <code>number</code> | The last timestamp of the usage stats.                                                             |
| **`lastTimeForegroundServiceUsed`** | <code>number</code> | Only available on Android Q (API level 29) and above. Will be undefined on lower Android versions. |
| **`lastTimeUsed`**                  | <code>number</code> | The last time the app was used.                                                                    |
| **`lastTimeVisible`**               | <code>number</code> | Only available on Android Q (API level 29) and above. Will be undefined on lower Android versions. |
| **`packageName`**                   | <code>string</code> | The name of the package.                                                                           |
| **`totalForegroundServiceUsed`**    | <code>number</code> | Only available on Android Q (API level 29) and above. Will be undefined on lower Android versions. |
| **`totalTimeInForeground`**         | <code>number</code> | The total time the app was in the foreground.                                                      |
| **`totalTimeVisible`**              | <code>number</code> | Only available on Android Q (API level 29) and above. Will be undefined on lower Android versions. |


#### UsageStatsOptions

Options for querying usage statistics.

| Prop              | Type                | Description                                                                                                                                                         | Since |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **`beginTime`**   | <code>number</code> | The inclusive beginning of the range of stats to include in the results. Defined in terms of "Unix time"                                                            |       |
| **`endTime`**     | <code>number</code> | The exclusive end of the range of stats to include in the results. Defined in terms of "Unix time"                                                                  |       |
| **`packageName`** | <code>string</code> | Optional package name. When set, only stats for this package are returned. Omit to return stats for every package (previous behavior). An empty string is rejected. | 8.1.3 |


#### QueryUsageStatsResult

Result of a `queryUsageStats` call.

| Prop        | Type                      | Description                                                                                                                                            |
| ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`stats`** | <code>UsageStats[]</code> | Usage stats buckets in the requested range, ordered as returned by the OS. The same package can appear more than once when multiple intervals overlap. |


#### QueryUsageStatsOptions

Options for querying per-interval usage statistics.

| Prop               | Type                | Description                                                                                                                                                                     |
| ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`intervalType`** | <code>number</code> | Interval type from `android.app.usage.UsageStatsManager`: - `0` — INTERVAL_DAILY - `1` — INTERVAL_WEEKLY - `2` — INTERVAL_MONTHLY - `3` — INTERVAL_YEARLY - `4` — INTERVAL_BEST |
| **`beginTime`**    | <code>number</code> | The inclusive beginning of the range of stats to include in the results. Defined in terms of "Unix time"                                                                        |
| **`endTime`**      | <code>number</code> | The exclusive end of the range of stats to include in the results. Defined in terms of "Unix time"                                                                              |
| **`packageName`**  | <code>string</code> | Optional package name. When set, only stats for this package are returned. An empty string is rejected.                                                                         |


#### QueryEventsResult

Result of a `queryEvents` call.

| Prop         | Type                      | Description                                                                   |
| ------------ | ------------------------- | ----------------------------------------------------------------------------- |
| **`events`** | <code>UsageEvent[]</code> | Lifecycle usage events in the requested range, ordered as returned by the OS. |


#### UsageEvent

Represents a single usage event.

`queryEvents` currently populates `className`, `timeStamp`, and `eventType`.
`packageName` is set when Android attaches one (DEVICE_SHUTDOWN usually uses
`"android"`) and omitted otherwise. Other fields remain optional for
compatibility.

| Prop                        | Type                | Description                                                                                                                                                                                                                                               |
| --------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`packageName`**           | <code>string</code> | Package name of the app. Omitted when Android does not attach a package. DEVICE_SHUTDOWN typically uses `"android"`.                                                                                                                                      |
| **`className`**             | <code>string</code> | Class name (might be null)                                                                                                                                                                                                                                |
| **`timeStamp`**             | <code>number</code> | Timestamp in milliseconds since epoch                                                                                                                                                                                                                     |
| **`eventType`**             | <code>number</code> | Event type constant from `android.app.usage.UsageEvents.Event`. `queryEvents` returns lifecycle types only: - `1` — ACTIVITY_RESUMED / MOVE_TO_FOREGROUND - `2` — ACTIVITY_PAUSED / MOVE_TO_BACKGROUND - `23` — ACTIVITY_STOPPED - `26` — DEVICE_SHUTDOWN |
| **`configuration`**         | <code>any</code>    | Configuration object (requires API 28+)                                                                                                                                                                                                                   |
| **`shortcutId`**            | <code>string</code> | Shortcut ID (requires API 28+)                                                                                                                                                                                                                            |
| **`standbyBucket`**         | <code>number</code> | App standby bucket (requires API 28+)                                                                                                                                                                                                                     |
| **`notificationChannelId`** | <code>string</code> | Notification channel ID (requires API 29+)                                                                                                                                                                                                                |
| **`instanceId`**            | <code>number</code> | Instance ID (requires API 30+)                                                                                                                                                                                                                            |
| **`taskRootPackageName`**   | <code>string</code> | Task root package name (requires API 31+)                                                                                                                                                                                                                 |
| **`taskRootClassName`**     | <code>string</code> | Task root class name (requires API 31+)                                                                                                                                                                                                                   |


#### QueryEventsOptions

Options for querying the raw usage event log.

| Prop              | Type                | Description                                                                                                                                                                                                               |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`beginTime`**   | <code>number</code> | The inclusive beginning of the range of events to include in the results. Defined in terms of "Unix time"                                                                                                                 |
| **`endTime`**     | <code>number</code> | The exclusive end of the range of events to include in the results. Defined in terms of "Unix time"                                                                                                                       |
| **`packageName`** | <code>string</code> | Optional package name. When set, only events for this package are returned, plus device-wide `DEVICE_SHUTDOWN` events. An empty string is rejected. Keeps the Capacitor bridge payload small when you care about one app. |


#### UsageStatsPermissionResult

Result of a usage stats permission check.

| Prop          | Type                 | Description                                    |
| ------------- | -------------------- | ---------------------------------------------- |
| **`granted`** | <code>boolean</code> | Whether the usage stats permission is granted. |


#### PackageInfo

Represents basic information about an installed package.

| Prop                   | Type                | Description                                                                                                                                                                                                                                                         | Since  |
| ---------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **`packageName`**      | <code>string</code> | Package name                                                                                                                                                                                                                                                        |        |
| **`appName`**          | <code>string</code> | App display name                                                                                                                                                                                                                                                    |        |
| **`versionName`**      | <code>string</code> | Version name string                                                                                                                                                                                                                                                 |        |
| **`versionCode`**      | <code>number</code> | Version code number                                                                                                                                                                                                                                                 |        |
| **`firstInstallTime`** | <code>number</code> | First install time in milliseconds since epoch                                                                                                                                                                                                                      |        |
| **`lastUpdateTime`**   | <code>number</code> | Last update time in milliseconds since epoch                                                                                                                                                                                                                        |        |
| **`category`**         | <code>number</code> | Application category from `ApplicationInfo.category`. Only available on Android 8.0 (API level 26) and above. Common values: - `0` — undefined - `1` — game - `2` — audio - `3` — video - `4` — image - `5` — social - `6` — news - `7` — maps - `8` — productivity | 8.0.33 |
| **`icon`**             | <code>string</code> | App icon as a base64 data URL (`data:image/png;base64,...`). Only present when `queryAllPackages({ includeIcon: true })` is used.                                                                                                                                   | 8.0.33 |


#### QueryAllPackagesOptions

Options for querying installed packages.

| Prop              | Type                 | Description                                                                                                                                  | Default            |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **`includeIcon`** | <code>boolean</code> | When true, includes each app's launcher icon as a base64 data URL. Defaults to false because icons significantly increase the response size. | <code>false</code> |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>

</docgen-api>
