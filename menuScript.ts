document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('#header h3');
    const queryParams = new URLSearchParams(window.location.search);
    const scriptName = queryParams.get('script') || "main";  // Default to 'main'

    let scriptPath = `/src/cg/${scriptName}`;  // Assuming a direct map, for simplicity

    console.log(`Loading script: ${scriptPath}`);
    updateHeader(scriptPath);
    loadScript(scriptPath);
    

    // Function to format and update the header based on the script name
    function updateHeader(scriptName: string) {
        // Extract the last part of the script path
        const parts = scriptName.split('/');
        const lastPart = parts[parts.length - 1];
        // Format the last part to replace underscores and camel case with spaces and proper capitalization
        const displayName = lastPart.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, l => l.toUpperCase());
        // Update header with the formatted display name
        if (header) {
            header.textContent = displayName;
        }
    }

    function loadScript(path: string) {
        const script = document.createElement('script');
        script.src = path + '.ts';
        script.type = 'module';
        document.body.appendChild(script);
    }
});