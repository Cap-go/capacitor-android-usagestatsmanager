# @capgo/capacitor-android-usagestatsmanager
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Missing a feature? We’ll build the plugin for you 💪</a></h2>
</div>

## Description
Exposes the Android's UsageStatsManager SDK to Capacitor

## Usage

Requires the following permissions in your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES"
    tools:ignore="QueryAllPackagesPermission" />
```



## Install

```bash
npm install @capgo/capacitor-android-usagestatsmanager
npx cap sync
```

## API

<docgen-index>

* [`queryAndAggregateUsageStats(...)`](#queryandaggregateusagestats)
* [`isUsageStatsPermissionGranted()`](#isusagestatspermissiongranted)
* [`openUsageStatsSettings()`](#openusagestatssettings)
* [`queryAllPackages()`](#queryallpackages)
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

| Param         | Type                                                            | Description                            |
| ------------- | --------------------------------------------------------------- | -------------------------------------- |
| **`options`** | <code><a href="#usagestatsoptions">UsageStatsOptions</a></code> | - The time range options for the query |

**Returns:** <code>Promise&lt;<a href="#record">Record</a>&lt;string, <a href="#usagestats">UsageStats</a>&gt;&gt;</code>

**Since:** 1.0.0

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


### queryAllPackages()

```typescript
queryAllPackages() => Promise<{ packages: PackageInfo[]; }>
```

Queries all installed packages on the device.
Requires the QUERY_ALL_PACKAGES permission.

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

| Prop            | Type                | Description                                                                                              |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| **`beginTime`** | <code>number</code> | The inclusive beginning of the range of stats to include in the results. Defined in terms of "Unix time" |
| **`endTime`**   | <code>number</code> | The exclusive end of the range of stats to include in the results. Defined in terms of "Unix time"       |


#### UsageStatsPermissionResult

Result of a usage stats permission check.

| Prop          | Type                 | Description                                    |
| ------------- | -------------------- | ---------------------------------------------- |
| **`granted`** | <code>boolean</code> | Whether the usage stats permission is granted. |


#### PackageInfo

Represents basic information about an installed package.

| Prop                   | Type                | Description                                    |
| ---------------------- | ------------------- | ---------------------------------------------- |
| **`packageName`**      | <code>string</code> | Package name                                   |
| **`appName`**          | <code>string</code> | App display name                               |
| **`versionName`**      | <code>string</code> | Version name string                            |
| **`versionCode`**      | <code>number</code> | Version code number                            |
| **`firstInstallTime`** | <code>number</code> | First install time in milliseconds since epoch |
| **`lastUpdateTime`**   | <code>number</code> | Last update time in milliseconds since epoch   |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{ [P in K]: T; }</code>

</docgen-api>
