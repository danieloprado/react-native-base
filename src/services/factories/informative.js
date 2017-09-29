import { InformativeService } from '../models/informative';

export default function informativeServiceFactory(container) {
  return new InformativeService(
    container.get('apiService'),
    container.get('cacheService')
  );
}