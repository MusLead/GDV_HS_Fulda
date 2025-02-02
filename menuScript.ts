document.addEventListener('DOMContentLoaded', async () => {
    const header = document.querySelector('#header h3');
    const queryParams = new URLSearchParams(window.location.search);
    const scriptPath = queryParams.get('script') || "/src/cg/main";  // Default to 'main'

    const appId = "app"; // Assuming the app element has this ID

    updateHeader(scriptPath);
    try {
        await loadScript(scriptPath);
        await generateMenu();

        // Check if the loaded script is empty
        //FIXME: this is not working as expected. The coming soon screen is not displayed when the script is empty
        const loadedScript = document.querySelector(`script[src="${scriptPath}.ts"]`);
        if (loadedScript && loadedScript.textContent && loadedScript.textContent.trim() === "") {
            createComingSoonScreen(appId);
        }
    } catch (error) {
        console.error(error);
        createComingSoonScreen(appId);
    }

    // Function to format and update the header based on the script name
    function updateHeader(scriptName: string) {
        const parts = scriptName.split('/');
        const lastPart = parts[parts.length - 1];
        const displayName = lastPart.replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, l => l.toUpperCase());

        if (header) {
            header.textContent = displayName;
        }
    }

    async function loadScript(path: string) {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = path + '.ts';
            script.type = 'module';

            script.onload = () => resolve();
            script.onerror = () => {
                window.location.href = `/404.html?failedPath=${encodeURIComponent(path)}`;  // Pass the failed script path  Redirect to 404 page if script fails to load
                reject(new Error(`Failed to load script: ${path}`));
            };

            document.body.appendChild(script);
        });
    }

    async function generateMenu() {
        const response = await fetch('/api/menu');
        const menuData = await response.json();

        const menu = document.querySelector('.offcanvas-body ul');
        if (menu) {
            menu.innerHTML = '';  // Clear existing menu items
            renderMenuItems(menuData, menu);
        }
    }

    function renderMenuItems(items, parentElement) {
        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('nav-item');

            if (item.type === 'folder') {
                li.textContent = item.name;
                const ul = document.createElement('ul');
                ul.style.paddingLeft = '20px';  // Indent sub-menu
                li.appendChild(ul);
                renderMenuItems(item.children, ul);
            } else if (item.type === 'file') {
                const a = document.createElement('a');
                a.classList.add('nav-link');
                a.href = `?script=${item.path.replace('.ts', '')}`;
                a.textContent = item.name;
                li.appendChild(a);
            }

            parentElement.appendChild(li);
        });
    }
});

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
