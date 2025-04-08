import { CapacitorUsageStatsManager } from '@capgo/capacitor-android-usagestatsmanager';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    CapacitorUsageStatsManager.echo({ value: inputValue })
}
