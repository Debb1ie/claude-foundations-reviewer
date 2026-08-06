'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Wires up light/dark mode for the whole app. Chakra v3's `_dark` style
 * props compile to a `.dark &` class selector (see
 * node_modules/@chakra-ui/react/dist/esm/preset-base.js), not a
 * `data-theme` attribute -- so this must set a `dark`/`light` class on
 * <html>, via a toggle (see Header) or the visitor's OS preference by
 * default. Without matching that exact selector, every `_dark` prop in
 * the app silently never activates.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
