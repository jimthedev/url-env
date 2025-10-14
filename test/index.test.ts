import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fromArray, fromObject, EnvObject } from '../src/index.js';

// Mock window.location for browser environment tests
const mockLocation = {
  href: 'https://test.example.com/some/path'
};

// Helper to mock window object
const mockWindow = (url: string) => {
  vi.stubGlobal('window', {
    location: { href: url }
  });
};

describe('fromArray', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should find matching environment from array with string values', () => {
    const environments: [string, string][] = [
      ['https://localhost:8100', 'local'],
      ['https://dev.example.com', 'development'],
      ['https://example.com', 'production']
    ];

    const result = fromArray(environments, 'https://dev.example.com/some/path');

    expect(result).toEqual({
      pair: ['https://dev.example.com', 'development'],
      url: 'https://dev.example.com',
      env: 'development'
    });
  });

  it('should find matching environment from array with object values', () => {
    interface EnvConfig {
      name: string;
      apiUrl: string;
      local: boolean;
    }

    const environments: [string, EnvConfig][] = [
      ['https://localhost:8100', { name: 'local', apiUrl: 'http://localhost:3000', local: true }],
      ['https://dev.example.com', { name: 'dev', apiUrl: 'https://api-dev.example.com', local: false }],
      ['https://example.com', { name: 'prod', apiUrl: 'https://api.example.com', local: false }]
    ];

    const result = fromArray(environments, 'https://localhost:8100/dashboard');

    expect(result.env.name).toBe('local');
    expect(result.env.local).toBe(true);
    expect(result.env.apiUrl).toBe('http://localhost:3000');
    expect(result.url).toBe('https://localhost:8100');
  });

  it('should use window.location.href when no matchUrl is provided', () => {
    mockWindow('https://dev.example.com/current/page');

    const environments: [string, string][] = [
      ['https://localhost:8100', 'local'],
      ['https://dev.example.com', 'development'],
      ['https://example.com', 'production']
    ];

    const result = fromArray(environments);

    expect(result.env).toBe('development');
    expect(result.url).toBe('https://dev.example.com');
  });

  it('should handle environments with longer URLs first (more specific matching)', () => {
    const environments: [string, string][] = [
      ['https://api.example.com/v1', 'api-v1'],
      ['https://api.example.com', 'api-general'],
      ['https://example.com', 'production']
    ];

    const result = fromArray(environments, 'https://api.example.com/v1/users');
    expect(result.env).toBe('api-v1');
  });

  it('should throw error when no matching environment is found', () => {
    const environments: [string, string][] = [
      ['https://dev.example.com', 'development'],
      ['https://example.com', 'production']
    ];

    expect(() => {
      fromArray(environments, 'https://unknown.domain.com');
    }).toThrow('No matching environment found.');
  });

  it('should work in Node.js environment (no window object)', () => {
    // Ensure no window object is available
    vi.unstubAllGlobals();

    const environments: [string, string][] = [
      ['https://dev.example.com', 'development'],
      ['https://example.com', 'production']
    ];

    const result = fromArray(environments, 'https://example.com/api');
    expect(result.env).toBe('production');
  });
});

