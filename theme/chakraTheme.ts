import { createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        // Primary: Claude's actual brand orange (#CC785C, "book cloth" /
        // "clay" in Anthropic's own design language) -- anchors headings,
        // buttons, links, and borders throughout the app.
        brand: {
          50:  { value: '#FAEEE7' },
          100: { value: '#F1D8C7' },
          200: { value: '#E5BA9E' },
          300: { value: '#D99E77' },
          400: { value: '#D38A63' },
          500: { value: '#CC785C' },  // Claude orange -- core brand color
          600: { value: '#B6623F' },  // deep clay
          700: { value: '#8F4C31' },  // darkest terracotta (headings)
          800: { value: '#6B3A26' },
          900: { value: '#48271A' },
        },
        // Accent: warm sand/gold -- a softer companion tone for small
        // highlights (bullet dots, secondary badges) that stays in the
        // same warm family instead of clashing with the terracotta brand.
        accent: {
          50:  { value: '#FBF7EC' },
          100: { value: '#F3E7C7' },
          200: { value: '#E9D39C' },
          300: { value: '#DFBE72' },
          400: { value: '#D3AB55' },
          500: { value: '#C89A3F' },
          600: { value: '#A87D30' },
          700: { value: '#856224' },
          800: { value: '#61471A' },
          900: { value: '#3D2D10' },
        },
        // Success: warm-leaning green, kept legible against the cream/charcoal bg.
        success: {
          50:  { value: '#EDF5E9' },
          100: { value: '#D3E8C9' },
          200: { value: '#B3D7A1' },
          300: { value: '#93C679' },
          400: { value: '#79B85B' },
          500: { value: '#5FA33F' },
          600: { value: '#498032' },
          700: { value: '#376226' },
          800: { value: '#26451A' },
          900: { value: '#162A0F' },
        },
        // Error: warm coral-red, consistent with the terracotta family.
        error: {
          50:  { value: '#FBEAE6' },
          100: { value: '#F4C9BF' },
          200: { value: '#EBA394' },
          300: { value: '#E17C68' },
          400: { value: '#D85F46' },
          500: { value: '#C7452A' },
          600: { value: '#A23520' },
          700: { value: '#7E2818' },
          800: { value: '#5A1B10' },
          900: { value: '#380F08' },
        },
        // Domain colors (unrelated to brand identity -- kept vivid and
        // categorical so exam domains stay visually distinct).
        d1: { value: '#3949ab' },
        d2: { value: '#FF6D00' },
        d3: { value: '#00BCD4' },
        d4: { value: '#FFD600' },
        d5: { value: '#E91E8C' },
      },
      fonts: {
        // Editorial serif/sans split (per the CCAF Reference site design):
        // display serif for headings, clean sans for body/nav/UI text.
        heading: { value: '"Source Serif 4", Georgia, "Times New Roman", serif' },
        body:    { value: '"Outfit", "Inter", system-ui, sans-serif' },
        mono:    { value: '"JetBrains Mono", "Fira Code", "Roboto Mono", monospace' },
      },
    },
    semanticTokens: {
      colors: {
        // Light mode is Claude's warm cream ("Cloud"). Dark mode follows
        // the CCAF Reference site's deeper, editorial warm-black -- darker
        // and more muted than a plain charcoal -- flat, no pattern.
        bg: {
          DEFAULT: { value: { _light: '#F7F5EF', _dark: '#1A1817' } },
          panel:   { value: { _light: '#FFFFFF', _dark: '#232120' } },
          muted:   { value: { _light: '#EFEDE4', _dark: '#2B2926' } },
        },
        fg:     { value: { _light: '#211F1C', _dark: '#F2EFE9' } },
        border: { value: { _light: '#E6E2D6', _dark: '#3A3633' } },

        // brand.700 is used ~100 times app-wide as heading/body text color
        // (never as a background -- verified before adding this), so it's
        // safe to make it repaint lighter in dark mode. Without this, dark
        // terracotta heading text sits on a dark terracotta-tinted panel:
        // low contrast, hard to read ("brown text on brown background").
        brand: {
          700: { value: { _light: '{colors.brand.700}', _dark: '#E5BA9E' } },
        },

        // Chakra's raw gray.* swatches are static (not light/dark aware) by
        // default, but the app leans on them everywhere for secondary/body
        // text (`color="gray.500"` etc.) with no per-component _dark
        // override. Redeclaring the shades actually used as semantic
        // tokens makes them repaint automatically in dark mode instead of
        // staying a fixed medium-gray that's unreadable on a dark surface.
        gray: {
          300: { value: { _light: '{colors.gray.300}', _dark: '#7D7A74' } },
          400: { value: { _light: '{colors.gray.400}', _dark: '#98948C' } },
          500: { value: { _light: '{colors.gray.500}', _dark: '#AFABA1' } },
          600: { value: { _light: '{colors.gray.600}', _dark: '#C2BEB3' } },
          700: { value: { _light: '{colors.gray.700}', _dark: '#D6D2C6' } },
        },
      },
    },
  },
});

export default system;
