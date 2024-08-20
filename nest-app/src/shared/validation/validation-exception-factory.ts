import { HttpStatus, ValidationError } from '@nestjs/common';

export const validationExceptionFactory = (errors: ValidationError[]) => {
  const errorObj = errors.reduce((obj, err) => {
    const { property, constraints = {} } = err;
    obj[property] = Object.values(constraints);
    return obj;
  });

  const output = {
    statusCode: HttpStatus.BAD_REQUEST,
    errors: errorObj,
    error: 'Bad Request',
  };
};
