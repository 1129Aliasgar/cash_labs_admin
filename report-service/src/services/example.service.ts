import { injectable } from 'inversify';
import { BaseService } from './BaseService';

@injectable()
export class ExampleService extends BaseService {
  getMessage(name?: string): { message: string } {
    return {
      message: name ? `Hello, ${name}!` : 'Hello from Inversify service!',
    };
  }
}
