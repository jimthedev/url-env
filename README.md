# url-env

> Select an environment by url

## Install

```
pnpm install url-env
```

```bash
npm install url-env
```

## Features

- ✅ TypeScript support with full type definitions
- ✅ ES Modules and CommonJS support
- ✅ UMD build for browser usage
- ✅ Zero dependencies
- ✅ Works in Node.js and browsers
- ✅ Comprehensive test suite with 100% coverage
- ✅ Automated CI/CD with GitHub Actions
- ✅ Trusted publishing to npm

## Usage

Make sure you include polyfills for Object.prototype.entries and String.prototype.startsWith if you need this to work with older browsers.

### Basic Usage (JavaScript)

```js
import { fromObject } from 'url-env';

// Or using CommonJS
// const { fromObject } = require('url-env');

const availableEvironments = {
  'https://localhost:9300': 'local',
  'https://dev.mydomain.com': 'dev',
  'https://test.mydomain.com': 'test',
  'https://mydomain.com': 'prod'
};

const {pair, url, env} = fromObject(availableEvironments);

// When window.location.href starts with https://dev.mydomain.com
console.log(pair); // ['https://dev.mydomain.com', 'dev']
console.log(url); // 'https://dev.mydomain.com'
console.log(env); // 'dev'
```

### TypeScript Usage with Environment Objects

```typescript
import { fromObject, EnvObject } from 'url-env';

// Define your environment configuration type
interface EnvironmentConfig {
  name: string;
  apiUrl: string;
  local: boolean;
  debug?: boolean;
}

const environments = {
  'https://localhost:8100': {
    name: 'development',
    apiUrl: 'http://localhost:3000/api',
    local: true,
    debug: true
  },
  'https://staging.mydomain.com': {
    name: 'staging',
    apiUrl: 'https://api-staging.mydomain.com',
    local: false,
    debug: true
  },
  'https://mydomain.com': {
    name: 'production',
    apiUrl: 'https://api.mydomain.com',
    local: false,
    debug: false
  }
};

// TypeScript automatically infers the type from your configuration
const result: EnvObject<EnvironmentConfig> = fromObject(environments);

console.log(result.env.name);    // Type-safe access to 'name'
console.log(result.env.local);   // Type-safe boolean
console.log(result.env.apiUrl);  // Type-safe string

// Example: Configure your app based on environment
if (result.env.local) {
  console.log('Running in local development mode');
  // Enable hot reloading, detailed logging, etc.
} else {
  console.log(`Running in ${result.env.name} mode`);
}
```

### Custom URL Matching

```js
// Using strings other than window.location.href (useful for testing)
const {pair, url, env} = fromObject(availableEvironments, 'https://staging.mydomain.com/some/path');
```




