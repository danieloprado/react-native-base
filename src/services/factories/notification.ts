import { Container } from '../container';
import { NotificationService } from '../models/notification';

export function notificationFactory(container: Container): NotificationService {
  return new NotificationService(
    container.get('storageService'),
    container.get('tokenService')
  );
}