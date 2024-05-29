// menuScript.ts
document.addEventListener('DOMContentLoaded', async () => {
    const header = document.querySelector('#header h3');
    const queryParams = new URLSearchParams(window.location.search);
    const scriptName = queryParams.get('script') || "/src/cg/main";  // Default to 'main'

    let scriptPath = scriptName;  // Assuming a direct map, for simplicity

    // console.log(`Loading script: ${scriptPath}`);
    updateHeader(scriptPath);
    loadScript(scriptPath);
    await generateMenu();

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
