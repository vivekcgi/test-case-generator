import { ServerRoute } from '@hapi/hapi';
import * as fs from 'fs';
import * as path from 'path';

export class RouteLoader {
  static async load(routesPath: string) {
    const routes: ServerRoute[] = [];
    const files = await fs.promises.readdir(routesPath);
    for (const file of files) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const filePath = path.join(routesPath, file);
        const routeModule = await import(filePath);

        const discoveredRoutes: Array<ServerRoute> = Object.values(routeModule);
        routes.push(...discoveredRoutes);
      }
    }
    return routes;
  }
}
