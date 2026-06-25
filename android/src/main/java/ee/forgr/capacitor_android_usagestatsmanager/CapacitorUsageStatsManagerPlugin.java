package ee.forgr.capacitor_android_usagestatsmanager;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import androidx.annotation.NonNull;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "CapacitorUsageStatsManager")
public class CapacitorUsageStatsManagerPlugin extends Plugin {

    private final String pluginVersion = "8.0.32";

    @PluginMethod
    public void queryAndAggregateUsageStats(final PluginCall call) {
        // I cannot use the primitive long here because it would create an NPE
        final Long beginTime = call.getLong("beginTime");
        if (beginTime == null) {
            call.reject("beginTime is null");
            return;
        }

        final Long endTime = call.getLong("endTime");
        if (endTime == null) {
            call.reject("endTime is null");
            return;
        }

        final boolean isAllowedToQueryUsageStats = this.checkUsageStatsPermission(this.getContext());
        if (!isAllowedToQueryUsageStats) {
            call.reject("Not allowed to query usage stats");
            return;
        }

        try {
            final UsageStatsManager usageStatsManager = (UsageStatsManager) this.getContext().getSystemService(Context.USAGE_STATS_SERVICE);
            final Map<String, UsageStats> response = usageStatsManager.queryAndAggregateUsageStats(beginTime, endTime);
            final JSObject finalResponse = new JSObject();
            for (final Map.Entry<String, UsageStats> stat : response.entrySet()) {
                final String key = stat.getKey();
                final JSObject encodedValue = getJsObject(stat);
                finalResponse.put(key, encodedValue);
            }
            call.resolve(finalResponse);
        } catch (Throwable t) {
            Log.e("CapacitorUsageStatsManager", "Error during fetching stats", t);
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            call.reject("Error during fetching stats: " + sw);
        }
    }

    @PluginMethod
    public void isUsageStatsPermissionGranted(final PluginCall call) {
        try {
            final boolean response = this.checkUsageStatsPermission(this.getContext());
            final JSObject jsResponse = new JSObject();
            jsResponse.put("granted", response);
            call.resolve(jsResponse);
        } catch (Throwable t) {
            Log.e("CapacitorUsageStatsManager", "Error during fetching stats", t);
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            call.reject("Error during isUsageStatsPermissionGranted: " + sw);
        }
    }

    @PluginMethod
    public void openUsageStatsSettings(final PluginCall call) {
        try {
            final Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            this.getContext().startActivity(intent);
            call.resolve();
        } catch (Throwable t) {
            Log.e("CapacitorUsageStatsManager", "Error during fetching stats", t);
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            call.reject("Error during openUsageStatsSettings: " + sw);
        }
    }
    @PluginMethod
    public void queryAllPackages(final PluginCall call) {
        final boolean includeIcon = Boolean.TRUE.equals(call.getBoolean("includeIcon", false));
        PackageManager pm = getContext().getPackageManager();
        List<PackageInfo> packages = pm.getInstalledPackages(0);
        JSObject result = new JSObject();
        com.getcapacitor.JSArray packagesJA = new com.getcapacitor.JSArray();

        for (PackageInfo packageInfo : packages) {
            JSObject packageJS = new JSObject();
            packageJS.put("packageName", packageInfo.packageName);
            ApplicationInfo appInfo = null;
            try {
                appInfo = pm.getApplicationInfo(packageInfo.packageName, 0);
                packageJS.put("appName", pm.getApplicationLabel(appInfo).toString());
            } catch (PackageManager.NameNotFoundException e) {
                packageJS.put("appName", packageInfo.packageName);
            }
            if (appInfo != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                packageJS.put("category", appInfo.category);
            }
            if (includeIcon && appInfo != null) {
                try {
                    Drawable icon = pm.getApplicationIcon(appInfo);
                    String iconDataUrl = drawableToBase64DataUrl(icon);
                    if (iconDataUrl != null) {
                        packageJS.put("icon", iconDataUrl);
                    }
                } catch (Exception e) {
                    Log.w("CapacitorUsageStatsManager", "Failed to load icon for " + packageInfo.packageName, e);
                }
            }
            packageJS.put("versionName", packageInfo.versionName);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                packageJS.put("versionCode", packageInfo.getLongVersionCode());
            } else {
                @SuppressWarnings("deprecation")
                long versionCode = packageInfo.versionCode;
                packageJS.put("versionCode", versionCode);
            }
            packageJS.put("firstInstallTime", packageInfo.firstInstallTime);
            packageJS.put("lastUpdateTime", packageInfo.lastUpdateTime);
            packagesJA.put(packageJS);
        }
        result.put("packages", packagesJA);
        call.resolve(result);
    }

    private static String drawableToBase64DataUrl(Drawable drawable) {
        if (drawable == null) {
            return null;
        }

        Bitmap bitmap;
        if (drawable instanceof BitmapDrawable) {
            bitmap = ((BitmapDrawable) drawable).getBitmap();
            if (bitmap == null) {
                return null;
            }
        } else {
            int width = drawable.getIntrinsicWidth() > 0 ? drawable.getIntrinsicWidth() : 1;
            int height = drawable.getIntrinsicHeight() > 0 ? drawable.getIntrinsicHeight() : 1;
            bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            drawable.draw(canvas);
        }

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        if (!bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)) {
            return null;
        }

        return "data:image/png;base64," + Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP);
    }

    @NonNull
    private static JSObject getJsObject(Map.Entry<String, UsageStats> stat) {
        final UsageStats value = stat.getValue();
        final JSObject encodedValue = new JSObject();

        encodedValue.put("firstTimeStamp", value.getFirstTimeStamp());
        encodedValue.put("lastTimeStamp", value.getLastTimeStamp());
        encodedValue.put("lastTimeUsed", value.getLastTimeUsed());
        encodedValue.put("packageName", value.getPackageName());
        encodedValue.put("totalTimeInForeground", value.getTotalTimeInForeground());

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            encodedValue.put("totalTimeVisible", value.getTotalTimeVisible());
            encodedValue.put("totalForegroundServiceUsed", value.getTotalTimeForegroundServiceUsed());
            encodedValue.put("lastTimeVisible", value.getLastTimeVisible());
            encodedValue.put("lastTimeForegroundServiceUsed", value.getLastTimeForegroundServiceUsed());
        }
        return encodedValue;
    }

    public boolean checkUsageStatsPermission(final Context context) {
        final AppOpsManager appOps = (AppOpsManager) context.getSystemService(Context.APP_OPS_SERVICE);
        int mode;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            mode = appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());
        } else {
            mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, android.os.Process.myUid(), context.getPackageName());
        }

        return mode == AppOpsManager.MODE_ALLOWED;
    }

    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.pluginVersion);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }
}
