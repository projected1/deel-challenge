import DeelError from './deelError.mjs';
import { HttpCode } from '../config/constants.mjs';

class NotFoundError extends DeelError {
  constructor(...args) {
    super(HttpCode.HTTP_404, ...args);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
