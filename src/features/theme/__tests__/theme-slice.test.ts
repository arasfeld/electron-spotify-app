import { describe, it, expect, beforeEach } from 'vitest';

import themeReducer, {
  setThemeMode,
  setPrimaryColor,
  MANTINE_COLORS,
} from '../theme-slice';

describe('Theme Slice', () => {
  const initialState = {
    mode: 'system' as const,
    primaryColor: 'green' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = themeReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setThemeMode', () => {
    it('should set theme mode to light', () => {
      const action = setThemeMode('light');
      const state = themeReducer(initialState, action);

      expect(state.mode).toBe('light');
      expect(state.primaryColor).toBe('green'); // Should remain unchanged
    });

    it('should set theme mode to dark', () => {
      const action = setThemeMode('dark');
      const state = themeReducer(initialState, action);

      expect(state.mode).toBe('dark');
      expect(state.primaryColor).toBe('green'); // Should remain unchanged
    });

    it('should set theme mode to system', () => {
      const initialStateWithDark = {
        mode: 'dark' as const,
        primaryColor: 'blue' as const,
      };

      const action = setThemeMode('system');
      const state = themeReducer(initialStateWithDark, action);

      expect(state.mode).toBe('system');
      expect(state.primaryColor).toBe('blue'); // Should remain unchanged
    });
  });

  describe('setPrimaryColor', () => {
    it('should set primary color to a valid Mantine color', () => {
      const action = setPrimaryColor('red');
      const state = themeReducer(initialState, action);

      expect(state.primaryColor).toBe('red');
      expect(state.mode).toBe('system'); // Should remain unchanged
    });

    it('should set primary color to another valid Mantine color', () => {
      const action = setPrimaryColor('green');
      const state = themeReducer(initialState, action);

      expect(state.primaryColor).toBe('green');
      expect(state.mode).toBe('system'); // Should remain unchanged
    });

    it('should handle all valid Mantine colors', () => {
      MANTINE_COLORS.forEach((color) => {
        const action = setPrimaryColor(color);
        const state = themeReducer(initialState, action);

        expect(state.primaryColor).toBe(color);
        expect(state.mode).toBe('system'); // Should remain unchanged
      });
    });
  });

  describe('action creators', () => {
    it('should create setThemeMode action with correct payload', () => {
      const action = setThemeMode('dark');

      expect(action.type).toBe('theme/setThemeMode');
      expect(action.payload).toBe('dark');
    });

    it('should create setPrimaryColor action with correct payload', () => {
      const action = setPrimaryColor('purple');

      expect(action.type).toBe('theme/setPrimaryColor');
      expect(action.payload).toBe('purple');
    });
  });

  describe('state immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = { ...initialState };
      const action = setThemeMode('dark');
      themeReducer(originalState, action);

      expect(originalState).toEqual(initialState);
    });

    it('should not mutate the original state when changing primary color', () => {
      const originalState = { ...initialState };
      const action = setPrimaryColor('red');
      themeReducer(originalState, action);

      expect(originalState).toEqual(initialState);
    });
  });

  describe('MANTINE_COLORS constant', () => {
    it('should contain valid color values', () => {
      expect(Array.isArray(MANTINE_COLORS)).toBe(true);
      expect(MANTINE_COLORS.length).toBeGreaterThan(0);

      MANTINE_COLORS.forEach((color) => {
        expect(typeof color).toBe('string');
        expect(color.length).toBeGreaterThan(0);
      });
    });

    it('should include common colors', () => {
      const commonColors = ['blue', 'red', 'green', 'yellow', 'gray'];
      commonColors.forEach((color) => {
        expect(MANTINE_COLORS).toContain(color);
      });
    });
  });

  describe('multiple state changes', () => {
    it('should handle multiple theme mode changes', () => {
      let state = themeReducer(initialState, setThemeMode('light'));
      expect(state.mode).toBe('light');

      state = themeReducer(state, setThemeMode('dark'));
      expect(state.mode).toBe('dark');

      state = themeReducer(state, setThemeMode('system'));
      expect(state.mode).toBe('system');
    });

    it('should handle multiple primary color changes', () => {
      let state = themeReducer(initialState, setPrimaryColor('red'));
      expect(state.primaryColor).toBe('red');

      state = themeReducer(state, setPrimaryColor('green'));
      expect(state.primaryColor).toBe('green');

      state = themeReducer(state, setPrimaryColor('purple'));
      expect(state.primaryColor).toBe('purple');
    });

    it('should handle mixed theme and color changes', () => {
      let state = themeReducer(initialState, setThemeMode('dark'));
      expect(state.mode).toBe('dark');
      expect(state.primaryColor).toBe('green');

      state = themeReducer(state, setPrimaryColor('red'));
      expect(state.mode).toBe('dark');
      expect(state.primaryColor).toBe('red');

      state = themeReducer(state, setThemeMode('light'));
      expect(state.mode).toBe('light');
      expect(state.primaryColor).toBe('red');
    });
  });
});
