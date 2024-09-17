// suppress the findDOMNode error until the issue - https://github.com/ant-design/ant-design/issues/26136 - resolved

const consoleError = console.error.bind(console);
console.error = (errObj, ...args) => {
  if (process.env.NODE_ENV === 'development' && typeof errObj === 'string' && args.includes('findDOMNode')) {
    return;
  }
  consoleError(errObj, ...args);
};

export default {
  // TODO: change to general API gateway for all APIs
  isDev: process.env.NODE_ENV === 'development' ? true : false,
  baseUrl: import.meta.env.VITE_EPSILON_BASE_URL || 'http://localhost',
  apiPrefix: import.meta.env.VITE_EPSILON_API_PREFIX || 'http://localhost/api/v1',
  cookiePrefix: import.meta.env.VITE_EPSILON_COOKIE_PREFIX || 'epsilon',
};
