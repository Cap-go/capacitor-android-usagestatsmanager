import { CapacitorUsageStatsManager } from '@capgo/capacitor-android-usagestatsmanager';

document.addEventListener('DOMContentLoaded', () => {
    // Get references to our DOM elements
    const getStatsBtn = document.getElementById('getStatsBtn');
    const checkPermissionBtn = document.getElementById('checkPermissionBtn');
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const permissionStatus = document.getElementById('permission-status');
    const permissionStatusDisplay = document.getElementById('permission-status-display');
    const noResultsMessage = document.getElementById('no-results');
    const resultsList = document.getElementById('results-list');

    // Check permission status on page load
    checkPermission();

    // Add click event listener to the Check Permission button
    checkPermissionBtn.addEventListener('click', () => {
        checkPermission();
    });

    // Add click event listener to the Open Settings button
    openSettingsBtn.addEventListener('click', async () => {
        try {
            openSettingsBtn.disabled = true;
            openSettingsBtn.textContent = 'Opening Settings...';
            
            await CapacitorUsageStatsManager.openUsageStatsSettings();
            
            // Re-enable the button after a short delay
            setTimeout(() => {
                openSettingsBtn.disabled = false;
                openSettingsBtn.textContent = 'Open Settings';
                
                // Check permission status again after opening settings
                setTimeout(checkPermission, 1000);
            }, 1000);
        } catch (error) {
            openSettingsBtn.disabled = false;
            openSettingsBtn.textContent = 'Open Settings';
            permissionStatus.textContent = `Error: ${error.message || 'Failed to open settings'}`;
            console.error('Error opening usage stats settings:', error);
        }
    });

    // Function to check permission status
    async function checkPermission() {
        try {
            checkPermissionBtn.disabled = true;
            checkPermissionBtn.textContent = 'Checking...';
            permissionStatus.textContent = 'Checking permission status...';
            
            const result = await CapacitorUsageStatsManager.isUsageStatsPermissionGranted();
            
            checkPermissionBtn.disabled = false;
            checkPermissionBtn.textContent = 'Check Permission';
            
            const isGranted = result.granted;
            permissionStatus.textContent = `Permission status: ${isGranted ? 'Granted' : 'Denied'}`;
            
            // Update the permission status display
            permissionStatusDisplay.textContent = isGranted ? 'Granted' : 'Denied';
            permissionStatusDisplay.className = `permission-status ${isGranted ? 'status-granted' : 'status-denied'}`;
            
            // Enable or disable the Get Stats button based on permission
            getStatsBtn.disabled = !isGranted;
            if (!isGranted) {
                noResultsMessage.textContent = 'Permission denied. Please grant the permission to access usage statistics.';
            } else {
                noResultsMessage.textContent = 'Results will appear here after clicking the button.';
            }
            
            return isGranted;
        } catch (error) {
            checkPermissionBtn.disabled = false;
            checkPermissionBtn.textContent = 'Check Permission';
            permissionStatus.textContent = `Error: ${error.message || 'Failed to check permission'}`;
            console.error('Error checking usage stats permission:', error);
            return false;
        }
    }

    // Add click event listener to the Get Stats button
    getStatsBtn.addEventListener('click', async () => {
        try {
            // Check permission before proceeding
            const isPermissionGranted = await checkPermission();
            if (!isPermissionGranted) {
                return; // Don't proceed if permission is not granted
            }
            
            // Set the time range (last 24 hours)
            const endTime = Date.now();
            const beginTime = endTime - (24 * 60 * 60 * 1000); // 24 hours ago
            
            // Show loading state
            getStatsBtn.disabled = true;
            getStatsBtn.textContent = 'Loading...';
            noResultsMessage.textContent = 'Fetching usage statistics...';
            resultsList.innerHTML = '';
            
            // Call the plugin method
            const stats = await CapacitorUsageStatsManager.queryAndAggregateUsageStats({
                beginTime,
                endTime
            });
            
            // Clear loading state
            getStatsBtn.disabled = false;
            getStatsBtn.textContent = 'Get Stats';
            
            // Display the results
            if (Object.keys(stats).length === 0) {
                noResultsMessage.textContent = 'No usage statistics found for the selected time period.';
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
                
                // Populate the results list
                for (const [packageName, statsData] of Object.entries(stats)) {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    
                    // Display the package name as the key
                    const keyElement = document.createElement('div');
                    keyElement.className = 'key';
                    keyElement.textContent = `Package: ${packageName}`;
                    
                    // Format the stats data as JSON
                    const valueElement = document.createElement('div');
                    valueElement.className = 'value';
                    valueElement.textContent = JSON.stringify(statsData, null, 2);
                    
                    resultItem.appendChild(keyElement);
                    resultItem.appendChild(valueElement);
                    resultsList.appendChild(resultItem);
                }
            }
        } catch (error) {
            // Handle errors
            getStatsBtn.disabled = false;
            getStatsBtn.textContent = 'Get Stats';
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent = `Error: ${error.message || 'Failed to retrieve usage statistics'}`;
            console.error('Error retrieving usage statistics:', error);
        }
    });
});

// Keep the old functionality for reference, but don't expose it in the UI
window.testEcho = () => {
    const inputValue = "test";
    CapacitorUsageStatsManager.echo({ value: inputValue })
}
