import DeelError from './deelError.mjs';
import { HttpCode } from '../config/constants.mjs';

class UnauthorizedError extends DeelError {
  constructor(...args) {
    super(HttpCode.HTTP_403, ...args);
    this.name = 'UnauthorizedError';
  }
}

export default UnauthorizedError;
