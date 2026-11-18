import { lazy, Suspense } from 'react';
import { RemoteBoundary } from '../components/RemoteBoundary';

const ProductList = lazy(() => import('catalog/ProductList'));

export default () => (
  <RemoteBoundary name="Catálogo">
    <Suspense fallback={<p>Carregando produtos…</p>}>
      <ProductList />
    </Suspense>
  </RemoteBoundary>
);
