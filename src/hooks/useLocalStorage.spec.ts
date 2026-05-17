import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  it('returns initialValue when storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('k', 'fallback'));
    const [value] = result.current;

    expect(value).toBe('fallback');
  });

  it('reads existing serialized value from localStorage', () => {
    localStorage.setItem('k', JSON.stringify('stored'));

    const { result } = renderHook(() => useLocalStorage('k', 'fallback'));
    const [value] = result.current;

    expect(value).toBe('stored');
  });

  it('persists updates back to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>('k', ''));

    act(() => {
      const [, setValue] = result.current;
      setValue('next');
    });

    const [value] = result.current;
    expect(value).toBe('next');
    expect(localStorage.getItem('k')).toBe(JSON.stringify('next'));
  });

  it('falls back to initialValue when stored JSON is malformed', () => {
    localStorage.setItem('k', 'not-json{');

    const { result } = renderHook(() => useLocalStorage('k', 'fallback'));
    const [value] = result.current;

    expect(value).toBe('fallback');
  });

  it('supports non-string types via JSON serialization', () => {
    const { result } = renderHook(() => useLocalStorage<number>('count', 0));

    act(() => {
      const [, setValue] = result.current;
      setValue(5);
    });

    const [value] = result.current;
    expect(value).toBe(5);
    expect(localStorage.getItem('count')).toBe('5');
  });
});
