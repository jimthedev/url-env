# url-env

> Select an environment by url

## Install

```bash
npm install url-env
```

## Usage

Make sure you include polyfills for Object.prototype.entries and String.prototype.startsWith if you need this to work with older browsers. We recommend https://polyfill.io but if you are using a framework then it may already have this covered for you.

[Codesandbox example](https://codesandbox.io/s/stoic-chandrasekhar-popoh?file=/src/App.js)


```js
const { fromObject } = require('url-env');

const availableEvironments = {
  'https://localhost:9300': 'local',
  'https://dev.mydomain.com': 'dev',
  'https://test.mydomain.com': 'test',
  'https://mydomain.com': 'prod'
};

const {pair, url, env} = fromObject(availableEvironments);

// When window.location.href starts with https://dev.mydomain.com
console.log(pair); // ['https://dev.mydomain.com', 'dev']
console.log(env); // https://dev.mydomain.com
console.log(url); // dev

```


Using strings other than window.location.href (useful when mocking)

```js
const {pair, url, env} = urlEnv.fromObject(availableEvironments, 'http://mymockurl');
```




