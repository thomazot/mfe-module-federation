import { appTools, defineConfig } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/modern-js';

export default defineConfig({
  dev: { port: 3001 },
  server: { ssr: { mode: 'stream' } },
  plugins: [appTools({ bundler: 'rspack' }), moduleFederationPlugin()],
});
