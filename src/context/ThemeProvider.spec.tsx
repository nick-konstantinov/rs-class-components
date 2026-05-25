import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './themeContext';

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('reportError', vi.fn());

    expect(() => renderHook(() => useTheme())).toThrow(
      /useTheme must be used within a ThemeProvider/,
    );
  });

  it('toggles theme between light and dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.theme).toBe('light');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });

  it('sets the data-theme attribute on <html> after toggle', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    act(() => result.current.toggleTheme());

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
