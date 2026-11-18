import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: [
        '**/components/CartWidget.tsx',
        '**/components/ProductList.tsx',
        '**/components/card.tsx',
        '**/lib/utils.ts',
      ],
      allowExternal: true,
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
});
