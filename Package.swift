// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorAndroidUsagestatsmanager",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapgoCapacitorAndroidUsagestatsmanager",
            targets: ["CapacitorUsageStatsManagerPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "CapacitorUsageStatsManagerPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapacitorUsageStatsManagerPlugin"),
        .testTarget(
            name: "CapacitorUsageStatsManagerPluginTests",
            dependencies: ["CapacitorUsageStatsManagerPlugin"],
            path: "ios/Tests/CapacitorUsageStatsManagerPluginTests")
    ]
)
