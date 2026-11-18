import { Component, type ReactNode } from 'react';

type Props = { name: string; children: ReactNode };

// Isola falhas de um remote: se ele cair, só aquele bloco mostra fallback, a página continua.
export class RemoteBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[remote:${this.props.name}]`, error);
  }

  render() {
    return this.state.failed ? <div role="alert">{this.props.name} indisponível no momento.</div> : this.props.children;
  }
}

