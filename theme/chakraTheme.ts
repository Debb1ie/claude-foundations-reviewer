import { createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f8f9fa' },
          100: { value: '#f1f3f5' },
          200: { value: '#e9ecef' },
          300: { value: '#dee2e6' },
          400: { value: '#ced4da' },
          500: { value: '#495057' },
          600: { value: '#343a40' },
          700: { value: '#212529' },
          800: { value: '#1a1d21' },
          900: { value: '#0d0f14' },
        },
        accent: {
          50: { value: '#f0f0ff' },
          100: { value: '#e0e0ff' },
          200: { value: '#c4c4ff' },
          300: { value: '#a0a0ff' },
          400: { value: '#7c6efa' },
          500: { value: '#6c5ce7' },
          600: { value: '#5a4bd1' },
          700: { value: '#483db8' },
          800: { value: '#3a3099' },
          900: { value: '#2d257a' },
        },
        success: {
          50: { value: '#e6f9f1' },
          100: { value: '#b3f0d9' },
          200: { value: '#80e6c1' },
          300: { value: '#4ddca9' },
          400: { value: '#26d496' },
          500: { value: '#22c88a' },
          600: { value: '#1db37d' },
          700: { value: '#17996b' },
          800: { value: '#12805a' },
          900: { value: '#0d5c40' },
        },
        error: {
          50: { value: '#fde8e8' },
          100: { value: '#fbc4c4' },
          200: { value: '#f9a0a0' },
          300: { value: '#f77c7c' },
          400: { value: '#f46060' },
          500: { value: '#f05a5a' },
          600: { value: '#d94040' },
          700: { value: '#b82e2e' },
          800: { value: '#972222' },
          900: { value: '#7a1a1a' },
        },
        d1: { value: '#7C6EFA' },
        d2: { value: '#FA8C6E' },
        d3: { value: '#6ECFFA' },
        d4: { value: '#F0D06E' },
        d5: { value: '#A06EFA' },
      },
      fonts: {
        heading: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
        body: { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' },
        mono: { value: '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", monospace' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: '#ffffff', _dark: '#0d0f14' } },
          panel: { value: { _light: '#ffffff', _dark: '#0d0f14' } },
          muted: { value: { _light: '#f1f3f5', _dark: '#1c2030' } },
        },
        fg: { value: { _light: '#212529', _dark: '#e8eaf0' } },
        border: { value: { _light: '#e9ecef', _dark: '#252A3A' } },
      },
    },
  },
});

export default system;
