import { Container } from '../container';
import { IInformativeService } from '../interfaces/informative';
import { InformativeService } from '../models/informative';

export function informativeServiceFactory(container: Container): IInformativeService {
  return new InformativeService(container.get('apiService'));
}