import { Container } from '../container';
import { ChurchService } from '../models/church';

export function churchFactory(container: Container): ChurchService {
  return new ChurchService(container.get('apiService'));
}