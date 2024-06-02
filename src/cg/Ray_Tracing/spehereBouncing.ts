/**
 * Project explanation: Vorlesung GDV 07.05.2024
 * Project task: Ray tracing 2
 */

/**
 * Creates a "coming soon" screen.
 * @param appId The document id of the app.
 */
function createComingSoonScreen(appId: string): void {
    const appElement = document.getElementById(appId);
    if (appElement) {
        appElement.innerHTML = "Coming Soon";
        appElement.style.display = "flex";
        appElement.style.justifyContent = "center";
        appElement.style.alignItems = "center";
        appElement.style.fontFamily = "Arial, sans-serif";
        appElement.style.fontSize = "24px";
        appElement.style.marginTop = "25%"; // Set margin-top to 50%
    }
}

// Usage example
createComingSoonScreen("app");