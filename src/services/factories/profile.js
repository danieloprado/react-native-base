import { ProfileService } from '../models/profile';

export default function profileServiceFactory(container) {
  return new ProfileService(
    container.get('settings'),
    container.get('apiService'),
    container.get('cacheService'),
    container.get('notificationService'),
    container.get('storageService'),
    container.get('tokenService')
  );
}