import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorUsageStatsManagerPlugin)
public class CapacitorUsageStatsManagerPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CapacitorUsageStatsManagerPlugin"
    public let jsName = "CapacitorUsageStatsManager"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "queryAndAggregateUsageStats", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isUsageStatsPermissionGranted", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openUsageStatsSettings", returnType: CAPPluginReturnPromise)
    ]

    @objc func queryAndAggregateUsageStats(_ call: CAPPluginCall) {
        call.reject("Usage statistics are not available on iOS. This functionality is only supported on Android.")
    }

    @objc func isUsageStatsPermissionGranted(_ call: CAPPluginCall) {
        call.reject("Usage statistics are not available on iOS. This functionality is only supported on Android.")
    }

    @objc func openUsageStatsSettings(_ call: CAPPluginCall) {
        call.reject("Usage statistics are not available on iOS. This functionality is only supported on Android.")
    }
}
