import { ChurchService } from '../models/church';

export default function churchFactory(container) {
  return new ChurchService(
    container.get('apiService'),
    container.get('cacheService')
  );
}