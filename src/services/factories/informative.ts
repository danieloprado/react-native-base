import { Container } from '../container';
import { InformativeService } from '../models/informative';

export function informativeFactory(container: Container): InformativeService {
  return new InformativeService(container.get('apiService'));
}