import type { ModuleFederationRuntimePlugin } from '@module-federation/modern-js/runtime';

// Remote fora do ar no SSR falha no runtime do MF (fetch do manifest), fora do React:
// sem isso, o servidor do shell cai. Aqui devolvemos uma factory de componente fallback no lugar do módulo.
// Não importe `react` aqui: runtime plugins rodam antes do shared scope existir e quebram o bundle SSR.
const fallbackPlugin = (): ModuleFederationRuntimePlugin => ({
  name: 'remote-fallback',
  errorLoadRemote({ id, lifecycle, error }) {
    if (lifecycle !== 'onLoad') return;
    console.error(`[remote:${id}] indisponível`, error);
    // shortcut: fallback só em texto (sem role="alert"); se precisar de markup, renderize-o no RemoteBoundary do shell.
    const Fallback = () => `${id} indisponível no momento.`;
    return () => ({ __esModule: true, default: Fallback });
  },
});

export default fallbackPlugin;
