import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.cache/**',
      '**/.output/**',
      '**/Architecture/**',
    ],
    include: ['**/*.spec.ts', '**/*.test.ts'],
  },
});

