class DeelError extends Error {
  constructor(code, ...args) {
    super(...args);
    this.name = 'DeelError';
    this.code = code;
  }
}

export default DeelError;
