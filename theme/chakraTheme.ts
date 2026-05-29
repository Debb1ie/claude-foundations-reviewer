import { createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Primary: Deep navy/indigo — the dark blue from DevCon clouds & logo
        brand: {
          50:  { value: '#e8eaf6' },
          100: { value: '#c5cae9' },
          200: { value: '#9fa8da' },
          300: { value: '#7986cb' },
          400: { value: '#5c6bc0' },
          500: { value: '#3949ab' },  // core brand blue
          600: { value: '#283593' },  // deep indigo
          700: { value: '#1a237e' },  // darkest navy
          800: { value: '#131a60' },
          900: { value: '#0b1048' },
        },
        // Accent: Vivid cyan — background sky tone
        accent: {
          50:  { value: '#e0f8ff' },  // near-white sky
          100: { value: '#b3eeff' },
          200: { value: '#80e4ff' },
          300: { value: '#4dd9ff' },
          400: { value: '#26d0ff' },
          500: { value: '#00bcd4' },  // primary cyan accent
          600: { value: '#0097a7' },
          700: { value: '#00788a' },
          800: { value: '#005c6b' },
          900: { value: '#00404e' },
        },
        // Success: Vivid green (from DevCon icon blocks)
        success: {
          50:  { value: '#e8f5e9' },
          100: { value: '#c8e6c9' },
          200: { value: '#a5d6a7' },
          300: { value: '#81c784' },
          400: { value: '#66bb6a' },
          500: { value: '#4caf50' },
          600: { value: '#388e3c' },
          700: { value: '#2e7d32' },
          800: { value: '#1b5e20' },
          900: { value: '#104215' },
        },
        // Error: Warm red/coral
        error: {
          50:  { value: '#fbe9e7' },
          100: { value: '#ffccbc' },
          200: { value: '#ffab91' },
          300: { value: '#ff8a65' },
          400: { value: '#ff7043' },
          500: { value: '#f4511e' },
          600: { value: '#e64a19' },
          700: { value: '#d84315' },
          800: { value: '#bf360c' },
          900: { value: '#a23108' },
        },
        // Domain colors matching DevCon vivid palette
        d1: { value: '#3949ab' },  // deep indigo (brand)
        d2: { value: '#FF6D00' },  // vivid orange
        d3: { value: '#00BCD4' },  // cyan
        d4: { value: '#FFD600' },  // golden yellow
        d5: { value: '#E91E8C' },  // hot pink/magenta
      },
      fonts: {
        heading: { value: '"Outfit", "Inter", system-ui, sans-serif' },
        body:    { value: '"Outfit", "Inter", system-ui, sans-serif' },
        mono:    { value: '"JetBrains Mono", "Fira Code", "Roboto Mono", monospace' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: { _light: '#f8fafc', _dark: '#0f172a' } },   // slate-50 and slate-900
          panel:   { value: { _light: '#ffffff', _dark: '#1e293b' } },   // white and slate-800
          muted:   { value: { _light: '#f1f5f9', _dark: '#334155' } },   // slate-100 and slate-700
        },
        fg:     { value: { _light: '#0f172a', _dark: '#f8fafc' } },      // slate-900 and slate-50
        border: { value: { _light: '#e2e8f0', _dark: '#334155' } },      // slate-200 and slate-700
      },
    },
  },
});

export default system;
