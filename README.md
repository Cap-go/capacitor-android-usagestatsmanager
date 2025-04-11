# @capgo/capacitor-android-usagestatsmanager
 <a href="https://capgo.app/"><img src='https://raw.githubusercontent.com/Cap-go/capgo/main/assets/capgo_banner.png' alt='Capgo - Instant updates for capacitor'/></a>

<div align="center">
  <h2><a href="https://capgo.app/?ref=plugin"> ➡️ Get Instant updates for your App with Capgo 🚀</a></h2>
  <h2><a href="https://capgo.app/consulting/?ref=plugin"> Fix your annoying bug now, Hire a Capacitor expert 💪</a></h2>
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
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### queryAndAggregateUsageStats(...)

```typescript
queryAndAggregateUsageStats(options: UsageStatsOptions) => Promise<Record<string, UsageStats>>
```

Queries and aggregates usage stats for the given options.

| Param         | Type                                                            | Description                  |
| ------------- | --------------------------------------------------------------- | ---------------------------- |
| **`options`** | <code><a href="#usagestatsoptions">UsageStatsOptions</a></code> | - The options for the query. |

**Returns:** <code>Promise&lt;<a href="#record">Record</a>&lt;string, <a href="#usagestats">UsageStats</a>&gt;&gt;</code>

--------------------


### isUsageStatsPermissionGranted()

```typescript
isUsageStatsPermissionGranted() => Promise<UsageStatsPermissionResult>
```

Checks if the usage stats permission is granted.

**Returns:** <code>Promise&lt;<a href="#usagestatspermissionresult">UsageStatsPermissionResult</a>&gt;</code>

--------------------


### openUsageStatsSettings()

```typescript
openUsageStatsSettings() => Promise<void>
```

Open the usage stats settings screen.
This will open the usage stats settings screen, which allows the user to grant the usage stats permission.
This will always open the settings screen, even if the permission is already granted.

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


### Interfaces


#### UsageStats

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

| Prop            | Type                | Description                                                                                              |
| --------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| **`beginTime`** | <code>number</code> | The inclusive beginning of the range of stats to include in the results. Defined in terms of "Unix time" |
| **`endTime`**   | <code>number</code> | The exclusive end of the range of stats to include in the results. Defined in terms of "Unix time"       |


#### UsageStatsPermissionResult

| Prop          | Type                 | Description                                    |
| ------------- | -------------------- | ---------------------------------------------- |
| **`granted`** | <code>boolean</code> | Whether the usage stats permission is granted. |


#### PackageInfo

Represents basic information about an installed package.

| Prop                   | Type                |
| ---------------------- | ------------------- |
| **`packageName`**      | <code>string</code> |
| **`appName`**          | <code>string</code> |
| **`versionName`**      | <code>string</code> |
| **`versionCode`**      | <code>number</code> |
| **`firstInstallTime`** | <code>number</code> |
| **`lastUpdateTime`**   | <code>number</code> |


### Type Aliases


#### Record

Construct a type with a set of properties K of type T

<code>{
 [P in K]: T;
 }</code>

</docgen-api>
