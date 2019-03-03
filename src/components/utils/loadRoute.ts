import * as fs from 'fs';
import { resolve, extname } from 'path';

export function loadRoute(router, path) {
    path = path;
    const dirs = fs.readdirSync(path);
    dirs.forEach(dir => {

        const subdir = resolve(path, dir);
        const stat = fs.lstatSync(subdir);
        if (stat.isDirectory()) {
            loadRoute(router, subdir);
        } else if (stat.isFile() && extname(dir) === '.js') {
            if (subdir.indexOf('Route.js') >= 0) {
                const routePath = subdir
                    .replace(path, '')
                    .slice(0, -8)
                    .replace(/\\/g, '/')
                    .replace(/\/index$/g, '');
                const route = require(subdir);
                router.use(routePath, route.default);
            }
        }
    });
}
