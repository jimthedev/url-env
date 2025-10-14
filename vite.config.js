/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true
    })
  ],
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/index.ts'),
      // Name of the library (used for UMD build)
      name: 'urlEnv',
      // File name for output files
      fileName: (format) => `url-env.${format}.js`,
      // Output formats
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [],
      output: {
        // Global variables for UMD build
        globals: {}
      }
    },
    // Generate sourcemaps
    sourcemap: true,
    // Clean output directory before build
    emptyOutDir: true
  },
  test: {
    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,
    // Test environment (jsdom for browser-like environment)
    environment: 'jsdom',
    // Include test files
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Coverage configuration
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/vite.config.{js,ts}'
      ]
    }
  }
});