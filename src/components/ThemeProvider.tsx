import React, { useState, useEffect, createContext, useContext } from 'react';

export interface ThemeIcon {
  name: string;
  icon: React.ReactNode;
}

interface ThemeContextObject {
  theme: string;
  setTheme(theme: string): void;
  themes: ThemeIcon[];
}

export interface ThemeProviderProps {
  theme?: string; // Overrides with this initial theme
  children?: React.ReactNode;
  additionalThemes?: ThemeIcon[]; //Themes that are merged with defaultThemes
  replaceThemes?: ThemeIcon[]; //Themes that replace default themes (replaceThemes takes precedence if both replaceThemes and additionalThemes are specified)
}

export interface LocalThemeProps {
  theme: string;
  children?: React.ReactNode;
  otherProps?: any[];
  as?: any;
}

const ThemeContext = createContext<ThemeContextObject>(null!);

const IS_SERVER: boolean = typeof window === 'undefined';

let storedTheme: string | null = IS_SERVER
  ? 'light'
  : localStorage.getItem('theme');

let defaultThemes: ThemeIcon[] = [
  { name: 'Light', icon: '☀️' },
  { name: 'Dark', icon: '🌙' },
  { name: 'Auto', icon: '⚙️' },
];

function modifyDOM(theme: string) {
  if (
    theme === 'auto' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}

export function ThemeProvider({
  theme, // Overrides with this initial theme
  children,
  additionalThemes, //Themes that are merged with defaultThemes
  replaceThemes, //Themes that replace default themes (replaceThemes takes precedence if both replaceThemes and additionalThemes are specified)
}: ThemeProviderProps): React.ReactElement {
  const [mode, setMode] = useState(getPreferredTheme());
  let themes = defaultThemes;
  if (additionalThemes) {
    themes = [...defaultThemes, ...additionalThemes];
  }
  if (replaceThemes) {
    themes = replaceThemes;
  }

  useEffect(() => {
    if (IS_SERVER) return;
    modifyDOM(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getPreferredTheme(): string {
    if (theme) return theme;

    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function setTheme(theme: string): void {
    modifyDOM(theme);
    localStorage.setItem('theme', theme);
    setMode(theme);
  }

  return (
    <ThemeContext.Provider value={{ theme: mode, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): [
  theme: string,
  setTheme: { (data: string): void }
] {
  const context = useContext(ThemeContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error('useTheme() was used outside of its Provider');
  }
  return [context.theme, context.setTheme];
}

export function useThemeList(): ThemeIcon[] {
  const context = useContext(ThemeContext);

  // if `undefined`, throw an error
  if (!context) {
    throw new Error('useThemeList() was used outside of its Provider');
  }
  return context.themes;
}

export function LocalTheme({
  as: Tag = 'div',
  theme,
  children,
  ...otherProps
}: LocalThemeProps): React.ReactElement {
  return (
    <Tag data-bs-theme={theme} {...otherProps}>
      {children}
    </Tag>
  );
}
