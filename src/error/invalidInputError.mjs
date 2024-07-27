import DeelError from './deelError.mjs';
import { HttpCode } from '../config/constants.mjs';

class InvalidInputError extends DeelError {
  constructor(...args) {
    super(HttpCode.HTTP_400, ...args);
    this.name = 'InvalidInputError';
  }
}

export default InvalidInputError;
