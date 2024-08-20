import { HttpStatus } from '@nestjs/common';

export class ServiceValidationError extends Error {
  public errors: Record<string, string[]>;
  public readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST;

  constructor(errors: Record<string, string[]> = {}) {
    super('Bad Request');
    this.name = 'ServiceValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  add(fieldName: string, reason: string): void {
    (this.errors[fieldName] ??= []).push(reason);
  }

  get hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }
}
