document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const scriptName = queryParams.get('script') || "main";  // Default to 'main'

    let scriptPath = `/src/cg/${scriptName}.ts`;  // Assuming a direct map, for simplicity

    console.log(`Loading script: ${scriptPath}`);
    loadScript(scriptPath);

    function loadScript(path: string) {
        const script = document.createElement('script');
        script.src = path;
        script.type = 'module';
        document.body.appendChild(script);
    }
});