describe('fromObject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should find matching environment from object with string values', () => {
    const environments = {
      'https://localhost:8100': 'local',
      'https://dev.example.com': 'development',
      'https://example.com': 'production'
    };

    const result = fromObject(environments, 'https://dev.example.com/some/path');

    expect(result).toEqual({
      pair: ['https://dev.example.com', 'development'],
      url: 'https://dev.example.com',
      env: 'development'
    });
  });

  it('should find matching environment from object with complex object values', () => {
    interface EnvironmentConfig {
      name: string;
      apiUrl: string;
      local: boolean;
      debug?: boolean;
    }

    const environments: Record<string, EnvironmentConfig> = {
      'https://localhost:8100': {
        name: 'development',
        apiUrl: 'http://localhost:3000/api',
        local: true,
        debug: true
      },
      'https://staging.example.com': {
        name: 'staging',
        apiUrl: 'https://api-staging.example.com',
        local: false,
        debug: true
      },
      'https://example.com': {
        name: 'production',
        apiUrl: 'https://api.example.com',
        local: false,
        debug: false
      }
    };

    const result: EnvObject<EnvironmentConfig> = fromObject(environments, 'https://staging.example.com/dashboard');

    expect(result.env.name).toBe('staging');
    expect(result.env.local).toBe(false);
    expect(result.env.debug).toBe(true);
    expect(result.env.apiUrl).toBe('https://api-staging.example.com');
  });

  it('should use window.location.href when no matchUrl is provided', () => {
    mockWindow('https://localhost:8100/local-dev');

    const environments = {
      'https://localhost:8100': 'local',
      'https://dev.example.com': 'development',
      'https://example.com': 'production'
    };

    const result = fromObject(environments);

    expect(result.env).toBe('local');
    expect(result.url).toBe('https://localhost:8100');
  });

  it('should handle URL prefix matching correctly', () => {
    const environments = {
      'https://app.example.com/admin': 'admin',
      'https://app.example.com': 'app',
      'https://example.com': 'main'
    };

    // Should match the most specific (longest) prefix first
    const result1 = fromObject(environments, 'https://app.example.com/admin/users');
    expect(result1.env).toBe('admin');

    // Should fall back to less specific prefix
    const result2 = fromObject(environments, 'https://app.example.com/dashboard');
    expect(result2.env).toBe('app');
  });

  it('should throw error when no matching environment is found', () => {
    const environments = {
      'https://dev.example.com': 'development',
      'https://example.com': 'production'
    };

    expect(() => {
      fromObject(environments, 'https://unknown.domain.com');
    }).toThrow('No matching environment found.');
  });

  it('should work with empty object values', () => {
    const environments = {
      'https://localhost:8100': {},
      'https://example.com': { configured: true }
    };

    const result = fromObject(environments, 'https://localhost:8100/test');
    expect(result.env).toEqual({});
    expect(result.url).toBe('https://localhost:8100');
  });
});

describe('Type Safety', () => {
  it('should maintain type safety with TypeScript', () => {
    interface CustomEnv {
      stage: 'dev' | 'prod' | 'test';
      features: string[];
      enabled: boolean;
    }

    const environments: Record<string, CustomEnv> = {
      'https://dev.example.com': {
        stage: 'dev',
        features: ['debug', 'hot-reload'],
        enabled: true
      },
      'https://example.com': {
        stage: 'prod',
        features: ['analytics'],
        enabled: true
      }
    };

    const result: EnvObject<CustomEnv> = fromObject(environments, 'https://dev.example.com');

    // These should all be type-safe
    expect(result.env.stage).toBe('dev');
    expect(result.env.features).toContain('debug');
    expect(result.env.enabled).toBe(true);
    expect(typeof result.env.enabled).toBe('boolean');
  });
});

describe('Edge Cases', () => {
  it('should handle URLs with query parameters and fragments', () => {
    const environments = {
      'https://app.example.com': 'app'
    };

    const result = fromObject(environments, 'https://app.example.com/path?param=value#section');
    expect(result.env).toBe('app');
  });

  it('should handle environments with trailing slashes', () => {
    const environments = {
      'https://example.com/': 'main',
      'https://app.example.com/api/': 'api'
    };

    const result1 = fromObject(environments, 'https://example.com/dashboard');
    expect(result1.env).toBe('main');

    const result2 = fromObject(environments, 'https://app.example.com/api/v1/users');
    expect(result2.env).toBe('api');
  });

  it('should handle case-sensitive URLs correctly', () => {
    const environments = {
      'https://Example.com': 'main'
    };

    // Should not match due to case sensitivity
    expect(() => {
      fromObject(environments, 'https://example.com/test');
    }).toThrow('No matching environment found.');

    // Should match exact case
    const result = fromObject(environments, 'https://Example.com/test');
    expect(result.env).toBe('main');
  });
});