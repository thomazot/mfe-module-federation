import { createModuleFederationConfig } from '@module-federation/modern-js';

export default createModuleFederationConfig({
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: { './ProductList': './src/components/ProductList.tsx' },
  // Tipos dos remotes declarados à mão (shell/src/remotes.d.ts); o plugin DTS derruba o dev quando um remote está fora.
  dts: false,
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.1' },
    'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
  },
});
