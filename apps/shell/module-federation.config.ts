import { createModuleFederationConfig } from '@module-federation/modern-js';

export default createModuleFederationConfig({
  name: 'shell',
  remotes: {
    catalog: 'catalog@http://localhost:3001/mf-manifest.json',
    cart: 'cart@http://localhost:3002/mf-manifest.json',
  },
  runtimePlugins: [require.resolve('./src/mf-fallback-plugin.ts')],
  // Tipos dos remotes declarados à mão (shell/src/remotes.d.ts); o plugin DTS derruba o dev quando um remote está fora.
  dts: false,
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.1' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
  },
});
