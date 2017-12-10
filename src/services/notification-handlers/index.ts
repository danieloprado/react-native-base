import { Container } from '../container';
import { NotificationService } from '../models/notification';
import { handle as openInformativeHandler } from './openInformative';

export function register(container: Container): void {
  const notificationService = container.get<NotificationService>('notificationService');

  notificationService.registerHandler('open-informative', openInformativeHandler);
}