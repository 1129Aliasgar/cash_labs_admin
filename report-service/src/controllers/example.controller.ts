import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { ExampleService } from '../services/example.service';

@controller('/api')
export class ExampleController {
  constructor(
    @inject(TYPES.ExampleService) private readonly exampleService: ExampleService
  ) {}

  @httpGet('/hello')
  public hello(): { message: string } {
    return this.exampleService.getMessage();
  }

  @httpGet('/hello/:name')
  public helloName(@requestParam('name') name: string): { message: string } {
    return this.exampleService.getMessage(name);
  }
}
