// vite.config.ts
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const generateMenu = (dirPath: string, baseDir: string = '') => {
  let menu = [];
  const items = fs.readdirSync(dirPath);

  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(baseDir, fullPath);

    if (fs.lstatSync(fullPath).isDirectory()) {
      menu.push({
        name: item,
        type: 'folder',
        children: generateMenu(fullPath, baseDir),
      } as never);
    } else {
      if (item.endsWith('.ts')) {
        menu.push({
          name: item.replace('.ts', ''),
          type: 'file',
          path: relativePath.replace(/\\/g, '/'),
        } as never);
      }
    }
  });

  return menu;
};

const myPlugin = () => {
  return {
    name: 'vite-plugin-generate-menu',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/menu') {
          const menu = generateMenu(path.resolve(__dirname, 'src/cg'), path.resolve(__dirname));
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(menu));
        } else {
          next();
        }
      });
    },
  };
};

export default defineConfig({
  // base: '/GDV_1515659/',
  plugins: [myPlugin()],
});
